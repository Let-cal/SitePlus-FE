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
const formSchema = z.object({
  // Step 1: Thông tin cơ bản
  brand: z
    .string({ required_error: "Vui lòng nhập thương hiệu" })
    .min(2, { message: "Vui lòng nhập thương hiệu" }),
  brandId: z.number().default(0),
  representativeName: z
    .string()
    .min(1, { message: "Vui lòng nhập tên đại diện" }),
  representativeEmail: z.string().email({ message: "Email không hợp lệ" }),
  representativePhone: z
    .string()
    .min(10, { message: "Số điện thoại không hợp lệ" })
    .max(10, "Số điện thoại không hợp lệ"),
  representativeAddress: z
    .string()
    .min(1, { message: "Vui lòng nhập nơi thường trú của đại diện" }),
  industry: z.string({ required_error: "Vui lòng chọn ngành nghề" }),
  targetCustomers: z
    .array(z.string())
    .min(1, { message: "Vui lòng chọn ít nhất một đối tượng khách hàng" }),

  // Thay đổi từ array sang string
  targetIndustryCategory: z
    .string()
    .min(1, { message: "Vui lòng chọn một ngành nghề đang hướng tới" }),

  // Step 2: Thông tin chi tiết yêu cầu
  locationType: z.string({ required_error: "Vui lòng chọn loại mặt bằng" }),
  storeProfile: z
    .string({ required_error: "Vui lòng chọn loại cửa hàng" })
    .min(1, { message: "Vui lòng chọn loại cửa hàng" }),
  otherStoreProfileInfo: z.string().optional(),

  // Step 3: Thông tin diện tích và ngân sách
  defaultArea: z
    .string()
    .min(1, { message: "Vui lòng nhập diện tích mặc định" }),
  minArea: z.string().min(1, { message: "Vui lòng nhập diện tích tối thiểu" }),
  maxArea: z.string().min(1, { message: "Vui lòng nhập diện tích tối đa" }),

  defaultBudget: z
    .string()
    .min(1, { message: "Vui lòng nhập ngân sách mặc định" }),
  minBudget: z
    .string()
    .min(1, { message: "Vui lòng nhập ngân sách tối thiểu" }),
  maxBudget: z.string().min(1, { message: "Vui lòng nhập ngân sách tối đa" }),
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
  // Step 4: Thông tin vị trí
  city: z.string().default("Thành phố Hồ Chí Minh"),
  districts: z
    .array(z.string())
    .min(1, { message: "Vui lòng chọn ít nhất một quận" }),
  street: z.string().optional(),
  specificAreas: z.array(z.string()).optional(),
  nearbyAreas: z.array(z.string()),
  specialRequirements: z.string().optional(),

  // Thêm trường để lưu trữ các entity API
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
    .array(
      z.object({
        customerSegmentId: z.number(),
      })
    )
    .optional(),

  // Thay đổi từ array sang object đơn lẻ
  brandRequestIndustryCategoryEntity: z
    .object({
      industryCategoryId: z.number().default(0),
    })
    .optional(),

  brandRequestStoreProfileEntity: z
    .object({
      storeProfileId: z.number().default(0),
    })
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
});

type FormValues = z.infer<typeof formSchema>;

// Định nghĩa kiểu cho các trường form theo từng bước
type Step1Fields =
  | "brand"
  | "brandId"
  | "representativeName"
  | "representativeEmail"
  | "representativePhone"
  | "representativeAddress"
  | "industry"
  | "targetCustomers"
  | "targetIndustryCategory"; // Đã thay đổi từ targetIndustryCategories
type Step2Fields = "locationType" | "storeProfile" | "otherStoreProfileInfo";
type Step3Fields =
  | "defaultArea"
  | "minArea"
  | "maxArea"
  | "defaultBudget"
  | "minBudget"
  | "maxBudget";

