import * as React from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import FormField from "./FormField";
import FormFieldGroup from "./FormFieldGroup";
import FormSection from "./FormSection";
import { Label } from "@/components/ui/label";

const Step1Form = ({ form, customerTypes }) => {
  const { watch, setValue, formState } = form;
  const { errors } = formState;
  const requestDate = watch("requestDate");

  return (
    <FormSection title="Thông tin cơ bản">
      <FormFieldGroup cols={2}>
        <FormField
          label="Thương hiệu"
          required
          error={errors.brand?.message}
        >
          <Input
            {...form.register("brand")}
            placeholder="Nhập tên thương hiệu"
            className="focus:border-orange-400"
          />
        </FormField>

        <FormField
          label="Tên đại diện"
          required
          error={errors.representativeName?.message}
        >
          <Input
            {...form.register("representativeName")}
            placeholder="Nhập tên đại diện"
            className="focus:border-orange-400"
          />
        </FormField>
      </FormFieldGroup>

      <FormFieldGroup cols={2}>
        <FormField
          label="Email đại diện"
          required
          error={errors.representativeEmail?.message}
        >
          <Input
            type="email"
            {...form.register("representativeEmail")}
            placeholder="example@company.com"
            className="focus:border-orange-400"
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
            className="focus:border-orange-400"
          />
        </FormField>
      </FormFieldGroup>

      <FormFieldGroup cols={2}>
        <FormField
          label="Ngày gửi request"
          required
          error={errors.requestDate?.message}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal focus:border-orange-400"
              >
                {requestDate ? (
                  format(requestDate, "dd/MM/yyyy")
                ) : (
                  <span className="text-gray-400">Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={requestDate}
                onSelect={(date) => date && setValue("requestDate", date)}
                initialFocus
                className="border-orange-400"
              />
            </PopoverContent>
          </Popover>
        </FormField>

        <FormField
          label="Ngành nghề"
          required
          error={errors.industry?.message}
        >
          <Select
            onValueChange={(value) => setValue("industry", value)}
            defaultValue={watch("industry")}
          >
            <SelectTrigger className="focus:border-orange-400">
              <SelectValue placeholder="Chọn ngành nghề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fnb">F&B (Thực phẩm & Đồ uống)</SelectItem>
              <SelectItem value="fashion">Thời trang</SelectItem>
              <SelectItem value="retail">Bán lẻ</SelectItem>
              <SelectItem value="service">Dịch vụ</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormFieldGroup>

      <FormField
        label="Mô hình khách hàng đang nhắm tới"
        required
        error={errors.targetCustomers?.message}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border border-gray-200 rounded-md p-3">
          {customerTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`customer-${type.id}`}
                onCheckedChange={(checked) => {
                  const currentValues = watch("targetCustomers") || [];
                  if (checked) {
                    setValue("targetCustomers", [...currentValues, type.id]);
                  } else {
                    setValue(
                      "targetCustomers",
                      currentValues.filter((value) => value !== type.id)
                    );
                  }
                }}
                checked={watch("targetCustomers")?.includes(type.id)}
                className="text-orange-500 border-orange-300 focus:ring-orange-500"
              />
              <Label htmlFor={`customer-${type.id}`} className="text-sm font-medium cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </FormField>
    </FormSection>
  );
};

export default Step1Form;