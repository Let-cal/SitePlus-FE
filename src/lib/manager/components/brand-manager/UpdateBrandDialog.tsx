"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import managerService from "../../../../services/manager/manager.service"
import type { Brand, CustomerSegment, IndustryCategory } from "./BrandTable"

interface UpdateBrandDialogProps {
  brand: Brand | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  allIndustryCategories: IndustryCategory[]
  allCustomerSegments: CustomerSegment[]
}

export default function UpdateBrandDialog({
  brand,
  isOpen,
  onClose,
  onSuccess,
  allIndustryCategories,
  allCustomerSegments,
}: UpdateBrandDialogProps) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    status: 0,
    updatedAt: new Date().toISOString(),
    customerSegmentId: [] as number[],
    industryCategoryId: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFormModified, setIsFormModified] = useState(false)

  // Reset form data when brand changes
  useEffect(() => {
    if (brand) {
      console.log("Brand data in UpdateBrandDialog:", brand);

      // Ánh xạ name sang id cho customerSegments
      const initialCustomerSegments = brand.customerSegments
        ? brand.customerSegments
            .map(segment => {
              const matchedSegment = allCustomerSegments.find(
                s => s.name === segment.name
              );
              return matchedSegment ? Number(matchedSegment.id) : undefined;
            })
            .filter(id => id !== undefined) as number[]
        : [];

      // Ánh xạ name sang id cho industryCategories
      const initialIndustryCategory =
        brand.industryCategories && brand.industryCategories.length > 0
          ? allIndustryCategories.find(
              cat => cat.name === brand.industryCategories[0].name
            )?.id || 0
          : 0;

      console.log("Initial customerSegmentId:", initialCustomerSegments);
      console.log("Initial industryCategoryId:", initialIndustryCategory);

      setFormData({
        id: Number(brand.id),
        name: brand.name || "",
        status: Number(brand.status) || 0,
        updatedAt: new Date().toISOString(),
        customerSegmentId: initialCustomerSegments,
        industryCategoryId: initialIndustryCategory,
      });
      setIsFormModified(false);
    }
  }, [brand, allCustomerSegments, allIndustryCategories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setIsFormModified(true)
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: Number.parseInt(value, 10),
    }))
    setIsFormModified(true)
  }

  const toggleCustomerSegment = (segmentId: number) => {
    setFormData((prev) => {
      const segmentIdNum = Number(segmentId);
      const updatedSegments = prev.customerSegmentId.includes(segmentIdNum)
        ? prev.customerSegmentId.filter(id => id !== segmentIdNum)
        : [...prev.customerSegmentId, segmentIdNum];
      
      console.log("Toggling segment:", segmentIdNum, "New segments:", updatedSegments);
      return { ...prev, customerSegmentId: updatedSegments };
    })
    setIsFormModified(true)
  }

  const handleIndustryCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      industryCategoryId: Number.parseInt(value, 10),
    }))
    setIsFormModified(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormModified) {
      toast.error("Không có thay đổi để cập nhật", {
        position: "top-right",
        duration: 3000,
      })
      return
    }

    if (!formData.industryCategoryId) {
      toast.error("Vui lòng chọn một phân loại ngành nghề", {
        position: "top-right",
        duration: 3000,
      })
      return
    }

    if (!formData.customerSegmentId.length) {
      toast.error("Vui lòng chọn ít nhất một mô hình khách hàng", {
        position: "top-right",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    try {
      const updateData = {
        id: formData.id,
        name: formData.name,
        status: formData.status,
        updatedAt: new Date().toISOString(),
        customerSegmentId: formData.customerSegmentId,
        industryCategoryId: formData.industryCategoryId,
      }

      const result = await managerService.updateBrand(brand?.id || 0, updateData)

      if (result.success) {
        toast.success("Cập nhật thương hiệu thành công", {
          position: "top-right",
          duration: 3000,
        })
        onSuccess()
        setTimeout(() => {
          document.body.style.pointerEvents = "auto"
          document.body.style.overflow = "auto"
          onClose()
        }, 100)
      } else {
        toast.error(result.message || "Cập nhật thất bại", {
          position: "top-right",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error updating brand:", error)
      toast.error("Đã xảy ra lỗi khi cập nhật thương hiệu", {
        position: "top-right",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "auto"
        document.body.style.overflow = "auto"
        onClose()
      }, 100)
    }
  }

  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto"
      document.body.style.overflow = "auto"
    }
  }, [])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Cập nhật thương hiệu</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin thương hiệu {brand?.name || ""}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="brand-id" className="text-sm font-medium">
                ID
              </Label>
              <Input id="brand-id" value={formData.id} disabled  />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand-name" className="text-sm font-medium">
                Tên thương hiệu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brand-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên thương hiệu"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand-status" className="text-sm font-medium">
                Trạng thái <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.status.toString()} onValueChange={handleStatusChange}>
                <SelectTrigger id="brand-status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hoạt động</SelectItem>
                  <SelectItem value="0">Chờ xử lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industryCategoryId" className="text-sm font-medium">
                Phân loại ngành nghề <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.industryCategoryId ? formData.industryCategoryId.toString() : ""}
                onValueChange={handleIndustryCategoryChange}
              >
                <SelectTrigger id="industryCategoryId">
                  <SelectValue placeholder="Chọn phân loại ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  {allIndustryCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerSegmentId" className="text-sm font-medium">
                Mô hình khách hàng đang nhắm tới <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 border rounded-lg p-4">
                {allCustomerSegments.map((segment) => {
                  const segmentIdNum = Number(segment.id);
                  const isChecked = formData.customerSegmentId.includes(segmentIdNum);
                  
                  return (
                    <div
                      key={segment.id}
                      className="flex items-center space-x-2 p-2 rounded"
                    >
                      <Checkbox
                        id={`update-customer-${segment.id}`}
                        onCheckedChange={() => toggleCustomerSegment(segmentIdNum)}
                        checked={isChecked}
                      />
                      <Label
                        htmlFor={`update-customer-${segment.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {segment.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTimeout(() => {
                  document.body.style.pointerEvents = "auto"
                  document.body.style.overflow = "auto"
                  onClose()
                }, 100)
              }}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || !isFormModified}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}