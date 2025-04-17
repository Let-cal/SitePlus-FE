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
  const [newlyCreatedBrand, setNewlyCreatedBrand] = useState(null);

  const [industries, setIndustries] = useState([]);
  const [suggestedSegments, setSuggestedSegments] = useState([]);
  const [suggestedIndustryCategories, setSuggestedIndustryCategories] =
    useState([]);
  const [allCustomerSegments, setAllCustomerSegments] = useState([]);
  const [allIndustryCategories, setAllIndustryCategories] = useState([]);
  const [brands, setBrands] = useState([]);

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

    const brandRequestCustomerSegments = (watch("targetCustomers") || []).map(
      (segmentId) => ({
        customerSegmentId: Number(segmentId),
      })
    );
    setValue(
      "brandRequestCustomerSegmentEntities",
      brandRequestCustomerSegments,
      {
        shouldValidate: false,
      }
    );

    const selectedCategoryId = watch("targetIndustryCategory");
    if (selectedCategoryId) {
      const brandRequestIndustryCategory = {
        industryCategoryId: Number(selectedCategoryId),
      };
      setValue(
        "brandRequestIndustryCategoryEntity",
        brandRequestIndustryCategory,
        {
          shouldValidate: false,
        }
      );
    } else {
      setValue(
        "brandRequestIndustryCategoryEntity",
        { industryCategoryId: 0 },
        { shouldValidate: false }
      );
    }
  };

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
    trigger("brand");
    updateApiEntities();
  };

  useEffect(() => {
    const fetchSuggestedData = async () => {
      if (selectedIndustry) {
        const industry = industries.find(
          (item) => item.name.toLowerCase() === selectedIndustry.toLowerCase()
        );
        if (industry) {
          try {
            const segments = await ClientService.getCustomerSegmentsByIndustry(
              industry.id
            );
            setSuggestedSegments(segments);
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

  // Hàm xử lý chỉ cho phép nhập số
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Loại bỏ mọi ký tự không phải số
    setValue("representativePhone", value);
    updateApiEntities();
  };

  return (
    <FormSection title="Thông tin cơ bản">
      <div className="space-y-6">
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
                    newlyCreatedBrand={newlyCreatedBrand}
                  />
                </FormField>
                <p className="text-sm text-gray-500">
                  Nếu không tìm thấy tên thương hiệu đề xuất, hãy tạo tên cho
                  thương hiệu của bạn.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <CreateBrandDialog
                  onBrandCreated={handleBrandCreated}
                  industries={industries}
                  allCustomerSegments={allCustomerSegments}
                  allIndustryCategories={allIndustryCategories}
                  suggestedSegments={suggestedSegments}
                  suggestedIndustryCategories={suggestedIndustryCategories}
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                  type="text" // Đổi sang type="text" để xử lý regex
                  className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                  onChange={handlePhoneChange} // Sử dụng hàm xử lý chỉ nhập số
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
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-base font-medium mb-4 text-gray-800">
              Ngành nghề và Khách hàng
            </h3>
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
                value={selectedIndustry}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
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
              <div>
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
                            } else {
                              const newTargetCustomers = targetCustomers.filter(
                                (value) => value !== String(segment.id)
                              );
                              setValue("targetCustomers", newTargetCustomers);
                            }
                            updateApiEntities();
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
