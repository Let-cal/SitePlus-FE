import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  adminService,
  SiteCategory,
  StoreProfileCategory,
} from "@/services/admin/admin.service";
import { AnimatePresence, motion } from "framer-motion";
import { Info, PlusCircle } from "lucide-react";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import FormField from "./FormField";
import FormSection from "./FormSection";

const Step2Form = ({ form }) => {
  const { watch, setValue, formState } = form;
  const { errors } = formState;
  const [siteCategories, setSiteCategories] = useState<SiteCategory[]>([]);
  const [allStoreProfileCategories, setAllStoreProfileCategories] = useState<
    StoreProfileCategory[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProfiles, setSuggestedProfiles] = useState<
    StoreProfileCategory[]
  >([]);

  const locationType = watch("locationType");
  const storeProfile = watch("storeProfile");
  const brandId = watch("brandId");

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      if (
        siteCategories.length === 0 ||
        allStoreProfileCategories.length === 0
      ) {
        setIsLoading(true);
        try {
          // Load both data sets in parallel for better performance
          const [siteData, profileData] = await Promise.all([
            adminService.getAllSiteCategories(),
            adminService.getAllStoreProfileCategories(),
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
      }
    };

    fetchAllData();
  }, [siteCategories.length, allStoreProfileCategories.length]);

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

  // Set suggested profiles
  useEffect(() => {
    if (filteredStoreProfileCategories.length > 0) {
      // Filter out "Khác" options from suggestions
      const nonOtherProfiles = filteredStoreProfileCategories
        .filter((profile) => profile.name !== "Khác")
        .slice(0, 3); // Just use first 3 non-"Khác" profiles as suggestions
      setSuggestedProfiles(nonOtherProfiles);
    } else {
      setSuggestedProfiles([]);
    }
  }, [filteredStoreProfileCategories]);

  // Reset store profile when location type changes
  useEffect(() => {
    if (locationType) {
      setValue("storeProfile", "");

      // Reset storeProfileEntity when locationType changes
      setValue("storeProfileEntity", {
        brandId: brandId || 0,
        storeProfileCategoryId: 0,
        createdAt: new Date().toISOString(),
      });
    }
  }, [locationType, setValue, brandId]);

  // Check if the selected profile is one of the "Khác" options
  const isOtherOption = useMemo(() => {
    if (!storeProfile) return false;
    const selectedProfileId = parseInt(storeProfile, 10);
    return selectedProfileId === 14 || selectedProfileId === 15;
  }, [storeProfile]);

  // Update storeProfileEntity when storeProfile changes
  useEffect(() => {
    if (storeProfile) {
      // Update storeProfileEntity with new storeProfileCategoryId
      setValue("storeProfileEntity", {
        brandId: brandId || 0,
        storeProfileCategoryId: parseInt(storeProfile, 10),
        createdAt: new Date().toISOString(),
      });

      console.log("Updated storeProfileEntity:", {
        brandId: brandId || 0,
        storeProfileCategoryId: parseInt(storeProfile, 10),
        createdAt: new Date().toISOString(),
      });
    }
  }, [storeProfile, setValue, brandId]);

  // Handle updating the description field when otherStoreProfileInfo changes
  const handleOtherStoreProfileInfoChange = (e) => {
    const otherInfo = e.target.value;
    setValue("otherStoreProfileInfo", otherInfo);
    if (otherInfo) {
      setValue(
        "storeProfileDescription",
        `Loại cửa hàng mong muốn: ${otherInfo}`
      );
    } else {
      setValue("storeProfileDescription", "");
    }
  };

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
      <div className="space-y-6">
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Loại mặt bằng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-gray-500 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </motion.div>
                <span>Đang tải dữ liệu...</span>
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
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center space-x-3 p-4 border ${
                      locationType ===
                      (category.name === "Mặt bằng nội khu"
                        ? "inside"
                        : "outside")
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200"
                    } rounded-md transition-all duration-200`}
                  >
                    <RadioGroupItem
                      value={
                        category.name === "Mặt bằng nội khu"
                          ? "inside"
                          : "outside"
                      }
                      id={`location-${category.id}`}
                      className="text-orange-500"
                    />
                    <Label
                      htmlFor={`location-${category.id}`}
                      className="font-medium cursor-pointer flex-1"
                    >
                      {category.name}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-orange-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Thông tin về {category.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                ))}
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        <AnimatePresence>
          {locationType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Loại cửa hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <FormField
                    label="Loại cửa hàng"
                    required
                    error={errors.storeProfile?.message}
                    className="mb-6"
                  >
                    {suggestedProfiles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-100"
                      >
                        <h4 className="text-sm font-semibold mb-3 text-orange-800 flex items-center">
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Gợi ý loại cửa hàng phổ biến
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {suggestedProfiles.map((profile) => (
                            <motion.div
                              key={profile.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                variant="outline"
                                className="px-3 py-1 bg-white text-orange-700 border-orange-200 hover:bg-orange-100 cursor-pointer transition-all duration-200"
                                onClick={() => {
                                  setValue(
                                    "storeProfile",
                                    profile.id.toString()
                                  );
                                }}
                              >
                                {profile.name}
                                <PlusCircle className="ml-1 h-3 w-3" />
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <Select
                      onValueChange={(value) => {
                        setValue("storeProfile", value);
                        // Clear the otherStoreProfileInfo when changing selection
                        if (!isOtherOption) {
                          setValue("otherStoreProfileInfo", "");
                        }
                      }}
                      value={watch("storeProfile")}
                      disabled={
                        isLoading || filteredStoreProfileCategories.length === 0
                      }
                    >
                      <SelectTrigger className="focus-visible:ring-orange-400 focus-visible:ring-offset-0">
                        <SelectValue
                          placeholder={
                            isLoading ? "Đang tải..." : "Chọn loại cửa hàng"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStoreProfileCategories.map((profile) => (
                          <SelectItem
                            key={profile.id}
                            value={profile.id.toString()}
                          >
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <AnimatePresence>
                    {isOtherOption && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FormField
                          label="Thông tin chi tiết loại cửa hàng"
                          required
                          error={errors.otherStoreProfileInfo?.message}
                        >
                          <Textarea
                            value={watch("otherStoreProfileInfo") || ""}
                            onChange={handleOtherStoreProfileInfoChange}
                            placeholder="Vui lòng mô tả chi tiết về loại cửa hàng mong muốn"
                            className="min-h-32 focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                          />
                        </FormField>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FormSection>
  );
};

export default Step2Form;
