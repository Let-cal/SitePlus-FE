import { Input } from "@/components/ui/input";
import * as React from "react";
import FormField from "./FormField";
import FormFieldGroup from "./FormFieldGroup";
import FormSection from "./FormSection";

const Step3Form = ({ form }) => {
  const { formState } = form;
  const { errors } = formState;

  return (
    <FormSection title="Thông tin diện tích và ngân sách">
      <FormField label="Diện tích mong muốn (m²)" required className="mb-6">
        <FormFieldGroup cols={2}>
          <FormField label="Tối thiểu" error={errors.minArea?.message}>
            <Input
              {...form.register("minArea")}
              placeholder="30"
              type="number"
              className="focus:border-orange-400"
            />
          </FormField>
          <FormField label="Tối đa" error={errors.maxArea?.message}>
            <Input
              {...form.register("maxArea")}
              placeholder="100"
              type="number"
              className="focus:border-orange-400"
            />
          </FormField>
        </FormFieldGroup>
      </FormField>

      <FormField label="Ngân sách thuê (VNĐ/tháng)" required>
        <FormFieldGroup cols={2}>
          <FormField label="Tối thiểu" error={errors.minBudget?.message}>
            <Input
              {...form.register("minBudget")}
              placeholder="10,000,000"
              type="number"
              className="focus:border-orange-400"
            />
          </FormField>
          <FormField label="Tối đa" error={errors.maxBudget?.message}>
            <Input
              {...form.register("maxBudget")}
              placeholder="30,000,000"
              type="number"
              className="focus:border-orange-400"
            />
          </FormField>
        </FormFieldGroup>
      </FormField>
    </FormSection>
  );
};

export default Step3Form;
