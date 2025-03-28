import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "@/services/admin/admin.service";
import * as React from "react";
import { useEffect, useState } from "react";
import FormField from "./FormField";
import FormSection from "./FormSection";

const Step4Form = ({ form, areaTypes }) => {
  const { watch, setValue, formState } = form;
  const { errors } = formState;

  // State cho danh sách quận và khu vực
  const [districts, setDistricts] = useState([]);
  const [areasByDistrict, setAreasByDistrict] = useState({});
  const [loading, setLoading] = useState(false);

  // Lấy danh sách quận khi component được render
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

  // Lấy danh sách khu vực khi chọn quận
  useEffect(() => {
    const selectedDistricts = watch("districts") || [];

    const fetchAreasForSelectedDistricts = async () => {
      const newAreasByDistrict = { ...areasByDistrict };

      // Chỉ lấy khu vực cho các quận đã chọn mà chưa có dữ liệu
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
  }, [watch("districts"), districts]);

  // Lấy tất cả các khu vực theo quận đã chọn
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
  useEffect(() => {
    // Lấy các giá trị từ form
    const city = watch("city") || "Thành phố Hồ Chí Minh";
    const selectedDistricts = watch("districts") || [];
    const street = watch("street") || "";
    const specificAreaIds = watch("specificAreas") || [];
    const nearbyAreaIds = watch("nearbyAreas") || [];
    const specialRequirements = watch("specialRequirements") || "";

    // Tạo danh sách tên của các khu vực đã chọn
    const allAreas = getAllAreas();
    const specificAreaNames = specificAreaIds
      .map((id) => {
        const area = allAreas.find((a) => a.id.toString() === id);
        return area ? area.name : "";
      })
      .filter((name) => name !== "");

    // Lấy tên của các khu vực lân cận đã chọn
    const nearbyAreaNames = nearbyAreaIds
      .map((id) => {
        const area = areaTypes.find((a) => a.id === id);
        return area ? area.label : "";
      })
      .filter((name) => name !== "");
    // Cập nhật giá trị cho specificAreaCriteria (attributeId: 33)
    if (specificAreaNames.length > 0) {
      setValue(
        "specificAreaCriteria.defaultValue",
        specificAreaNames.join(", ")
      );
    } else {
      setValue("specificAreaCriteria.defaultValue", "");
    }
    // Cập nhật giá trị cho nearbyAreaCriteria (attributeId: 32)
    if (nearbyAreaNames.length > 0) {
      setValue("nearbyAreaCriteria.defaultValue", nearbyAreaNames.join(", "));
    } else {
      setValue("nearbyAreaCriteria.defaultValue", "");
    }
    // Tạo chuỗi mô tả với các thành phần được phân tách bằng " - "
    let description = `Tỉnh/Thành phố: ${city}`;

    if (selectedDistricts.length > 0) {
      description += ` - Quận/Huyện: ${selectedDistricts.join(", ")}`;
    }

    if (street) {
      description += ` - Đường: ${street}`;
    }

    if (specificAreaNames.length > 0) {
      description += ` - Khu vực mong muốn: ${specificAreaNames.join(", ")}`;
    }

    if (nearbyAreaNames.length > 0) {
      description += ` - Gần khu vực: ${nearbyAreaNames.join(", ")}`;
    }

    if (specialRequirements) {
      description += ` - Yêu cầu đặc biệt: ${specialRequirements}`;
    }

    // Cập nhật description vào brandRequest
    const currentBrandRequest = form.getValues("brandRequestEntity") || {};
    setValue("brandRequestEntity", {
      ...currentBrandRequest,
      description: description,
    });
    console.log("description: ", description);
    console.log("currentBrandRequest: ", currentBrandRequest);
    // Cũng lưu description vào field riêng để dễ truy cập
    setValue("locationDescription", description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaTypes, form, setValue, watch]);

  return (
    <FormSection title="Thông tin vị trí">
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
            className="focus:border-orange-400"
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
          <div className="text-center py-3">Đang tải danh sách quận...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border border-gray-200 rounded-md p-3 max-h-64 overflow-y-auto">
            {districts.map((district) => (
              <div key={district.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`district-${district.id}`}
                  onCheckedChange={(checked) => {
                    const currentDistricts = watch("districts") || [];
                    if (checked) {
                      setValue("districts", [
                        ...currentDistricts,
                        district.name,
                      ]);
                    } else {
                      setValue(
                        "districts",
                        currentDistricts.filter((d) => d !== district.name)
                      );
                    }
                  }}
                  checked={watch("districts")?.includes(district.name)}
                  className="text-orange-500 border-orange-300 focus:ring-orange-500"
                />
                <Label
                  htmlFor={`district-${district.id}`}
                  className="text-sm cursor-pointer"
                >
                  {district.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </FormField>

      {/* Form field gốc "Gần khu vực" với danh sách cố định */}

      {/* Form field mới "Khu vực mong muốn" với dữ liệu từ API */}
      <FormField label="Khu vực mong muốn" className="mb-6">
        {watch("districts")?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border border-gray-200 rounded-md p-3 max-h-64 overflow-y-auto">
            {allAreas.length > 0 ? (
              allAreas.map((area) => (
                <div key={area.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`specific-area-${area.id}`}
                    onCheckedChange={(checked) => {
                      const currentSpecificAreas = watch("specificAreas") || [];
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
                    checked={(watch("specificAreas") || [])?.includes(
                      area.id.toString()
                    )}
                    className="text-orange-500 border-orange-300 focus:ring-orange-500"
                  />
                  <Label
                    htmlFor={`specific-area-${area.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {area.name}
                  </Label>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-2 text-gray-500">
                {Object.keys(areasByDistrict).length > 0
                  ? "Không có khu vực được tìm thấy cho các quận đã chọn"
                  : "Đang tải khu vực..."}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-3 border border-gray-200 rounded-md">
            Vui lòng chọn quận trước để xem các khu vực
          </div>
        )}
      </FormField>
      <FormField label="Gần khu vực" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border border-gray-200 rounded-md p-3">
          {areaTypes.map((area) => (
            <div key={area.id} className="flex items-center space-x-2">
              <Checkbox
                id={`area-${area.id}`}
                onCheckedChange={(checked) => {
                  const currentAreas = watch("nearbyAreas") || [];
                  if (checked) {
                    setValue("nearbyAreas", [...currentAreas, area.id]);
                  } else {
                    setValue(
                      "nearbyAreas",
                      currentAreas.filter((a) => a !== area.id)
                    );
                  }
                }}
                checked={watch("nearbyAreas")?.includes(area.id)}
                className="text-orange-500 border-orange-300 focus:ring-orange-500"
              />
              <Label
                htmlFor={`area-${area.id}`}
                className="text-sm cursor-pointer"
              >
                {area.label}
              </Label>
            </div>
          ))}
        </div>
      </FormField>
      <FormField label="Yêu cầu đặc biệt khác">
        <Textarea
          {...form.register("specialRequirements")}
          placeholder="Nhập các yêu cầu đặc biệt khác (nếu có)"
          className="min-h-32 focus:border-orange-400"
        />
      </FormField>
    </FormSection>
  );
};

export default Step4Form;
