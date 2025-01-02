import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { useState } from "react";
const FindSpaceSurveyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taxCode: "",
    reasons: "",
    specificAddress: "",
    industry: "personal", // default to personal
    areaSize: "",
  });

  const industries = [
    { id: "personal", label: "Personal" },
    { id: "business", label: "Business" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold tracking-tight text-theme-orange-500 text-center">
            Khảo Sát Tìm Mặt Bằng
          </CardTitle>
          <CardDescription className="text-center">
            Vui lòng điền thông tin khảo sát để chúng tôi có thể hỗ trợ bạn tốt
            nhất
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Industry Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Loại Hình</Label>
            <RadioGroup
              value={formData.industry}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, industry: value }))
              }
              className="flex space-x-4"
            >
              {industries.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.id} id={type.id} />
                  <Label htmlFor={type.id}>{type.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Tax Code - Only show if Business is selected */}
          {formData.industry === "business" && (
            <div className="space-y-2">
              <Label htmlFor="taxCode">Mã số thuế</Label>
              <Input
                id="taxCode"
                value={formData.taxCode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, taxCode: e.target.value }))
                }
                placeholder="Nhập mã số thuế"
              />
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Nhập tiêu đề khảo sát"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Mô tả chi tiết nhu cầu của bạn"
              required
              className="min-h-[100px]"
            />
          </div>

          {/* Reasons */}
          <div className="space-y-2">
            <Label htmlFor="reasons">Lý do tìm mặt bằng</Label>
            <Textarea
              id="reasons"
              value={formData.reasons}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reasons: e.target.value }))
              }
              placeholder="Nêu lý do bạn cần tìm mặt bằng"
              required
              className="min-h-[100px]"
            />
          </div>

          {/* Specific Address */}
          <div className="space-y-2">
            <Label htmlFor="specificAddress">Địa chỉ cụ thể</Label>
            <Input
              id="specificAddress"
              value={formData.specificAddress}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specificAddress: e.target.value,
                }))
              }
              placeholder="Nhập địa chỉ cụ thể"
              required
            />
          </div>

          {/* Area Size */}
          <div className="space-y-2">
            <Label htmlFor="areaSize">Diện tích (m²)</Label>
            <Input
              id="areaSize"
              type="number"
              value={formData.areaSize}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, areaSize: e.target.value }))
              }
              placeholder="Nhập diện tích cần tìm"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-theme-orange-500 hover:bg-theme-orange-600 "
          >
            Gửi Khảo Sát
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default FindSpaceSurveyForm;
