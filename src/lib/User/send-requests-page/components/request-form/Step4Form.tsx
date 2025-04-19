import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { adminService } from "@/services/admin/admin.service";
import { AnimatePresence, motion } from "framer-motion";
import { Building, Info, Map, MapPin } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import FormField from "./FormField";
import FormSection from "./FormSection";

const Step4Form = ({ form, areaTypes }) => {
  const { watch, setValue, formState } = form;
  const { errors } = formState;

  // State for districts and areas
  const [districts, setDistricts] = useState([]);
  const [areasByDistrict, setAreasByDistrict] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("location");

  // Get districts when component renders
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const districtsData = await adminService.getAllDistricts();
        setDistricts(districtsData);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận:", error);
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  // Get areas when districts are selected
  useEffect(() => {
    const selectedDistricts = watch("districts") || [];

    const fetchAreasForSelectedDistricts = async () => {
      const newAreasByDistrict = { ...areasByDistrict };

      for (const district of selectedDistricts) {
        const districtId = districts.find((d) => d.name === district)?.id;

        if (districtId && !newAreasByDistrict[districtId]) {
          try {
            const areasData = await adminService.getAreasByDistrict(districtId);
            newAreasByDistrict[districtId] = areasData;
          } catch (error) {
            console.error(`Lỗi khi lấy khu vực cho quận ${district}:`, error);
          }
        }
      }

      setAreasByDistrict(newAreasByDistrict);
    };

    if (selectedDistricts.length > 0 && districts.length > 0) {
      fetchAreasForSelectedDistricts();
    }
  }, [watch("districts"), districts, areasByDistrict]);

  // Get all areas for selected districts
  const getAllAreas = () => {
    const selectedDistricts = watch("districts") || [];
    let allAreas = [];

    selectedDistricts.forEach((districtName) => {
      const district = districts.find((d) => d.name === districtName);
      if (district && areasByDistrict[district.id]) {
        allAreas = [...allAreas, ...areasByDistrict[district.id]];
      }
    });

    return allAreas;
  };

  const allAreas = getAllAreas();

  // Update form values when selections change
  useEffect(() => {
    const city = watch("city") || "Thành phố Hồ Chí Minh";
    const selectedDistricts = watch("districts") || [];
    const street = watch("street") || "";
    const specificAreaIds = watch("specificAreas") || [];
    const nearbyAreaIds = watch("nearbyAreas") || [];
    const specialRequirements = watch("specialRequirements") || "";

    const allAreas = getAllAreas();
    const specificAreaNames = specificAreaIds
      .map((id) => {
        const area = allAreas.find((a) => a.id.toString() === id);
        return area ? area.name : "";
      })
      .filter((name) => name !== "");

    const nearbyAreaNames = nearbyAreaIds
      .map((id) => {
        const area = areaTypes.find((a) => a.id === id);
        return area ? area.label : "";
      })
      .filter((name) => name !== "");

    if (specificAreaNames.length > 0) {
      setValue(
        "specificAreaCriteria.defaultValue",
        specificAreaNames.join(", ")
      );
    } else {
      setValue("specificAreaCriteria.defaultValue", "");
    }

    if (nearbyAreaNames.length > 0) {
      setValue("nearbyAreaCriteria.defaultValue", nearbyAreaNames.join(", "));
    } else {
      setValue("nearbyAreaCriteria.defaultValue", "");
    }

    let locationDescription = `Tỉnh/Thành phố: ${city}`;

    if (selectedDistricts.length > 0) {
      locationDescription += ` - Quận/Huyện: ${selectedDistricts.join(", ")}`;
    }

    if (street) {
      locationDescription += ` - Đường: ${street}`;
    }

    if (specificAreaNames.length > 0) {
      locationDescription += ` - Khu vực mong muốn: ${specificAreaNames.join(
        ", "
      )}`;
    }

    if (nearbyAreaNames.length > 0) {
      locationDescription += ` - Gần khu vực: ${nearbyAreaNames.join(", ")}`;
    }

    if (specialRequirements) {
      locationDescription += ` - Yêu cầu đặc biệt: ${specialRequirements}`;
    }

    setValue("locationDescription", locationDescription);
  }, [areaTypes, getAllAreas, setValue, watch]);

  return (
    <FormSection title="Thông tin vị trí">
      <div className="space-y-6">
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-orange-500" />
              Địa chỉ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs
              defaultValue="location"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger
                  value="location"
                  className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
                >
                  Thông tin địa chỉ
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
                >
                  Khu vực & Yêu cầu
                </TabsTrigger>
              </TabsList>

              <TabsContent value="location" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField label="Thành phố">
                      <Input
                        value="Thành phố Hồ Chí Minh"
                        disabled
                        className="bg-gray-50"
                      />
                    </FormField>

                    <FormField label="Đường (tùy chọn)">
                      <Input
                        {...form.register("street")}
                        placeholder="Tên đường mong muốn"
                        className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Quận"
                    required
                    error={errors.districts?.message}
                    className="mb-6"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center py-6 border border-gray-200 rounded-md bg-gray-50">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"
                        />
                        <span className="ml-3 text-gray-600">
                          Đang tải danh sách quận...
                        </span>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border border-gray-200 rounded-md p-3 max-h-64 overflow-y-auto"
                      >
                        {districts.map((district) => (
                          <motion.div
                            key={district.id}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-orange-50 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Checkbox
                              id={`district-${district.id}`}
                              onCheckedChange={(checked) => {
                                const currentDistricts =
                                  watch("districts") || [];
                                if (checked) {
                                  setValue("districts", [
                                    ...currentDistricts,
                                    district.name,
                                  ]);
                                } else {
                                  setValue(
                                    "districts",
                                    currentDistricts.filter(
                                      (d) => d !== district.name
                                    )
                                  );
                                }
                              }}
                              checked={watch("districts")?.includes(
                                district.name
                              )}
                              className="text-orange-500 border-orange-300 focus:ring-orange-500 data-[state=checked]:bg-orange-500"
                            />
                            <Label
                              htmlFor={`district-${district.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {district.name}
                            </Label>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </FormField>

                  <div className="md:col-span-2 flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("preferences")}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Tiếp theo
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="preferences" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Building className="h-5 w-5 mr-2 text-orange-500" />
                      <h3 className="text-base font-medium">
                        Khu vực mong muốn
                      </h3>
                    </div>
                    <FormField
                      required
                      error={errors.specificAreaCriteria?.defaultValue?.message}
                    >
                      {watch("districts")?.length > 0 ? (
                        <div className="border border-gray-200 rounded-md p-3 max-h-60 overflow-y-auto bg-white">
                          {allAreas.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {allAreas.map((area) => (
                                <motion.div
                                  key={area.id}
                                  className="flex items-center space-x-2 p-2 rounded hover:bg-orange-50 transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <Checkbox
                                    id={`specific-area-${area.id}`}
                                    onCheckedChange={(checked) => {
                                      const currentSpecificAreas =
                                        watch("specificAreas") || [];
                                      if (checked) {
                                        setValue("specificAreas", [
                                          ...currentSpecificAreas,
                                          area.id.toString(),
                                        ]);
                                      } else {
                                        setValue(
                                          "specificAreas",
                                          currentSpecificAreas.filter(
                                            (a) => a !== area.id.toString()
                                          )
                                        );
                                      }
                                    }}
                                    checked={(
                                      watch("specificAreas") || []
                                    )?.includes(area.id.toString())}
                                    className="text-orange-500 border-orange-300 focus:ring-orange-500 data-[state=checked]:bg-orange-500"
                                  />
                                  <Label
                                    htmlFor={`specific-area-${area.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {area.name}
                                  </Label>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-4 text-center text-gray-500">
                              <AnimatePresence>
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex flex-col items-center"
                                >
                                  <Map className="h-10 w-10 mb-2 text-gray-400" />
                                  {Object.keys(areasByDistrict).length > 0
                                    ? "Không có khu vực được tìm thấy cho các quận đã chọn"
                                    : "Đang tải khu vực..."}
                                </motion.div>
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 border border-gray-200 rounded-md bg-gray-50">
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center"
                            >
                              <MapPin className="h-10 w-10 mb-2 text-gray-400" />
                              <p>Vui lòng chọn quận trước để xem các khu vực</p>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      )}
                    </FormField>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <Map className="h-5 w-5 mr-2 text-orange-500" />
                      <h3 className="text-base font-medium">Gần khu vực</h3>
                    </div>
                    <FormField
                      required
                      error={errors.nearbyAreaCriteria?.defaultValue?.message}
                    >
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="border border-gray-200 rounded-md p-3 bg-white"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {areaTypes.map((area) => (
                            <motion.div
                              key={area.id}
                              className="flex items-center space-x-2 p-2 rounded hover:bg-orange-50 transition-colors"
                              whileHover={{ scale: 1.02 }}
                            >
                              <Checkbox
                                id={`area-${area.id}`}
                                onCheckedChange={(checked) => {
                                  const currentAreas =
                                    watch("nearbyAreas") || [];
                                  if (checked) {
                                    setValue("nearbyAreas", [
                                      ...currentAreas,
                                      area.id,
                                    ]);
                                  } else {
                                    setValue(
                                      "nearbyAreas",
                                      currentAreas.filter((a) => a !== area.id)
                                    );
                                  }
                                }}
                                checked={watch("nearbyAreas")?.includes(
                                  area.id
                                )}
                                className="text-orange-500 border-orange-300 focus:ring-orange-500 data-[state=checked]:bg-orange-500"
                              />
                              <Label
                                htmlFor={`area-${area.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {area.label}
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </FormField>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <FormField label="Yêu cầu đặc biệt khác">
                      <div className="relative">
                        <Textarea
                          {...form.register("specialRequirements")}
                          placeholder="Nhập các yêu cầu đặc biệt khác (nếu có)"
                          className="min-h-32 focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                        />
                        <div className="absolute top-2 right-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-orange-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Bạn có thể thêm các yêu cầu đặc biệt về vị trí
                                  như: gần trường học, gần bệnh viện, yêu cầu về
                                  hướng, v.v.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </FormField>
                  </motion.div>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("location")}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      Quay lại
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <AnimatePresence>
          {watch("districts")?.length > 0 ||
          watch("specificAreas")?.length > 0 ||
          watch("nearbyAreas")?.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-white py-3">
                  <CardTitle className="text-md font-semibold text-gray-800 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-green-500" />
                    Tóm tắt thông tin vị trí
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 bg-green-50 bg-opacity-30">
                  <div className="space-y-2">
                    {watch("districts")?.length > 0 && (
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium">Quận:</span>
                        {watch("districts").map((district) => (
                          <Badge
                            key={district}
                            className="bg-white text-green-700 border-green-200 hover:bg-green-50"
                          >
                            {district}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {watch("specificAreas")?.length > 0 && (
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium">Khu vực:</span>
                        {watch("specificAreas").map((areaId) => {
                          const area = allAreas.find(
                            (a) => a.id.toString() === areaId
                          );
                          return area ? (
                            <Badge
                              key={areaId}
                              className="bg-white text-green-700 border-green-200 hover:bg-green-50"
                            >
                              {area.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}

                    {watch("nearbyAreas")?.length > 0 && (
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium">Gần:</span>
                        {watch("nearbyAreas").map((areaId) => {
                          const area = areaTypes.find((a) => a.id === areaId);
                          return area ? (
                            <Badge
                              key={areaId}
                              className="bg-white text-green-700 border-green-200 hover:bg-green-50"
                            >
                              {area.label}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}

                    {watch("street") && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Đường:</span>
                        <span className="text-sm">{watch("street")}</span>
                      </div>
                    )}

                    {watch("specialRequirements") && (
                      <div className="flex items-start">
                        <span className="text-sm font-medium mr-2">
                          Yêu cầu đặc biệt:
                        </span>
                        <span className="text-sm flex-1">
                          {watch("specialRequirements")}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-8 rounded-full ${
                activeTab === "location" ? "bg-orange-500" : "bg-orange-200"
              }`}
            ></div>
            <div
              className={`h-2 w-8 rounded-full ${
                activeTab === "preferences" ? "bg-orange-500" : "bg-orange-200"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default Step4Form;
