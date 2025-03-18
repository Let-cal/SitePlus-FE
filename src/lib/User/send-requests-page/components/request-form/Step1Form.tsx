// Modify the brand selection part in Step1Form to use the new BrandCombobox component
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import ClientService from "@/services/client-role/client.service";
import { PlusCircle } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import BrandCombobox from "../brand/BrandCombobox";
import CreateBrandDialog from "../brand/CreateBrandDialog";
import FormField from "./FormField";
import FormSection from "./FormSection";
const Step1Form = ({ form }) => {
  const { watch, setValue, formState, trigger } = form;
  const { errors } = formState;
  const selectedIndustry = watch("industry");
  const selectedBrand = watch("brand");
  const targetCustomers = watch("targetCustomers") || [];
  const targetIndustryCategory = watch("targetIndustryCategory") || "";

  const [industries, setIndustries] = useState([]);
  const [suggestedSegments, setSuggestedSegments] = useState([]);
  const [suggestedIndustryCategories, setSuggestedIndustryCategories] =
    useState([]);
  const [allCustomerSegments, setAllCustomerSegments] = useState([]);
  const [allIndustryCategories, setAllIndustryCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Theo dõi form values
  useEffect(() => {
    console.log("Current form values:", {
      brand: watch("brand"),
      brandId: watch("brandId"),
      representativeName: watch("representativeName"),
      representativeAddress: watch("representativeAddress"),
      representativeEmail: watch("representativeEmail"),
      representativePhone: watch("representativePhone"),
      industry: watch("industry"),
      targetCustomers: watch("targetCustomers"),
      targetIndustryCategory: watch("targetIndustryCategory"),
    });
    console.log("Form errors:", formState.errors);
    // Cập nhật các entity cho API request
    updateApiEntities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, formState.errors]);

  // Hàm này sẽ cập nhật các entity cần thiết cho API request
  const updateApiEntities = () => {
    // Cập nhật brandRequest
    const brandRequest = {
      id: 0,
      brandId: watch("brandId") || 0,
      description: "", // Sẽ được cập nhật từ Step4Form
      nameCustomer: watch("representativeName") || "",
      emailCustomer: watch("representativeEmail") || "",
      phoneCustomer: watch("representativePhone") || "",
      addressCustomer: watch("representativeAddress") || "",
      status: 0, // InProgress
      createdAt: new Date().toISOString(),
    };

    setValue("brandRequestEntity", brandRequest);

    // Cập nhật brandRequestCustomerSegment
    const brandRequestCustomerSegments = (watch("targetCustomers") || []).map(
      (segmentId) => ({
        customerSegmentId: Number(segmentId),
      })
    );

    setValue(
      "brandRequestCustomerSegmentEntities",
      brandRequestCustomerSegments
    );

    // Cập nhật brandRequestIndustryCategory
    const selectedCategoryId = watch("targetIndustryCategory");

    if (selectedCategoryId) {
      const brandRequestIndustryCategory = {
        industryCategoryId: Number(selectedCategoryId),
      };

      setValue(
        "brandRequestIndustryCategoryEntity",
        brandRequestIndustryCategory
      );
    } else {
      setValue("brandRequestIndustryCategoryEntity", null);
    }
  };

  // Load industries when component mounts
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await ClientService.getIndustries();
        setIndustries(data);
      } catch (error) {
        console.error("Error fetching industries", error);
      }
    };
    fetchIndustries();
  }, []);

  // Load all customer segments from API
  useEffect(() => {
    const fetchAllSegments = async () => {
      try {
        const segments = await ClientService.getAllCustomerSegments();
        setAllCustomerSegments(segments);
      } catch (error) {
        console.error("Error fetching all customer segments", error);
      }
    };
    fetchAllSegments();
  }, []);

  // Load all industry categories from API
  useEffect(() => {
    const fetchAllIndustryCategories = async () => {
      try {
        const categories = await ClientService.getAllIndustryCategories();
        setAllIndustryCategories(categories);
      } catch (error) {
        console.error("Error fetching all industry categories", error);
      }
    };
    fetchAllIndustryCategories();
  }, []);

  // Load brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await ClientService.getAllBrands();
        setBrands(data);
        console.log("Fetched brands:", data);
      } catch (error) {
        console.error("Error fetching brands", error);
      }
    };
    fetchBrands();
  }, []);

  // Callback khi brand được tạo thành công
  const handleBrandCreated = (brand) => {
    console.log("Brand created:", brand);
    // Thêm brand mới vào state
    setBrands((prev) => [...prev, brand]);

    // Set giá trị brand trong form
    setValue("brand", brand.name);
    setValue("brandId", brand.id);

    // Trigger validation để xóa lỗi
    trigger("brand");

    // Cập nhật brandRequest entity
    updateApiEntities();
  };

  // Handle brand selection from combobox
  const handleBrandSelect = (brand) => {
    setValue("brand", brand.name);
    setValue("brandId", brand.id);
    console.log("Brand selected:", brand.name, "ID:", brand.id);
    trigger("brand");
    updateApiEntities();
  };

  // Khi industry thay đổi, lấy customer segments và industry categories theo industry
  useEffect(() => {
    const fetchSuggestedData = async () => {
      if (selectedIndustry) {
        const industry = industries.find(
          (item) => item.name.toLowerCase() === selectedIndustry.toLowerCase()
        );
        if (industry) {
          try {
            // Fetch suggested customer segments
            const segments = await ClientService.getCustomerSegmentsByIndustry(
              industry.id
            );
            setSuggestedSegments(segments);

            // Fetch suggested industry categories
            const categories =
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

  return (
    <FormSection title="Thông tin cơ bản">
      <div className="space-y-6">
        {/* Brand Selection Section with Combobox */}
        <Card className="border border-gray-200 shadow-sm">
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
                    error={errors.brand?.message}
                  />
                </FormField>
                <p className="text-sm text-gray-500">
                  Nếu không tìm thấy tên thương hiệu đề xuất, hãy tạo tên cho
                  thương hiệu của bạn.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <CreateBrandDialog onBrandCreated={handleBrandCreated} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest of the code remains the same */}
        {/* Representative Information Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-base font-medium mb-4 text-gray-800">
              Thông tin đại diện
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    form.setValue("representativeName", e.target.value);
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
                    form.setValue("representativeEmail", e.target.value);
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
                  className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                  onChange={(e) => {
                    form.setValue("representativePhone", e.target.value);
                    updateApiEntities();
                  }}
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
                    form.setValue("representativeAddress", e.target.value);
                    updateApiEntities();
                  }}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Industry and Customer Segments Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-base font-medium mb-4 text-gray-800">
              Ngành nghề và Khách hàng
            </h3>

            {/* Industry Selection */}
            <FormField
              label="Ngành nghề"
              required
              error={errors.industry?.message}
              className="mb-6"
            >
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  updateApiEntities();
                }}
                defaultValue={selectedIndustry}
              >
                <SelectTrigger className="focus-visible:ring-orange-400 focus-visible:ring-offset-0">
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
            </FormField>

            {/* Industry Categories & Customer Segments Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Industry Categories Section */}
              <div>
                {/* Suggested Industry Categories */}
                {selectedIndustry && suggestedIndustryCategories.length > 0 && (
                  <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-100">
                    <h4 className="text-sm font-semibold mb-3 text-orange-800">
                      Gợi ý phân loại ngành nghề
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestedIndustryCategories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="outline"
                          className="px-3 py-1 bg-white text-orange-700 border-orange-200 hover:bg-orange-100 cursor-pointer"
                          onClick={() => {
                            // Cập nhật trực tiếp một giá trị, không phải array
                            setValue(
                              "targetIndustryCategory",
                              String(category.id)
                            );
                            updateApiEntities();
                          }}
                        >
                          {category.name}
                          <PlusCircle className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Industry Categories Selection */}
                <FormField
                  label="Phân loại ngành nghề"
                  required
                  error={errors.targetIndustryCategory?.message}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {allIndustryCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-white transition-colors"
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
                          className="text-orange-500 border-orange-300 focus:ring-orange-500"
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormField>
              </div>

              {/* Customer Segments Section */}
              <div>
                {/* Suggested Customer Segments */}
                {selectedIndustry && suggestedSegments.length > 0 && (
                  <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-100">
                    <h4 className="text-sm font-semibold mb-3 text-orange-800">
                      Gợi ý mô hình khách hàng theo ngành
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSegments.map((segment) => (
                        <Badge
                          key={segment.id}
                          variant="outline"
                          className="px-3 py-1 bg-white text-orange-700 border-orange-200 hover:bg-orange-100 cursor-pointer"
                          onClick={() => {
                            if (!targetCustomers.includes(String(segment.id))) {
                              const newCustomers = [
                                ...targetCustomers,
                                String(segment.id),
                              ];
                              setValue("targetCustomers", newCustomers);
                              updateApiEntities();
                            }
                          }}
                        >
                          {segment.name}
                          <PlusCircle className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Customer Models */}
                <FormField
                  label="Mô hình khách hàng đang nhắm tới"
                  required
                  error={errors.targetCustomers?.message}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {allCustomerSegments.map((segment) => (
                      <div
                        key={segment.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-white transition-colors"
                      >
                        <Checkbox
                          id={`customer-${segment.id}`}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              const newTargetCustomers = [
                                ...targetCustomers,
                                String(segment.id),
                              ];
                              setValue("targetCustomers", newTargetCustomers);
                              updateApiEntities();
                            } else {
                              const newTargetCustomers = targetCustomers.filter(
                                (value) => value !== String(segment.id)
                              );
                              setValue("targetCustomers", newTargetCustomers);
                              updateApiEntities();
                            }
                          }}
                          checked={targetCustomers.includes(String(segment.id))}
                          className="text-orange-500 border-orange-300 focus:ring-orange-500"
                        />
                        <Label
                          htmlFor={`customer-${segment.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {segment.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormField>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormSection>
  );
};

export default Step1Form;