// Define interface that matches the API expected structure
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
  brandRequestCustomerSegment: Array<{
    customerSegmentId: number;
  }>;
  brandRequestIndustryCategory: {
    industryCategoryId: number;
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
    defaultValues: {
      city: "Thành phố Hồ Chí Minh",
      targetCustomers: [],
      targetIndustryCategory: "", // Thay đổi từ array thành string
      nearbyAreas: [],
      districts: [],
      specificAreas: [],
      brandId: 0,
      // Add new default values
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
      // Thêm các entity mặc định
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

  // Lấy giá trị của các trường để điều khiển logic
  const storeProfile = watch("storeProfile");

  const handleNext = async () => {
    let canProceed = false;

    if (step === 1) {
      // Validate fields của Step 1
      const step1Fields: Step1Fields[] = [
        "brand",
        "brandId",
        "representativeName",
        "representativeEmail",
        "representativePhone",
        "representativeAddress",
        "industry",
        "targetCustomers",
        "targetIndustryCategory",
      ];
      const step1Valid = await form.trigger(step1Fields);
      console.log("Step 1 validation result:", step1Valid);
      console.log("Form errors:", form.formState.errors);
      canProceed = step1Valid;
    } else if (step === 2) {
      const step2Fields: Step2Fields[] = ["locationType", "storeProfile"];
      if (storeProfile === "other") {
        step2Fields.push("otherStoreProfileInfo");
      }
      const step2Valid = await form.trigger(step2Fields);
      console.log("Step 2 validation result:", step2Valid);
      console.log("locationType value:", watch("locationType"));
      console.log("storeProfile value:", watch("storeProfile"));
      console.log("Form errors:", form.formState.errors);
      canProceed = step2Valid;
    } else if (step === 3) {
      // Validate fields của Step 3
      const step3Fields: Step3Fields[] = [
        "defaultArea",
        "minArea",
        "maxArea",
        "defaultBudget",
        "minBudget",
        "maxBudget",
      ];
      const step3Valid = await form.trigger(step3Fields);
      canProceed = step3Valid;
    }

    if (canProceed && step < totalSteps) {
      setStep(step + 1);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      // Tạo storeProfileCriteria từ dữ liệu form
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
          attributeId: data.nearbyAreaCriteria.attributeId, // 32
          maxValue: "",
          minValue: "",
          defaultValue: data.nearbyAreaCriteria.defaultValue || "",
          createdAt: new Date().toISOString(),
        },
        {
          storeProfileId: 0,
          attributeId: data.specificAreaCriteria.attributeId, // 33
          maxValue: "",
          minValue: "",
          defaultValue: data.specificAreaCriteria.defaultValue || "",
          createdAt: new Date().toISOString(),
        },
      ];

      // Fix 3: Ensure all required properties are non-optional
      const brandRequest = {
        id: data.brandRequestEntity?.id || 0,
        brandId: data.brandRequestEntity?.brandId || 0,
        description: data.brandRequestEntity?.description || "",
        nameCustomer: data.representativeName || "",
        emailCustomer: data.representativeEmail || "",
        phoneCustomer: data.representativePhone || "",
        addressCustomer: data.representativeAddress || "",
        status: data.brandRequestEntity?.status || 0,
        createdAt:
          data.brandRequestEntity?.createdAt || new Date().toISOString(),
      };

      // Ensure all required properties for other entities
      const brandRequestStoreProfile = {
        storeProfileId: null,
      };

      // Convert customerSegment entities to required format
      const brandRequestCustomerSegment = data.targetCustomers.map((id) => ({
        customerSegmentId: parseInt(id),
      }));

      // Convert industryCategory entities to required format
      const brandRequestIndustryCategory = {
        industryCategoryId: parseInt(data.targetIndustryCategory[0] || "0"),
      };

      const storeProfile = {
        storeProfileCategoryId:
          data.storeProfileEntity?.storeProfileCategoryId || 0,
        createdAt:
          data.storeProfileEntity?.createdAt || new Date().toISOString(),
      };

      // Chuẩn bị payload cho API theo định dạng yêu cầu
      const payload: BrandRequestPayload = {
        brandRequest,
        brandRequestStoreProfile,
        brandRequestCustomerSegment,
        brandRequestIndustryCategory,
        storeProfile,
        storeProfileCriteria,
      };

      console.log("API Payload:", payload);

      // Fix 2: Use the imported service directly
      const response = await clientService.createBrandRequest(payload);
      console.log("API Response:", response);

      // Hiển thị thông báo thành công

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
      setApiError("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
      enqueueSnackbar(apiError, {
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

  // Danh sách khu vực
  const areaTypes = [
    { id: "mall", label: "Trung tâm thương mại" },
    { id: "residential", label: "Khu dân cư" },
    { id: "school", label: "Gần trường học" },
    { id: "busStation", label: "Bến xe buýt" },
  ];

  // Render form dựa trên step hiện tại
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderStepContent()}

          <FormStepButtons
            currentStep={step}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={() => {
              console.log("Next button clicked");
              handleNext();
            }}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default SurveyRequestsForm;
