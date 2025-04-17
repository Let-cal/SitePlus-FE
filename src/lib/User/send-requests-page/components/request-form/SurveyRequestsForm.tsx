import clientService from "@/services/client-role/client.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import FormStepButtons from "./FormStepButtons";
import ProgressHeader from "./ProgressHeader";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import Step3Form from "./Step3Form";
import Step4Form from "./Step4Form";

// Định nghĩa schema validation cho form
const formSchema = z
  .object({
    createBrandPayload: z
      .object({
        id: z.number(),
        name: z.string(),
        status: z.number(),
        createdAt: z.string(),
        brandRequestCustomerSegment: z.array(
          z.object({
            customerSegmentId: z.number(),
          })
        ),
        brandRequestIndustryCategory: z.object({
          industryCategoryId: z.number(),
        }),
      })
      .optional(),
    brand: z.string().optional(),
    brandId: z.number().default(0).optional(),
    representativeName: z.string().optional(),
    representativeEmail: z.string().optional(),
    representativePhone: z.string().optional(),
    representativeAddress: z.string().optional(),
    industry: z.string().optional(),
    targetCustomers: z.array(z.string()).optional(),
    targetIndustryCategory: z.string().optional(),
    locationType: z.string().optional(),
    storeProfile: z.string().optional(),
    otherStoreProfileInfo: z.string().optional(),
    defaultArea: z.string().optional(),
    minArea: z.string().optional(),
    maxArea: z.string().optional(),
    defaultBudget: z.string().optional(),
    minBudget: z.string().optional(),
    maxBudget: z.string().optional(),
    propertyType: z.enum(["rental", "transfer"]).optional(),
    rentalPeriod: z.string().optional(),
    minRentalPeriod: z.string().optional(),
    depositDefault: z.string().optional(),
    depositMax: z.string().optional(),
    depositMonths: z.string().optional(),
    areaCriteria: z.object({
      attributeId: z.number().default(9),
      defaultValue: z.string().optional(),
      minValue: z.string().optional(),
      maxValue: z.string().optional(),
    }),
    budgetCriteria: z.object({
      attributeId: z.number().default(10),
      defaultValue: z.string().optional(),
      minValue: z.string().optional(),
      maxValue: z.string().optional(),
    }),
    city: z.string().default("Thành phố Hồ Chí Minh"),
    districts: z.array(z.string()).optional(),
    street: z.string().optional(),
    specificAreas: z.array(z.string()).optional(),
    nearbyAreas: z.array(z.string()),
    specialRequirements: z.string().optional(),
    brandRequestEntity: z
      .object({
        id: z.number().default(0),
        brandId: z.number().default(0),
        description: z.string().default(""),
        nameCustomer: z.string().default(""),
        emailCustomer: z.string().default(""),
        phoneCustomer: z.string().default(""),
        addressCustomer: z.string().default(""),
        status: z.number().default(0),
        createdAt: z.string().default(new Date().toISOString()),
      })
      .optional(),
    brandRequestCustomerSegmentEntities: z
      .array(z.object({ customerSegmentId: z.number() }))
      .optional(),
    brandRequestIndustryCategoryEntity: z
      .object({ industryCategoryId: z.number().default(0) })
      .optional(),
    brandRequestStoreProfileEntity: z
      .object({ storeProfileId: z.number().default(0) })
      .optional(),
    storeProfileEntity: z
      .object({
        storeProfileCategoryId: z.number().default(0),
        createdAt: z.string().default(new Date().toISOString()),
      })
      .optional(),
    storeProfileCriteriaEntities: z
      .array(
        z.object({
          storeProfileId: z.number().default(0),
          attributeId: z.number(),
          maxValue: z.string().optional(),
          minValue: z.string().optional(),
          defaultValue: z.string().optional(),
          createdAt: z.string().default(new Date().toISOString()),
        })
      )
      .optional(),
    nearbyAreaCriteria: z.object({
      attributeId: z.number().default(32),
      defaultValue: z.string().optional(),
      minValue: z.string().optional(),
      maxValue: z.string().optional(),
    }),
    specificAreaCriteria: z.object({
      attributeId: z.number().default(33),
      defaultValue: z.string().optional(),
      minValue: z.string().optional(),
      maxValue: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.propertyType === "rental" && !data.rentalPeriod) {
        return false;
      }
      return true;
    },
    {
      message: "Vui lòng nhập thời hạn cho thuê",
      path: ["rentalPeriod"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const removeVietnameseDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

type Step2Fields = "locationType" | "storeProfile" | "otherStoreProfileInfo";
type Step3Fields =
  | "defaultArea"
  | "minArea"
  | "maxArea"
  | "defaultBudget"
  | "minBudget"
  | "maxBudget"
  | "propertyType"
  | "rentalPeriod"
  | "minRentalPeriod"
  | "depositDefault"
  | "depositMax"
  | "depositMonths";

interface BrandRequestPayload {
  brandRequest: {
    id: number;
    brandId: number;
    description: string;
    nameCustomer: string;
    emailCustomer: string;
    phoneCustomer: string;
    addressCustomer: string;
    status: number;
    createdAt: string;
  };
  brandRequestStoreProfile: {
    storeProfileId: number;
  };
  storeProfile: {
    storeProfileCategoryId: number;
    createdAt: string;
  };
  storeProfileCriteria: Array<{
    storeProfileId: number;
    attributeId: number;
    maxValue: string;
    minValue: string;
    defaultValue: string;
    createdAt: string;
  }>;
}

const SurveyRequestsForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const totalSteps = 4;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      city: "Thành phố Hồ Chí Minh",
      targetCustomers: [],
      targetIndustryCategory: "",
      nearbyAreas: [],
      districts: [],
      specificAreas: [],
      brandId: 0,
      propertyType: "rental",
      areaCriteria: {
        attributeId: 9,
      },
      budgetCriteria: {
        attributeId: 31,
      },
      nearbyAreaCriteria: {
        attributeId: 32,
      },
      specificAreaCriteria: {
        attributeId: 33,
      },
      brandRequestEntity: {
        id: 0,
        brandId: 0,
        description: "",
        nameCustomer: "",
        emailCustomer: "",
        phoneCustomer: "",
        addressCustomer: "",
        status: 0,
        createdAt: new Date().toISOString(),
      },
      brandRequestCustomerSegmentEntities: [],
      brandRequestIndustryCategoryEntity: {
        industryCategoryId: 0,
      },
      brandRequestStoreProfileEntity: {
        storeProfileId: 0,
      },
      storeProfileEntity: {
        storeProfileCategoryId: 0,
        createdAt: new Date().toISOString(),
      },
      storeProfileCriteriaEntities: [],
    },
  });

  const { watch } = form;

  const storeProfile = watch("storeProfile");

  const handleNext = async () => {
    let canProceed = true;
    form.clearErrors();

    if (step === 1) {
      const brand = form.getValues("brand");
      if (!brand || brand.trim().length < 2) {
        form.setError("brand", { message: "Vui lòng nhập thương hiệu" });
        canProceed = false;
      }

      const brandId = form.getValues("brandId");
      if (!brandId && brandId !== 0) {
        form.setError("brandId", { message: "Vui lòng chọn thương hiệu" });
        canProceed = false;
      }

      const representativeName = form.getValues("representativeName");
      if (!representativeName || representativeName.trim().length < 1) {
        form.setError("representativeName", {
          message: "Vui lòng nhập tên đại diện",
        });
        canProceed = false;
      }

      const representativeEmail = form.getValues("representativeEmail");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!representativeEmail || !emailRegex.test(representativeEmail)) {
        form.setError("representativeEmail", { message: "Email không hợp lệ" });
        canProceed = false;
      }

      const representativePhone = form.getValues("representativePhone");
      const phoneRegex = /^(0[1-9][0-9]{8})$/;
      if (!representativePhone || !phoneRegex.test(representativePhone)) {
        form.setError("representativePhone", {
          message: "Số điện thoại không hợp lệ",
        });
        canProceed = false;
      }

      const representativeAddress = form.getValues("representativeAddress");
      if (!representativeAddress || representativeAddress.trim().length < 1) {
        form.setError("representativeAddress", {
          message: "Vui lòng nhập nơi thường trú của đại diện",
        });
        canProceed = false;
      }

      const industry = form.getValues("industry");
      if (!industry) {
        form.setError("industry", { message: "Vui lòng chọn ngành nghề" });
        canProceed = false;
      }

      const targetCustomers = form.getValues("targetCustomers");
      if (!targetCustomers || targetCustomers.length === 0) {
        form.setError("targetCustomers", {
          message: "Vui lòng chọn ít nhất một đối tượng khách hàng",
        });
        canProceed = false;
      }

      const targetIndustryCategory = form.getValues("targetIndustryCategory");
      if (!targetIndustryCategory) {
        form.setError("targetIndustryCategory", {
          message: "Vui lòng chọn một ngành nghề đang hướng tới",
        });
        canProceed = false;
      }

      console.log("Step 1 validation result:", canProceed);
      console.log("Form errors:", form.formState.errors);
    } else if (step === 2) {
      const step2Fields: Step2Fields[] = ["locationType", "storeProfile"];
      if (storeProfile === "other") {
        step2Fields.push("otherStoreProfileInfo");
      }
      canProceed = await form.trigger(step2Fields);

      if (!form.getValues("locationType")) {
        form.setError("locationType", {
          message: "Vui lòng chọn loại mặt bằng",
        });
        canProceed = false;
      }
      if (!form.getValues("storeProfile")) {
        form.setError("storeProfile", {
          message: "Vui lòng chọn loại cửa hàng",
        });
        canProceed = false;
      }
    } else if (step === 3) {
      const step3Fields: Step3Fields[] = [
        "defaultArea",
        "minArea",
        "maxArea",
        "defaultBudget",
        "minBudget",
        "maxBudget",
        "propertyType",
        "rentalPeriod",
        "minRentalPeriod",
        "depositDefault",
        "depositMax",
        "depositMonths",
      ];
      canProceed = await form.trigger(step3Fields);

      if (!form.getValues("defaultArea")) {
        form.setError("defaultArea", {
          message: "Vui lòng nhập diện tích mặc định",
        });
        canProceed = false;
      }
      if (!form.getValues("minArea")) {
        form.setError("minArea", {
          message: "Vui lòng nhập diện tích tối thiểu",
        });
        canProceed = false;
      }
      if (!form.getValues("maxArea")) {
        form.setError("maxArea", { message: "Vui lòng nhập diện tích tối đa" });
        canProceed = false;
      }
      if (!form.getValues("defaultBudget")) {
        form.setError("defaultBudget", {
          message: "Vui lòng nhập ngân sách mặc định",
        });
        canProceed = false;
      }
      if (!form.getValues("minBudget")) {
        form.setError("minBudget", {
          message: "Vui lòng nhập ngân sách tối thiểu",
        });
        canProceed = false;
      }
      if (!form.getValues("maxBudget")) {
        form.setError("maxBudget", {
          message: "Vui lòng nhập ngân sách tối đa",
        });
        canProceed = false;
      }
      if (!form.getValues("propertyType")) {
        form.setError("propertyType", {
          message: "Vui lòng chọn loại mặt bằng",
        });
        canProceed = false;
      }
      if (!form.getValues("depositDefault")) {
        form.setError("depositDefault", {
          message: "Vui lòng nhập tiền đặt cọc mặc định",
        });
        canProceed = false;
      }
      if (!form.getValues("depositMax")) {
        form.setError("depositMax", {
          message: "Vui lòng nhập tiền đặt cọc tối đa",
        });
        canProceed = false;
      }
      if (!form.getValues("depositMonths")) {
        form.setError("depositMonths", {
          message: "Vui lòng nhập số tháng đặt cọc",
        });
        canProceed = false;
      }
    } else if (step === 4) {
      // Validation cho Step 4
      const districts = form.getValues("districts");
      if (!districts || districts.length === 0) {
        form.setError("districts", {
          message: "Vui lòng chọn ít nhất một quận",
        });
        canProceed = false;
      }
    }

    if (canProceed && step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    const districts = data.districts || [];
    if (step !== totalSteps || districts.length === 0) {
      console.log("Form submitted prematurely or missing required Step 4 data");

      // Show error if missing required data
      if (districts.length === 0) {
        form.setError("districts", {
          message: "Vui lòng chọn ít nhất một quận",
        });
      }
      return; // Prevent API call
    }
    // Chỉ gọi API khi đang ở Step 4
    if (step !== totalSteps) {
      console.log("Form submitted prematurely at step", step);
      return; // Ngăn gọi API nếu không ở Step 4
    }

    setIsSubmitting(true);
    setApiError(null);
    console.log("rentalPeriod:", data.rentalPeriod);
    console.log("minRentalPeriod:", data.minRentalPeriod);
    try {
      let brandId = data.brandId;
      if (data.createBrandPayload && brandId <= 0) {
        try {
          const brandResponse = await clientService.createBrand(
            data.createBrandPayload
          );
          console.log("Brand creation response:", brandResponse);

          if (brandResponse && brandResponse.data && brandResponse.data.id) {
            brandId = brandResponse.data.id;
          } else {
            throw new Error("Failed to create brand");
          }
        } catch (error) {
          console.error("Error creating brand:", error);
          throw new Error(
            "Failed to create brand: " + (error.message || "Unknown error")
          );
        }
      }

      if (data.propertyType === "rental" && !data.rentalPeriod) {
        throw new Error("Vui lòng nhập thời hạn cho thuê");
      }

      const standardizePeriod = (period) => {
        if (!period || typeof period !== "string" || period.trim() === "") {
          return "";
        }

        const normalizedValue = removeVietnameseDiacritics(
          period.toLowerCase().trim()
        );
        console.log("Normalized value in standardizePeriod:", normalizedValue);

        const tokens = normalizedValue.split(/\s+/);

        let years = 0;
        let months = 0;

        for (let i = 0; i < tokens.length - 1; i++) {
          if (
            /^\d+$/.test(tokens[i]) &&
            (tokens[i + 1] === "nam" || tokens[i + 1] === "thang")
          ) {
            const value = parseInt(tokens[i]);
            const unit = tokens[i + 1];

            if (unit === "nam") {
              years += value;
            } else if (unit === "thang") {
              months += value;
            }

            i++;
          }
        }

        if (months >= 12) {
          years += Math.floor(months / 12);
          months = months % 12;
        }

        let standardizedValue = "";
        if (years > 0 && months > 0) {
          standardizedValue = `${years} năm ${months} tháng`;
        } else if (years > 0) {
          standardizedValue = `${years} năm`;
        } else if (months > 0) {
          standardizedValue = `${months} tháng`;
        }

        return standardizedValue;
      };

      const standardizedRentalPeriod =
        data.propertyType === "rental"
          ? standardizePeriod(data.rentalPeriod)
          : "";
      const standardizedMinRentalPeriod =
        data.propertyType === "rental"
          ? standardizePeriod(data.minRentalPeriod)
          : "";

      const storeProfileCriteria = [
        {
          storeProfileId: 0,
          attributeId: data.areaCriteria.attributeId,
          maxValue: data.maxArea || "",
          minValue: data.minArea || "",
          defaultValue: data.defaultArea || "",
          createdAt: new Date().toISOString(),
        },
        {
          storeProfileId: 0,
          attributeId: data.budgetCriteria.attributeId,
          maxValue: data.maxBudget || "",
          minValue: data.minBudget || "",
          defaultValue: data.defaultBudget || "",
          createdAt: new Date().toISOString(),
        },
        {
          storeProfileId: 0,
          attributeId: 37,
          maxValue:
            data.propertyType === "rental"
              ? `Mặt bằng cho thuê - Thời hạn ${standardizedRentalPeriod}`
              : "Mặt bằng chuyển nhượng",
          minValue:
            data.propertyType === "rental"
              ? `Mặt bằng cho thuê - Thời hạn ${standardizedMinRentalPeriod}`
              : "Mặt bằng chuyển nhượng",
          defaultValue:
            data.propertyType === "rental"
              ? `Mặt bằng cho thuê - Thời hạn ${standardizedRentalPeriod}`
              : "Mặt bằng chuyển nhượng",
          createdAt: new Date().toISOString(),
        },
        {
          storeProfileId: 0,
          attributeId: 38,
          maxValue: data.depositMax || "",
          minValue: data.depositDefault || "",
          defaultValue: data.depositDefault || "",
          createdAt: new Date().toISOString(),
        },
        {
          storeProfileId: 0,
          attributeId: 39,
          maxValue: `${data.depositMonths} tháng`,
          minValue: "1 tháng",
          defaultValue: `${data.depositMonths} tháng`,
          createdAt: new Date().toISOString(),
        },
        {
          storeProfileId: 0,
          attributeId: data.nearbyAreaCriteria.attributeId,
          maxValue: "",
          minValue: "",
          defaultValue: data.nearbyAreaCriteria.defaultValue || "",
          createdAt: new Date().toISOString(),
        },
        {
          storeProfileId: 0,
          attributeId: data.specificAreaCriteria.attributeId,
          maxValue: "",
          minValue: "",
          defaultValue: data.specificAreaCriteria.defaultValue || "",
          createdAt: new Date().toISOString(),
        },
      ];

      const brandRequest = {
        id: data.brandRequestEntity?.id || 0,
        brandId: brandId,
        description: data.brandRequestEntity?.description || "",
        nameCustomer: data.representativeName || "",
        emailCustomer: data.representativeEmail || "",
        phoneCustomer: data.representativePhone || "",
        addressCustomer: data.representativeAddress || "",
        status: data.brandRequestEntity?.status || 0,
        createdAt:
          data.brandRequestEntity?.createdAt || new Date().toISOString(),
      };

      const brandRequestStoreProfile = {
        storeProfileId: null,
      };

      const storeProfile = {
        storeProfileCategoryId:
          data.storeProfileEntity?.storeProfileCategoryId || 0,
        createdAt:
          data.storeProfileEntity?.createdAt || new Date().toISOString(),
      };

      const payload: BrandRequestPayload = {
        brandRequest,
        brandRequestStoreProfile,
        storeProfile,
        storeProfileCriteria,
      };

      console.log("API Payload:", payload);

      const response = await clientService.createBrandRequest(payload);
      console.log("API Response:", response);

      enqueueSnackbar(
        "Đã gửi yêu cầu thành công! Yêu cầu của bạn đã được hệ thống ghi nhận",
        {
          variant: "success",
          preventDuplicate: true,
          anchorOrigin: {
            horizontal: "left",
            vertical: "bottom",
          },
        }
      );
      form.reset();
      navigate("/home-page");
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.message || "Có lỗi xảy ra khi gửi yêu cầu.";
      setApiError(errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: "error",
        preventDuplicate: true,
        anchorOrigin: {
          horizontal: "left",
          vertical: "bottom",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const areaTypes = [
    { id: "mall", label: "Trung tâm thương mại" },
    { id: "residential", label: "Khu dân cư" },
    { id: "school", label: "Gần trường học" },
    { id: "busStation", label: "Bến xe buýt" },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1Form form={form} />;
      case 2:
        return <Step2Form form={form} />;
      case 3:
        return <Step3Form form={form} />;
      case 4:
        return <Step4Form form={form} areaTypes={areaTypes} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-100">
        <ProgressHeader currentStep={step} totalSteps={totalSteps} />

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {apiError}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {renderStepContent()}

          <FormStepButtons
            currentStep={step}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={() => {
              // Only submit if we're on the last step
              if (step === totalSteps) {
                form.handleSubmit(onSubmit)();
              }
            }}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default SurveyRequestsForm;
