import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  adminService,
  SiteCategory,
  StoreProfileCategory,
} from "@/services/admin/admin.service";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import FormField from "./FormField";
import FormSection from "./FormSection";

const Step2Form = ({ form }) => {
  const { watch, setValue, formState } = form;
  const { errors } = formState;
  const [siteCategories, setSiteCategories] = useState<SiteCategory[]>([]);
  const [allStoreProfileCategories, setAllStoreProfileCategories] = useState<StoreProfileCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const locationType = watch("locationType");
  const storeProfile = watch("storeProfile");

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Load both data sets in parallel for better performance
        const [siteData, profileData] = await Promise.all([
          adminService.getAllSiteCategories(),
          adminService.getAllStoreProfileCategories()
        ]);
        
        console.log("Site categories fetched:", siteData);
        console.log("All store profile categories fetched:", profileData);
        
        setSiteCategories(siteData);
        setAllStoreProfileCategories(profileData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter store profile categories based on selected locationType
  const filteredStoreProfileCategories = useMemo(() => {
    if (!locationType || !siteCategories.length) return [];

    // Find the selected site category based on locationType
    const selectedSiteCategory = siteCategories.find(
      (category) =>
        (locationType === "inside" && category.name === "Mặt bằng nội khu") ||
        (locationType === "outside" && category.name === "Mặt bằng độc lập")
    );

    if (!selectedSiteCategory) return [];

    // Filter store profiles by the selected site category id
    return allStoreProfileCategories.filter(
      (profile) => profile.siteCategoryId === selectedSiteCategory.id
    );
  }, [locationType, siteCategories, allStoreProfileCategories]);

  // Reset store profile when location type changes
  useEffect(() => {
    if (locationType) {
      setValue("storeProfile", "");
    }
  }, [locationType, setValue]);

  // Fallback UI if no site categories are loaded
  if (siteCategories.length === 0 && !isLoading) {
    return (
      <FormSection title="Thông tin chi tiết yêu cầu">
        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-600">
          Không thể tải các loại mặt bằng. Vui lòng làm mới trang hoặc thử lại
          sau.
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection title="Thông tin chi tiết yêu cầu">
      <FormField
        label="Loại mặt bằng"
        required
        error={errors.locationType?.message}
        className="mb-6"
      >
        {isLoading ? (
          <div className="p-4 border border-gray-200 rounded-md">
            Đang tải dữ liệu...
          </div>
        ) : (
          <RadioGroup
            onValueChange={(value) => {
              setValue("locationType", value);
              setValue("storeProfile", "");
            }}
            value={watch("locationType")}
            className="flex flex-col space-y-3 mt-2"
          >
            {siteCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:border-orange-300 transition-all"
              >
                <RadioGroupItem
                  value={
                    category.name === "Mặt bằng nội khu" ? "inside" : "outside"
                  }
                  id={`location-${category.id}`}
                  className="text-orange-500"
                />
                <Label
                  htmlFor={`location-${category.id}`}
                  className="font-medium cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </FormField>

      {locationType && (
        <FormField
          label="Loại cửa hàng"
          required
          error={errors.storeProfile?.message}
          className="mb-6"
        >
          <Select
            onValueChange={(value) => setValue("storeProfile", value)}
            value={watch("storeProfile")}
            disabled={isLoading || filteredStoreProfileCategories.length === 0}
          >
            <SelectTrigger className="focus:border-orange-400">
              <SelectValue
                placeholder={isLoading ? "Đang tải..." : "Chọn loại cửa hàng"}
              />
            </SelectTrigger>
            <SelectContent>
              {filteredStoreProfileCategories.map((profile) => (
                <SelectItem key={profile.id} value={profile.id.toString()}>
                  {profile.name}
                </SelectItem>
              ))}
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      )}

      {storeProfile === "other" && (
        <FormField
          label="Thông tin chi tiết loại cửa hàng"
          required
          error={errors.otherStoreProfileInfo?.message}
        >
          <Textarea
            {...form.register("otherStoreProfileInfo")}
            placeholder="Vui lòng mô tả chi tiết về loại cửa hàng mong muốn"
            className="min-h-32 focus:border-orange-400"
          />
        </FormField>
      )}
    </FormSection>
  );
};

export default Step2Form;