import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ClientService from "@/services/client-role/client.service";
import {
  Brand,
  CustomerSegment,
  Industry,
  IndustryCategory,
} from "@/services/types";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, Info, PlusCircle, RefreshCw } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import BrandCombobox from "../brand/BrandCombobox";
import CreateBrandDialog from "../brand/CreateBrandDialog";
import FormField from "./FormField";
import FormSection from "./FormSection";
import { FormValues } from "./SurveyRequestsForm";

interface Step1FormProps {
  form: UseFormReturn<FormValues>;
  onDataFetched?: (data: {
    allIndustryCategories: IndustryCategory[];
    allCustomerSegments: CustomerSegment[];
  }) => void;
}

const Step1Form = ({ form, onDataFetched }: Step1FormProps) => {
  const { watch, setValue, formState, trigger } = form;
  const { errors } = formState;
  const selectedIndustry = watch("industry");
  const selectedBrand = watch("brand");
  const targetCustomers = watch("targetCustomers") || [];
  const targetIndustryCategory = watch("targetIndustryCategory") || "";
  const [newlyCreatedBrand, setNewlyCreatedBrand] = useState(null);

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [suggestedSegments, setSuggestedSegments] = useState<CustomerSegment[]>(
    []
  );
  const [suggestedIndustryCategories, setSuggestedIndustryCategories] =
    useState<IndustryCategory[]>([]);
  const [allCustomerSegments, setAllCustomerSegments] = useState<
    CustomerSegment[]
  >([]);
  const [allIndustryCategories, setAllIndustryCategories] = useState<
    IndustryCategory[]
  >([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [isBrandFieldsEditable, setIsBrandFieldsEditable] = useState(true);
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [originalIndustry, setOriginalIndustry] = useState("");
  const [originalIndustryCategory, setOriginalIndustryCategory] = useState("");
  const [originalCustomerSegments, setOriginalCustomerSegments] = useState([]);
  const [activeTab, setActiveTab] = useState("representative");

  const updateApiEntities = () => {
    const brandRequest = {
      id: 0,
      brandId: watch("brandId") || 0,
      description: "",
      nameCustomer: watch("representativeName") || "",
      emailCustomer: watch("representativeEmail") || "",
      phoneCustomer: watch("representativePhone") || "",
      addressCustomer: watch("representativeAddress") || "",
      status: 0,
      createdAt: new Date().toISOString(),
    };
    setValue("brandRequestEntity", brandRequest, { shouldValidate: false });

    const brandCustomerSegments = (watch("targetCustomers") || []).map(
      (segmentId) => ({
        customerSegmentId: Number(segmentId),
      })
    );
    setValue("brandCustomerSegmentEntities", brandCustomerSegments, {
      shouldValidate: false,
    });

    const selectedCategoryId = watch("targetIndustryCategory");
    if (selectedCategoryId) {
      const brandIndustryCategory = {
        industryCategoryId: Number(selectedCategoryId),
      };
      setValue("brandIndustryCategoryEntity", brandIndustryCategory, {
        shouldValidate: false,
      });
    } else {
      setValue(
        "brandIndustryCategoryEntity",
        { industryCategoryId: 0 },
        { shouldValidate: false }
      );
    }

    const brandStatus = watch("brandStatus");
    if (brandStatus === 0) {
      const currentBrandData = watch("createBrandPayload") || {
        id: 0,
        name: watch("brand") || "",
        status: 0,
        createdAt: new Date().toISOString(),
      };
      form.setValue("createBrandPayload", {
        ...currentBrandData,
        brandCustomerSegment: (watch("targetCustomers") || []).map((id) => ({
          customerSegmentId: Number(id),
        })),
        brandIndustryCategory: {
          industryCategoryId: Number(watch("targetIndustryCategory") || 0),
        },
      });
    }
  };

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data: Industry[] = await ClientService.getIndustries();
        setIndustries(data);
      } catch (error) {
        console.error("Error fetching industries", error);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cả hai API đồng thời bằng Promise.all
        const [segments, categories] = await Promise.all([
          ClientService.getAllCustomerSegments(),
          ClientService.getAllIndustryCategories(),
        ]);

        // Cập nhật state sau khi cả hai API hoàn tất
        setAllCustomerSegments(segments);
        setAllIndustryCategories(categories);

        // Gọi callback onDataFetched nếu có
        if (onDataFetched) {
          onDataFetched({
            allIndustryCategories: categories,
            allCustomerSegments: segments,
          });
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [onDataFetched]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await ClientService.getAllBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands", error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const brandStatus = watch("brandStatus");
    if (brandStatus === 1) {
      setIsBrandFieldsEditable(isRequestingChanges);
    } else {
      setIsBrandFieldsEditable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("brandStatus"), isRequestingChanges]);

  useEffect(() => {
    console.log("Form errors after update:", form.formState.errors);
  }, [form.formState.errors]);

  const handleBrandCreated = async (brandData) => {
    try {
      // Create the brandData object that will be sent to the API
      const brandRequestPayload = brandData.brandData;

      // Store the brand data for later use in SurveyRequestsForm
      form.setValue("createBrandPayload", brandRequestPayload);

      // Set the newly created brand (virtual only, not actually created yet)
      const virtualBrand = {
        id: -1, // Temporary ID
        name: brandData.name,
        status: 0,
      };

      setNewlyCreatedBrand(virtualBrand);

      // Set form values
      form.setValue("brand", brandData.name, { shouldValidate: false });
      form.setValue("brandId", -1, { shouldValidate: false });
      form.setValue("industry", brandData.industry, { shouldValidate: false });
      form.setValue("targetCustomers", brandData.customerSegments, {
        shouldValidate: false,
      });
      form.setValue("targetIndustryCategory", brandData.industryCategory, {
        shouldValidate: false,
      });

      updateApiEntities();
    } catch (error) {
      console.error("Error preparing brand data:", error);
    }
  };

  const handleBrandSelect = (brand) => {
    setValue("brand", brand.name);
    setValue("brandId", brand.id);
    setValue("brandStatus", brand.status);

    // Điền dữ liệu vào các trường
    const industry = getIndustryFromCategory(brand.industryCategories[0]?.name);
    const industryCategoryId = allIndustryCategories.find(
      (cat) => cat.name === brand.industryCategories[0]?.name
    )?.id;
    const customerSegmentIds = brand.customerSegments.map(
      (cs) => allCustomerSegments.find((s) => s.name === cs.name)?.id
    );

    setValue("industry", industry);
    setValue("targetIndustryCategory", String(industryCategoryId));
    setValue("targetCustomers", customerSegmentIds.map(String));

    // Xử lý theo brandStatus
    if (brand.status === 1) {
      // Store original values for later comparison
      setValue("originalIndustry", industry);
      setValue("originalTargetIndustryCategory", String(industryCategoryId));
      setValue("originalTargetCustomers", customerSegmentIds.map(String));

      // Update local state variables to keep track of originals
      setOriginalIndustry(industry);
      setOriginalIndustryCategory(String(industryCategoryId));
      setOriginalCustomerSegments(customerSegmentIds.map(String));

      setIsBrandFieldsEditable(false);
    } else {
      setIsBrandFieldsEditable(true);
    }

    trigger("brand");
    updateApiEntities();
  };

  // Hàm hỗ trợ lấy industry từ industryCategory
  const getIndustryFromCategory = (categoryName) => {
    const category = allIndustryCategories.find(
      (cat) => cat.name === categoryName
    );
    if (category && category.industryId) {
      const industry = industries.find((ind) => ind.id === category.industryId);
      return industry ? industry.name : "";
    }
    return "";
  };

  useEffect(() => {
    const fetchSuggestedData = async () => {
      if (selectedIndustry) {
        const industry = industries.find(
          (item) => item.name.toLowerCase() === selectedIndustry.toLowerCase()
        );
        if (industry) {
          try {
            let segments: CustomerSegment[] = [];

            if (industry.id === 7) {
              segments = allCustomerSegments.filter((segment) =>
                [1, 2, 4].includes(segment.id)
              );
            } else {
              segments = await ClientService.getCustomerSegmentsByIndustry(
                industry.id
              );
            }
            setSuggestedSegments(segments);
            const categories: IndustryCategory[] =
              await ClientService.getIndustryCategoriesByIndustry(industry.id);
            setSuggestedIndustryCategories(categories);
          } catch (error) {
            console.error("Error fetching suggested data", error);
          }
        } else {
          setSuggestedSegments([]);
          setSuggestedIndustryCategories([]);
        }
      } else {
        setSuggestedSegments([]);
        setSuggestedIndustryCategories([]);
      }
    };
    fetchSuggestedData();
  }, [selectedIndustry, industries]);

  // Hàm xử lý chỉ cho phép nhập số
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Loại bỏ mọi ký tự không phải số
    setValue("representativePhone", value);
    updateApiEntities();
  };

  return (
    <FormSection title="Thông tin cơ bản">
      <div className="space-y-6">
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Thương hiệu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="space-y-2">
                <FormField
                  label="Thương hiệu"
                  required
                  error={errors.brand?.message}
                >
                  <BrandCombobox
                    brands={brands}
                    selectedBrand={selectedBrand}
                    onSelect={handleBrandSelect}
                    newlyCreatedBrand={newlyCreatedBrand}
                  />
                </FormField>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Info className="h-4 w-4 mr-1 text-orange-500" />
                  <p>
                    Nếu không tìm thấy tên thương hiệu đề xuất, hãy tạo tên cho
                    thương hiệu của bạn.
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center"
              >
                <CreateBrandDialog
                  onBrandCreated={handleBrandCreated}
                  industries={industries}
                  allCustomerSegments={allCustomerSegments}
                  allIndustryCategories={allIndustryCategories}
                  suggestedSegments={suggestedSegments}
                  suggestedIndustryCategories={suggestedIndustryCategories}
                />
              </motion.div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Thông tin người đại diện & Ngành nghề
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs
              defaultValue="representative"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger
                  value="representative"
                  className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
                >
                  Thông tin đại diện
                </TabsTrigger>
                <TabsTrigger
                  value="industry"
                  className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
                >
                  Ngành nghề & Khách hàng
                </TabsTrigger>
              </TabsList>

              <TabsContent value="representative" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <FormField
                    label="Tên đại diện"
                    required
                    error={errors.representativeName?.message}
                  >
                    <Input
                      {...form.register("representativeName")}
                      placeholder="Nhập tên đại diện"
                      className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                      onChange={(e) => {
                        setValue("representativeName", e.target.value);
                        updateApiEntities();
                      }}
                    />
                  </FormField>
                  <FormField
                    label="Email đại diện"
                    required
                    error={errors.representativeEmail?.message}
                  >
                    <Input
                      type="email"
                      {...form.register("representativeEmail")}
                      placeholder="example@company.com"
                      className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                      onChange={(e) => {
                        setValue("representativeEmail", e.target.value);
                        updateApiEntities();
                      }}
                    />
                  </FormField>
                  <FormField
                    label="Số điện thoại đại diện"
                    required
                    error={errors.representativePhone?.message}
                  >
                    <Input
                      {...form.register("representativePhone")}
                      placeholder="0901234567"
                      type="text"
                      className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                      onChange={handlePhoneChange}
                    />
                  </FormField>
                  <FormField
                    label="Địa chỉ đại diện"
                    required
                    error={errors.representativeAddress?.message}
                  >
                    <Input
                      {...form.register("representativeAddress")}
                      placeholder="Địa chỉ thường trú của đại diện"
                      className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                      onChange={(e) => {
                        setValue("representativeAddress", e.target.value);
                        updateApiEntities();
                      }}
                    />
                  </FormField>
                  <div className="md:col-span-2 flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("industry")}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Tiếp theo
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="industry" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    label="Ngành nghề"
                    required
                    error={errors.industry?.message}
                    className="mb-6"
                  >
                    <div className="flex space-x-2">
                      <Select
                        onValueChange={(value) => {
                          setValue("industry", value);
                          updateApiEntities();
                        }}
                        value={selectedIndustry}
                        disabled={!isBrandFieldsEditable}
                      >
                        <SelectTrigger className="focus-visible:ring-orange-400 focus-visible:ring-offset-0 flex-1">
                          <SelectValue placeholder="Chọn ngành nghề" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry.id} value={industry.name}>
                              {industry.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {watch("brandStatus") === 1 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={
                                  isRequestingChanges
                                    ? "destructive"
                                    : "outline"
                                }
                                size="icon"
                                onClick={() =>
                                  setIsRequestingChanges(!isRequestingChanges)
                                }
                                disabled={watch("brandStatus") !== 1}
                                className={`transition-all duration-300 ${
                                  isRequestingChanges
                                    ? "bg-red-500 hover:bg-red-600"
                                    : ""
                                }`}
                              >
                                {isRequestingChanges ? (
                                  <RefreshCw className="h-4 w-4" />
                                ) : (
                                  <Edit className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isRequestingChanges
                                ? "Hủy thay đổi"
                                : "Yêu cầu thay đổi"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormField>

                  <AnimatePresence>
                    {watch("brandStatus") === 1 && !isRequestingChanges && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-100 overflow-hidden"
                      >
                        <div className="flex items-center">
                          <Info className="h-5 w-5 text-orange-600 mr-2" />
                          <p className="text-orange-800">
                            Nếu bạn muốn thay đổi ngành nghề và mô hình khách
                            hàng mà thương hiệu mình đang nhắm tới, hãy nhấn nút
                            chỉnh sửa bên cạnh.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isRequestingChanges && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                      >
                        <Button
                          variant="outline"
                          onClick={() => {
                            setValue("industry", originalIndustry);
                            setValue(
                              "targetIndustryCategory",
                              originalIndustryCategory
                            );
                            setValue(
                              "targetCustomers",
                              originalCustomerSegments
                            );
                            setIsRequestingChanges(false);
                            setIsBrandFieldsEditable(false);
                          }}
                          className="group w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                        >
                          <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                          Khôi phục về thông tin ban đầu
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <AnimatePresence>
                        {selectedIndustry &&
                          suggestedIndustryCategories.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-100"
                            >
                              <h4 className="text-sm font-semibold mb-3 text-orange-800 flex items-center">
                                <PlusCircle className="h-4 w-4 mr-1" />
                                Gợi ý phân loại ngành nghề
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {suggestedIndustryCategories.map((category) => (
                                  <motion.div
                                    key={category.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Badge
                                      variant="outline"
                                      className={`px-3 py-1 bg-white text-orange-700 border-orange-200 ${
                                        isBrandFieldsEditable
                                          ? "hover:bg-orange-100 cursor-pointer"
                                          : "opacity-70"
                                      } transition-all duration-200`}
                                      onClick={() => {
                                        if (isBrandFieldsEditable) {
                                          setValue(
                                            "targetIndustryCategory",
                                            String(category.id)
                                          );
                                          updateApiEntities();
                                        }
                                      }}
                                    >
                                      {category.name}
                                      {isBrandFieldsEditable && (
                                        <PlusCircle className="ml-1 h-3 w-3" />
                                      )}
                                    </Badge>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                      </AnimatePresence>
                      <FormField
                        label="Phân loại ngành nghề"
                        required
                        error={errors.targetIndustryCategory?.message}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {allIndustryCategories.map((category) => (
                            <motion.div
                              key={category.id}
                              whileHover={{
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                              }}
                              className="flex items-center space-x-2 p-2 rounded transition-colors"
                            >
                              <Checkbox
                                id={`category-${category.id}`}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setValue(
                                      "targetIndustryCategory",
                                      String(category.id)
                                    );
                                  } else {
                                    setValue("targetIndustryCategory", "");
                                  }
                                  updateApiEntities();
                                }}
                                checked={
                                  targetIndustryCategory === String(category.id)
                                }
                                disabled={!isBrandFieldsEditable}
                                className="text-orange-500 border-orange-300 focus:ring-orange-500 data-[state=checked]:bg-orange-500"
                              />
                              <Label
                                htmlFor={`category-${category.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {category.name}
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                      </FormField>
                    </div>
                    <div>
                      <AnimatePresence>
                        {selectedIndustry && suggestedSegments.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-100"
                          >
                            <h4 className="text-sm font-semibold mb-3 text-orange-800 flex items-center">
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Gợi ý mô hình khách hàng theo ngành
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {suggestedSegments.map((segment) => (
                                <motion.div
                                  key={segment.id}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Badge
                                    variant="outline"
                                    className={`px-3 py-1 bg-white text-orange-700 border-orange-200 ${
                                      isBrandFieldsEditable
                                        ? "hover:bg-orange-100 cursor-pointer"
                                        : "opacity-70"
                                    } transition-all duration-200`}
                                    onClick={() => {
                                      if (
                                        isBrandFieldsEditable &&
                                        !targetCustomers.includes(
                                          String(segment.id)
                                        )
                                      ) {
                                        const newCustomers = [
                                          ...targetCustomers,
                                          String(segment.id),
                                        ];
                                        setValue(
                                          "targetCustomers",
                                          newCustomers
                                        );
                                        updateApiEntities();
                                      }
                                    }}
                                  >
                                    {segment.name}
                                    {isBrandFieldsEditable && (
                                      <PlusCircle className="ml-1 h-3 w-3" />
                                    )}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <FormField
                        label="Mô hình khách hàng đang nhắm tới"
                        required
                        error={errors.targetCustomers?.message}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {allCustomerSegments.map((segment) => (
                            <motion.div
                              key={segment.id}
                              whileHover={{
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                              }}
                              className="flex items-center space-x-2 p-2 rounded transition-colors"
                            >
                              <Checkbox
                                id={`customer-${segment.id}`}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    const newTargetCustomers = [
                                      ...targetCustomers,
                                      String(segment.id),
                                    ];
                                    setValue(
                                      "targetCustomers",
                                      newTargetCustomers
                                    );
                                  } else {
                                    const newTargetCustomers =
                                      targetCustomers.filter(
                                        (value) => value !== String(segment.id)
                                      );
                                    setValue(
                                      "targetCustomers",
                                      newTargetCustomers
                                    );
                                  }
                                  updateApiEntities();
                                }}
                                checked={targetCustomers.includes(
                                  String(segment.id)
                                )}
                                disabled={!isBrandFieldsEditable}
                                className="text-orange-500 border-orange-300 focus:ring-orange-500 data-[state=checked]:bg-orange-500"
                              />
                              <Label
                                htmlFor={`customer-${segment.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {segment.name}
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                      </FormField>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("representative")}
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

        {/* Progression indicator at bottom */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-8 rounded-full ${
                activeTab === "representative"
                  ? "bg-orange-500"
                  : "bg-orange-200"
              }`}
            ></div>
            <div
              className={`h-2 w-8 rounded-full ${
                activeTab === "industry" ? "bg-orange-500" : "bg-orange-200"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default Step1Form;
