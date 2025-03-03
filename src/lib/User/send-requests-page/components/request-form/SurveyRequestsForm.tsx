import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
  brand: z.string().min(2, { message: "Vui lòng nhập thương hiệu" }),
  representativeName: z
    .string()
    .min(1, { message: "Vui lòng nhập tên đại diện" }),
  representativeEmail: z.string().email({ message: "Email không hợp lệ" }),
  representativePhone: z
    .string()
    .min(10, { message: "Số điện thoại không hợp lệ" }),
  requestDate: z.date({ required_error: "Vui lòng chọn ngày" }),
  industry: z.string({ required_error: "Vui lòng chọn ngành nghề" }),
  targetCustomers: z
    .array(z.string())
    .min(1, { message: "Vui lòng chọn ít nhất một đối tượng khách hàng" }),

  // Step 2: Thông tin chi tiết yêu cầu
  locationType: z.string({ required_error: "Vui lòng chọn loại mặt bằng" }),
  storeProfile: z.string({ required_error: "Vui lòng chọn loại cửa hàng" }),
  otherStoreProfileInfo: z.string().optional(),

  // Step 3: Thông tin diện tích và ngân sách
  minArea: z.string().min(1, { message: "Vui lòng nhập diện tích tối thiểu" }),
  maxArea: z.string().min(1, { message: "Vui lòng nhập diện tích tối đa" }),
  minBudget: z
    .string()
    .min(1, { message: "Vui lòng nhập ngân sách tối thiểu" }),
  maxBudget: z.string().min(1, { message: "Vui lòng nhập ngân sách tối đa" }),

  // Step 4: Thông tin vị trí
  city: z.string().default("Thành phố Hồ Chí Minh"),
  districts: z
    .array(z.string())
    .min(1, { message: "Vui lòng chọn ít nhất một quận" }),
  street: z.string().optional(),
  specificAreas: z.array(z.string()).optional(),
  nearbyAreas: z.array(z.string()),
  specialRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Định nghĩa kiểu cho các trường form theo từng bước
type Step1Fields =
  | "brand"
  | "representativeName"
  | "representativeEmail"
  | "representativePhone"
  | "requestDate"
  | "industry"
  | "targetCustomers";
type Step2Fields = "locationType" | "storeProfile" | "otherStoreProfileInfo";
type Step3Fields = "minArea" | "maxArea" | "minBudget" | "maxBudget";

const SurveyRequestsForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "Thành phố Hồ Chí Minh",
      targetCustomers: [],
      nearbyAreas: [],
      districts: [],
      specificAreas: [],
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
        "representativeName",
        "representativeEmail",
        "representativePhone",
        "requestDate",
        "industry",
        "targetCustomers",
      ];
      const step1Valid = await form.trigger(step1Fields);
      canProceed = step1Valid;
    } else if (step === 2) {
      // Validate fields của Step 2
      const step2Fields: Step2Fields[] = ["locationType", "storeProfile"];
      if (storeProfile === "other") {
        step2Fields.push("otherStoreProfileInfo");
      }
      const step2Valid = await form.trigger(step2Fields);
      canProceed = step2Valid;
    } else if (step === 3) {
      // Validate fields của Step 3
      const step3Fields: Step3Fields[] = [
        "minArea",
        "maxArea",
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

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Xử lý gửi dữ liệu form ở đây
      alert("Đã gửi yêu cầu thành công!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Danh sách loại khách hàng
  const customerTypes = [
    { id: "student", label: "Học sinh/Sinh viên" },
    { id: "worker", label: "Công nhân" },
    { id: "office", label: "Nhân viên công chức" },
    { id: "children", label: "Trẻ em" },
    { id: "family", label: "Gia đình" },
    { id: "business", label: "Doanh nhân" },
  ];

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
        return <Step1Form form={form} customerTypes={customerTypes} />;
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderStepContent()}

          <FormStepButtons
            currentStep={step}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default SurveyRequestsForm;
