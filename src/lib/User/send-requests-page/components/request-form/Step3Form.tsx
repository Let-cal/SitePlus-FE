import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as React from "react";
import FormField from "./FormField";
import FormFieldGroup from "./FormFieldGroup";
import FormSection from "./FormSection";


const formatNumberWithCommas = (value) => {
  const number = value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Thêm dấu phẩy
};

const Step3Form = ({ form }) => {
  const { formState, setValue, watch } = form;
  const { errors } = formState;

  React.useEffect(() => {
    // Khởi tạo criteria với attribute IDs khi component mount
    form.setValue("areaCriteria", { attributeId: 9 });
    form.setValue("budgetCriteria", { attributeId: 31 });
  }, [form]);

  // Lấy giá trị hiện tại của các trường ngân sách để hiển thị ban đầu
  const defaultBudget = watch("defaultBudget");
  const minBudget = watch("minBudget");
  const maxBudget = watch("maxBudget");

  // Hàm xử lý thay đổi giá trị ngân sách
  const handleBudgetChange = (fieldName, e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
    const formattedValue = formatNumberWithCommas(rawValue); // Định dạng với dấu phẩy
    setValue(fieldName, rawValue); // Lưu giá trị không định dạng vào form
    e.target.value = formattedValue; // Hiển thị giá trị đã định dạng trong input
    // Cập nhật criteria tương ứng
    setValue(
      `budgetCriteria.${fieldName.replace("Budget", "Value")}`,
      rawValue
    );
  };

  return (
    <FormSection title="Thông tin diện tích và ngân sách">
      {/* Diện tích section with attribute ID 9 */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center mb-2">
          <div className="flex-grow">
            <h3 className="text-md font-medium text-gray-800">
              Diện tích mong muốn (m²)
              <span className="text-red-500 ml-1">*</span>
            </h3>
          </div>
        </div>

        <Card className="shadow-sm border-orange-100">
          <div className="p-4">
            <FormField
              label="Giá trị mặc định"
              subtitle="(m²)"
              error={errors.defaultArea?.message}
              className="mb-4"
            >
              <Input
                {...form.register("defaultArea")}
                placeholder="Nhập diện tích mong muốn, ví dụ: 50"
                type="number"
                className="focus:border-orange-400"
                onChange={(e) => {
                  form.setValue("defaultArea", e.target.value);
                  form.setValue("areaCriteria.defaultValue", e.target.value);
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhập diện tích lý tưởng mà bạn đang tìm kiếm
              </p>
            </FormField>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">
                  Hoặc chỉ định khoảng
                </span>
              </div>
            </div>

            <FormFieldGroup cols={2}>
              <FormField
                label="Tối thiểu"
                subtitle="(m²)"
                error={errors.minArea?.message}
              >
                <Input
                  {...form.register("minArea")}
                  placeholder="30"
                  type="number"
                  className="focus:border-orange-400"
                  onChange={(e) => {
                    form.setValue("minArea", e.target.value);
                    form.setValue("areaCriteria.minValue", e.target.value);
                  }}
                />
              </FormField>
              <FormField
                label="Tối đa"
                subtitle="(m²)"
                error={errors.maxArea?.message}
              >
                <Input
                  {...form.register("maxArea")}
                  placeholder="100"
                  type="number"
                  className="focus:border-orange-400"
                  onChange={(e) => {
                    form.setValue("maxArea", e.target.value);
                    form.setValue("areaCriteria.maxValue", e.target.value);
                  }}
                />
              </FormField>
            </FormFieldGroup>
          </div>
        </Card>
      </div>

      {/* Ngân sách section with attribute ID 31 */}
      <div className="space-y-6">
        <div className="flex items-center mb-2">
          <div className="flex-grow">
            <h3 className="text-md font-medium text-gray-800">
              Ngân sách thuê (VNĐ/tháng)
              <span className="text-red-500 ml-1">*</span>
            </h3>
          </div>
        </div>

        <Card className="shadow-sm border-orange-100">
          <div className="p-4">
            <FormField
              label="Giá trị mặc định"
              subtitle="(VNĐ)"
              error={errors.defaultBudget?.message}
              className="mb-4"
            >
              <Input
                {...form.register("defaultBudget")}
                placeholder="Nhập ngân sách mong muốn, ví dụ: 20,000,000"
                type="text" // Chuyển từ number sang text
                defaultValue={
                  defaultBudget ? formatNumberWithCommas(defaultBudget) : ""
                }
                className="focus:border-orange-400"
                onChange={(e) => handleBudgetChange("defaultBudget", e)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhập ngân sách lý tưởng mà bạn có thể chi trả
              </p>
            </FormField>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">
                  Hoặc chỉ định khoảng
                </span>
              </div>
            </div>

            <FormFieldGroup cols={2}>
              <FormField
                label="Tối thiểu"
                subtitle="(VNĐ)"
                error={errors.minBudget?.message}
              >
                <Input
                  {...form.register("minBudget")}
                  placeholder="10,000,000"
                  type="text" // Chuyển từ number sang text
                  defaultValue={
                    minBudget ? formatNumberWithCommas(minBudget) : ""
                  }
                  className="focus:border-orange-400"
                  onChange={(e) => handleBudgetChange("minBudget", e)}
                />
              </FormField>
              <FormField
                label="Tối đa"
                subtitle="(VNĐ)"
                error={errors.maxBudget?.message}
              >
                <Input
                  {...form.register("maxBudget")}
                  placeholder="30,000,000"
                  type="text" // Chuyển từ number sang text
                  defaultValue={
                    maxBudget ? formatNumberWithCommas(maxBudget) : ""
                  }
                  className="focus:border-orange-400"
                  onChange={(e) => handleBudgetChange("maxBudget", e)}
                />
              </FormField>
            </FormFieldGroup>
          </div>
        </Card>
      </div>
    </FormSection>
  );
};

export default Step3Form;
