import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import * as React from "react";
import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("area");

  React.useEffect(() => {
    form.setValue("areaCriteria", { attributeId: 9 });
    form.setValue("budgetCriteria", { attributeId: 31 });
  }, [form]);

  const handleBudgetChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue && parseInt(rawValue) < 0) return;
    const formattedValue = formatNumberWithCommas(rawValue);
    setValue(fieldName, rawValue);
    e.target.value = formattedValue;
  };

  const handleDepositChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue && parseInt(rawValue) < 0) return;
    const formattedValue = formatNumberWithCommas(rawValue);
    setValue(fieldName, rawValue);
    e.target.value = formattedValue;
  };

  const handleNumberChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
      setValue(fieldName, value);

      if (parseFloat(value) < 0) {
        setValue(fieldName, Math.abs(parseFloat(value)).toString());
        e.target.value = Math.abs(parseFloat(value)).toString();
      }
    } else {
      setValue(fieldName, Math.abs(parseFloat(value)).toString());
      e.target.value = Math.abs(parseFloat(value)).toString();
    }
  };

  // Hàm xử lý và chuẩn hóa rentalPeriod
  const handleRentalPeriodChange = (
    fieldName: string,
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.trim();
    if (!value) {
      setValue(fieldName, "", { shouldValidate: true });
      clearErrors(fieldName);
      e.target.value = "";
      return;
    }

    const normalizedValue = removeVietnameseDiacritics(value.toLowerCase());

    // Regex kiểm tra định dạng: số + (tháng/năm) + [số + (tháng/năm)]
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

    // Phân tích và tính toán thời gian
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

    // Chuyển đổi tháng sang năm nếu cần
    if (months >= 12) {
      years += Math.floor(months / 12);
      months = months % 12;
    }

    // Tạo chuỗi kết quả đã chuẩn hóa
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
    if (e.key === "-" || e.key === "e") {
      e.preventDefault();
    }
  };

  return (
    <FormSection title="Thông tin yêu cầu khảo sát">
      <div className="space-y-6">
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Thông tin chi tiết mặt bằng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs
              defaultValue="area"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger
                  value="area"
                  className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
                >
                  Thông tin diện tích
                </TabsTrigger>
                <TabsTrigger
                  value="budget"
                  className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
                >
                  Ngân sách & Đặt cọc
                </TabsTrigger>
              </TabsList>

              <TabsContent value="area" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <div className="mb-4">
                      <div className="mb-4 p-4 rounded-lg bg-orange-50 border border-orange-100">
                        <div className="flex items-center">
                          <Info className="h-5 w-5 text-orange-600 mr-2" />
                          <p className="text-orange-800">
                            Hãy cung cấp thông tin về diện tích mặt bằng mong
                            muốn. Bạn có thể nhập giá trị cụ thể hoặc khoảng
                            diện tích.
                          </p>
                        </div>
                      </div>
                      <FormField
                        label="Loại mặt bằng"
                        textTheme={true}
                        error={errors.propertyType?.message}
                        className="mb-4"
                      >
                        <RadioGroup
                          onValueChange={(value) =>
                            setValue("propertyType", value)
                          }
                          defaultValue={watch("propertyType")}
                          className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6"
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md bg-gray-50 cursor-pointer"
                          >
                            <RadioGroupItem
                              value="rental"
                              id="rental"
                              className="text-orange-500 border-orange-300 focus:ring-orange-500"
                            />
                            <Label htmlFor="rental" className="cursor-pointer">
                              Mặt bằng cho thuê
                            </Label>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md bg-gray-50 cursor-pointer"
                          >
                            <RadioGroupItem
                              value="transfer"
                              id="transfer"
                              className="text-orange-500 border-orange-300 focus:ring-orange-500"
                            />
                            <Label
                              htmlFor="transfer"
                              className="cursor-pointer"
                            >
                              Mặt bằng chuyển nhượng
                            </Label>
                          </motion.div>
                        </RadioGroup>
                      </FormField>
                    </div>

                    <FormField
                      label="Giá trị diện tích mong muốn"
                      subtitle="(m²)"
                      error={errors.defaultArea?.message}
                    >
                      <Input
                        {...form.register("defaultArea")}
                        placeholder="Nhập diện tích mong muốn, ví dụ: 50"
                        type="number"
                        min="0"
                        className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleNumberChange("defaultArea", e)
                        }
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const target = e.target;
                          target.value = Math.abs(
                            parseFloat(target.value)
                          ).toString();
                          if (parseFloat(target.value) < 0) target.value = "0";
                        }}
                        onKeyDown={handleKeyDown}
                      />
                    </FormField>

                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-xs text-gray-500">
                          Và chỉ định khoảng diện tích
                        </span>
                      </div>
                    </div>

                    <FormFieldGroup cols={2}>
                      <FormField
                        label="Diện tích tối thiểu"
                        subtitle="(m²)"
                        error={errors.minArea?.message}
                      >
                        <Input
                          {...form.register("minArea")}
                          placeholder="Ví dụ: 30m²"
                          type="number"
                          min="0"
                          className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleNumberChange("minArea", e)
                          }
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const target = e.target;
                            target.value = Math.abs(
                              parseFloat(target.value)
                            ).toString();
                            if (parseFloat(target.value) < 0)
                              target.value = "0";
                          }}
                          onKeyDown={handleKeyDown}
                        />
                      </FormField>
                      <FormField
                        label="Diện tích tối đa"
                        subtitle="(m²)"
                        error={errors.maxArea?.message}
                      >
                        <Input
                          {...form.register("maxArea")}
                          placeholder="Ví dụ: 100m²"
                          type="number"
                          min="0"
                          className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const target = e.target;
                            target.value = Math.abs(
                              parseFloat(target.value)
                            ).toString();
                            if (parseFloat(target.value) < 0)
                              target.value = "0";
                          }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleNumberChange("maxArea", e)
                          }
                          onKeyDown={handleKeyDown}
                        />
                      </FormField>
                    </FormFieldGroup>

                    <div className="flex justify-end mt-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab("budget")}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                      >
                        Tiếp theo
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="budget" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <AnimatePresence>
                      {watch("propertyType") === "rental" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-6"
                        >
                          <div className="mb-4 p-4 rounded-lg bg-orange-50 border border-orange-100">
                            <div className="flex items-center">
                              <Info className="h-5 w-5 text-orange-600 mr-2" />
                              <p className="text-orange-800">
                                Hãy chỉ định thời hạn cho thuê mặt bằng của bạn.
                              </p>
                            </div>
                          </div>
                          <FormFieldGroup cols={2}>
                            <FormField
                              label="Thời hạn tối thiểu"
                              error={errors.minRentalPeriod?.message}
                            >
                              <Input
                                {...form.register("minRentalPeriod")}
                                placeholder="Ví dụ: 1 tháng hoặc 1 năm"
                                type="text"
                                className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                                onBlur={(e) =>
                                  handleRentalPeriodChange("minRentalPeriod", e)
                                }
                                onKeyDown={handleKeyDown}
                              />
                            </FormField>
                            <FormField
                              label="Thời hạn cho thuê tối đa"
                              error={errors.rentalPeriod?.message}
                            >
                              <Input
                                {...form.register("rentalPeriod")}
                                placeholder="Ví dụ: 6 tháng hoặc 2 năm"
                                type="text"
                                className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                                onBlur={(e) =>
                                  handleRentalPeriodChange("rentalPeriod", e)
                                }
                                onKeyDown={handleKeyDown}
                              />
                            </FormField>
                          </FormFieldGroup>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-2">
                      <h4 className="text-md font-medium text-orange-600 mb-2 flex items-center">
                        <span className="w-2 h-5 bg-orange-500 rounded mr-2"></span>
                        Ngân sách chi trả mong muốn
                      </h4>
                      <FormField
                        label="Giá trị ngân sách"
                        subtitle={budgetSubtitle}
                        error={errors.defaultBudget?.message}
                      >
                        <Input
                          {...form.register("defaultBudget")}
                          placeholder="Ví dụ: 20,000,000"
                          type="text"
                          defaultValue={
                            watch("defaultBudget")
                              ? formatNumberWithCommas(watch("defaultBudget"))
                              : ""
                          }
                          className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                          onChange={(e) =>
                            handleBudgetChange("defaultBudget", e)
                          }
                          onKeyDown={handleKeyDown}
                        />
                      </FormField>
                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-2 text-xs text-gray-500">
                            Hoặc chỉ định khoảng ngân sách
                          </span>
                        </div>
                      </div>
                      <FormFieldGroup cols={2}>
                        <FormField
                          label="Ngân sách tối thiểu"
                          subtitle={budgetSubtitle}
                          error={errors.minBudget?.message}
                        >
                          <Input
                            {...form.register("minBudget")}
                            placeholder="Ví dụ: 10,000,000"
                            type="text"
                            defaultValue={
                              watch("minBudget")
                                ? formatNumberWithCommas(watch("minBudget"))
                                : ""
                            }
                            className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                            onChange={(e) => handleBudgetChange("minBudget", e)}
                            onKeyDown={handleKeyDown}
                          />
                        </FormField>
                        <FormField
                          label="Ngân sách tối đa"
                          subtitle={budgetSubtitle}
                          error={errors.maxBudget?.message}
                        >
                          <Input
                            {...form.register("maxBudget")}
                            placeholder="Ví dụ: 30,000,000"
                            type="text"
                            defaultValue={
                              watch("maxBudget")
                                ? formatNumberWithCommas(watch("maxBudget"))
                                : ""
                            }
                            className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                            onChange={(e) => handleBudgetChange("maxBudget", e)}
                            onKeyDown={handleKeyDown}
                          />
                        </FormField>
                      </FormFieldGroup>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-md font-medium text-orange-600 mb-2 flex items-center">
                        <span className="w-2 h-5 bg-orange-500 rounded mr-2"></span>
                        Tiền đặt cọc mong muốn
                      </h4>
                      <FormFieldGroup cols={2}>
                        <FormField
                          label="Giá trị đặt cọc tối thiểu"
                          subtitle="(VNĐ)"
                          error={errors.depositDefault?.message}
                        >
                          <Input
                            {...form.register("depositDefault")}
                            placeholder="Ví dụ: 10,000,000"
                            type="text"
                            defaultValue={
                              watch("depositDefault")
                                ? formatNumberWithCommas(
                                    watch("depositDefault")
                                  )
                                : ""
                            }
                            className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                            onChange={(e) =>
                              handleDepositChange("depositDefault", e)
                            }
                            onKeyDown={handleKeyDown}
                          />
                        </FormField>
                        <FormField
                          label="Giá trị đặt cọc tối đa"
                          subtitle="(VNĐ)"
                          error={errors.depositMax?.message}
                        >
                          <Input
                            {...form.register("depositMax")}
                            placeholder="Ví dụ: 20,000,000"
                            type="text"
                            defaultValue={
                              watch("depositMax")
                                ? formatNumberWithCommas(watch("depositMax"))
                                : ""
                            }
                            className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                            onChange={(e) =>
                              handleDepositChange("depositMax", e)
                            }
                            onKeyDown={handleKeyDown}
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
                        className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const target = e.target;
                          target.value = Math.abs(
                            parseFloat(target.value)
                          ).toString();
                          if (parseFloat(target.value) < 0) target.value = "0";
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleNumberChange("depositMonths", e)
                        }
                        onKeyDown={handleKeyDown}
                      />
                    </FormField>

                    <div className="flex justify-between mt-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab("area")}
                        className="border border-orange-200 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-md transition-colors flex items-center"
                      >
                        Quay lại
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Progression indicator at bottom */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-8 rounded-full ${
                activeTab === "area" ? "bg-orange-500" : "bg-orange-200"
              }`}
            ></div>
            <div
              className={`h-2 w-8 rounded-full ${
                activeTab === "budget" ? "bg-orange-500" : "bg-orange-200"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default Step3Form;
