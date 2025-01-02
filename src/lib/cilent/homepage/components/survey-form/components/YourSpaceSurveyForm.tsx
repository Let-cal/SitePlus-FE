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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { useState } from "react";
const YourSpaceSurveyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taxCode: "",
    reason: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    specificAddress: "",
    industry: "personal",
    areaSize: "",
  });

  const industries = [
    { id: "personal", label: "Personal" },
    { id: "business", label: "Business" },
  ];

  // Sample location data - replace with your actual data
  const cities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
  const districts = ["Quận 1", "Quận 2", "Quận 3"];
  const wards = ["Phường 1", "Phường 2", "Phường 3"];
  const streets = ["Đường 1", "Đường 2", "Đường 3"];

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
            Khảo Sát Mặt Bằng Của Bạn
          </CardTitle>
          <CardDescription className="text-center">
            Vui lòng cung cấp thông tin về mặt bằng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Industry Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold ">Loại Hình</Label>
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
              placeholder="Mô tả chi tiết về mặt bằng của bạn"
              required
              className="min-h-[100px]"
            />
          </div>

          {/* Address Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Địa chỉ</Label>

            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <div className="space-y-2">
                <Label>Thành phố</Label>
                <Select
                  value={formData.city}
                  onValueChange={(city) =>
                    setFormData((prev) => ({ ...prev, city }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label>Quận/Huyện</Label>
                <Select
                  value={formData.district}
                  onValueChange={(district) =>
                    setFormData((prev) => ({ ...prev, district }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận/huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ward */}
              <div className="space-y-2">
                <Label>Phường/Xã</Label>
                <Select
                  value={formData.ward}
                  onValueChange={(ward) =>
                    setFormData((prev) => ({ ...prev, ward }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem key={ward} value={ward}>
                        {ward}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Street */}
              <div className="space-y-2">
                <Label>Đường</Label>
                <Select
                  value={formData.street}
                  onValueChange={(street) =>
                    setFormData((prev) => ({ ...prev, street }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đường" />
                  </SelectTrigger>
                  <SelectContent>
                    {streets.map((street) => (
                      <SelectItem key={street} value={street}>
                        {street}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
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

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Lý do cho thuê</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Nêu lý do bạn muốn cho thuê mặt bằng"
              required
              className="min-h-[100px]"
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
              placeholder="Nhập diện tích mặt bằng"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-theme-orange-500 hover:bg-theme-orange-600"
          >
            Gửi Khảo Sát
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default YourSpaceSurveyForm;
