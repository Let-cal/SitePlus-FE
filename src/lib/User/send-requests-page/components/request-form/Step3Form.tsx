import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as React from "react";
import FormField from "./FormField";
import FormFieldGroup from "./FormFieldGroup";
import FormSection from "./FormSection";

const formatNumberWithCommas = (value) => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Step3Form = ({ form }) => {
  const { formState, setValue, watch, setError, clearErrors } = form;
  const { errors } = formState;

  React.useEffect(() => {
    form.setValue("areaCriteria", { attributeId: 9 });
    form.setValue("budgetCriteria", { attributeId: 31 });
  }, [form]);

  const handleBudgetChange = (fieldName, e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue && parseInt(rawValue) < 0) return;
    const formattedValue = formatNumberWithCommas(rawValue);
    setValue(fieldName, rawValue);
    e.target.value = formattedValue;
  };

  const handleDepositChange = (fieldName, e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue && parseInt(rawValue) < 0) return;
    const formattedValue = formatNumberWithCommas(rawValue);
    setValue(fieldName, rawValue);
    e.target.value = formattedValue;
  };

  const handleNumberChange = (fieldName, e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && !isNaN(parseInt(value)))) {
      setValue(fieldName, value);
    }
  };

  // Hàm xử lý và chuẩn hóa rentalPeriod
  const handleRentalPeriodChange = (fieldName, e) => {
    const value = e.target.value.trim();
    if (!value) {
      setValue(fieldName, "", { shouldValidate: true });
      clearErrors(fieldName);
      e.target.value = "";
      return;
    }

    const normalizedValue = removeVietnameseDiacritics(value.toLowerCase());

    const regex = /^\d+\s*(thang|nam)(\s+\d+\s*(thang|nam))?$/i;
    if (!regex.test(normalizedValue)) {
      setError(fieldName, {
        type: "manual",
        message:
          "Vui lòng nhập đúng định dạng (ví dụ: '6 tháng', '2 năm', '2 năm 3 tháng')",
      });
      return;
    }

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

    setValue(fieldName, standardizedValue, { shouldValidate: true });
    clearErrors(fieldName);
    e.target.value = standardizedValue;
  };

  const removeVietnameseDiacritics = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const budgetSubtitle =
    watch("propertyType") === "rental" ? "(VNĐ/tháng)" : "(VNĐ)";

  // Hàm ngăn chặn sự kiện Enter gây submit form
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn hành vi mặc định của Enter (submit form)
    }
  };

  return (
    <>
      <FormSection title="Thông tin diện tích">
        <Card className="shadow-sm border-orange-100">
          <div className="p-4">
            <FormField
              label="Giá trị mặc định"
              subtitle="(m²)"
              error={errors.defaultArea?.message}
            >
              <Input
                {...form.register("defaultArea")}
                placeholder="Nhập diện tích mong muốn, ví dụ: 50"
                type="number"
                min="0"
                className="focus:border-orange-400"
                onChange={(e) => handleNumberChange("defaultArea", e)}
                onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
              />
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
                  min="0"
                  className="focus:border-orange-400"
                  onChange={(e) => handleNumberChange("minArea", e)}
                  onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
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
                  min="0"
                  className="focus:border-orange-400"
                  onChange={(e) => handleNumberChange("maxArea", e)}
                  onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                />
              </FormField>
            </FormFieldGroup>
          </div>
        </Card>
      </FormSection>

      <FormSection title="Thông tin thuê và đặt cọc">
        <Card className="shadow-sm border-orange-100">
          <div className="p-4 space-y-6">
            <FormField
              label="Loại mặt bằng"
              textTheme={true}
              error={errors.propertyType?.message}
            >
              <RadioGroup
                onValueChange={(value) => setValue("propertyType", value)}
                defaultValue={watch("propertyType")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rental" id="rental" />
                  <Label htmlFor="rental">Mặt bằng cho thuê</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer">Mặt bằng chuyển nhượng</Label>
                </div>
              </RadioGroup>
            </FormField>

            {watch("propertyType") === "rental" && (
              <div>
                <h4 className="text-md font-medium text-theme-orange-500 mb-2">
                  Thời hạn cho thuê
                </h4>
                <FormFieldGroup cols={2}>
                  <FormField
                    label="Thời hạn mong muốn"
                    error={errors.rentalPeriod?.message}
                  >
                    <Input
                      {...form.register("rentalPeriod")}
                      placeholder="Ví dụ: 6 tháng hoặc 2 năm"
                      type="text"
                      className="focus:border-orange-400"
                      onBlur={(e) =>
                        handleRentalPeriodChange("rentalPeriod", e)
                      }
                      onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                    />
                  </FormField>
                  <FormField
                    label="Thời hạn tối thiểu"
                    error={errors.minRentalPeriod?.message}
                  >
                    <Input
                      {...form.register("minRentalPeriod")}
                      placeholder="Ví dụ: 1 tháng hoặc 1 năm"
                      type="text"
                      className="focus:border-orange-400"
                      onBlur={(e) =>
                        handleRentalPeriodChange("minRentalPeriod", e)
                      }
                      onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                    />
                  </FormField>
                </FormFieldGroup>
              </div>
            )}

            <div>
              <h4 className="text-md font-medium text-theme-orange-500 mb-2">
                Ngân sách chi trả (VNĐ)
              </h4>
              <FormField
                label="Giá trị mong muốn"
                subtitle={budgetSubtitle}
                error={errors.defaultBudget?.message}
              >
                <Input
                  {...form.register("defaultBudget")}
                  placeholder="20,000,000"
                  type="text"
                  defaultValue={
                    watch("defaultBudget")
                      ? formatNumberWithCommas(watch("defaultBudget"))
                      : ""
                  }
                  onChange={(e) => handleBudgetChange("defaultBudget", e)}
                  onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                />
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
                  subtitle={budgetSubtitle}
                  error={errors.minBudget?.message}
                >
                  <Input
                    {...form.register("minBudget")}
                    placeholder="10,000,000"
                    type="text"
                    defaultValue={
                      watch("minBudget")
                        ? formatNumberWithCommas(watch("minBudget"))
                        : ""
                    }
                    onChange={(e) => handleBudgetChange("minBudget", e)}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                  />
                </FormField>
                <FormField
                  label="Tối đa"
                  subtitle={budgetSubtitle}
                  error={errors.maxBudget?.message}
                >
                  <Input
                    {...form.register("maxBudget")}
                    placeholder="30,000,000"
                    type="text"
                    defaultValue={
                      watch("maxBudget")
                        ? formatNumberWithCommas(watch("maxBudget"))
                        : ""
                    }
                    onChange={(e) => handleBudgetChange("maxBudget", e)}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                  />
                </FormField>
              </FormFieldGroup>
            </div>

            <div>
              <h4 className="text-md font-medium text-theme-orange-500 mb-2">
                Tiền đặt cọc (VNĐ)
              </h4>
              <FormFieldGroup cols={2}>
                <FormField
                  label="Giá trị mong muốn"
                  error={errors.depositDefault?.message}
                >
                  <Input
                    {...form.register("depositDefault")}
                    placeholder="10,000,000"
                    type="text"
                    defaultValue={
                      watch("depositDefault")
                        ? formatNumberWithCommas(watch("depositDefault"))
                        : ""
                    }
                    onChange={(e) => handleDepositChange("depositDefault", e)}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                  />
                </FormField>
                <FormField label="Tối đa" error={errors.depositMax?.message}>
                  <Input
                    {...form.register("depositMax")}
                    placeholder="20,000,000"
                    type="text"
                    defaultValue={
                      watch("depositMax")
                        ? formatNumberWithCommas(watch("depositMax"))
                        : ""
                    }
                    onChange={(e) => handleDepositChange("depositMax", e)}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                  />
                </FormField>
              </FormFieldGroup>
            </div>

            <FormField
              label="Số tháng phải đặt cọc"
              subtitle="(tháng)"
              error={errors.depositMonths?.message}
            >
              <Input
                {...form.register("depositMonths")}
                placeholder="Nhập số tháng, ví dụ: 2"
                type="number"
                min="0"
                className="focus:border-orange-400"
                onChange={(e) => handleNumberChange("depositMonths", e)}
                onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
              />
            </FormField>
          </div>
        </Card>
      </FormSection>
    </>
  );
};

export default Step3Form;
