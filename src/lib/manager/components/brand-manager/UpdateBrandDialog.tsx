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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import managerService from "../../../../services/manager/manager.service"
import type { Brand } from "./BrandTable"

interface UpdateBrandDialogProps {
  brand: Brand | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UpdateBrandDialog({ brand, isOpen, onClose, onSuccess }: UpdateBrandDialogProps) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    status: 0,
    updatedAt: new Date().toISOString(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFormModified, setIsFormModified] = useState(false)

  // Reset form data when brand changes
  useEffect(() => {
    if (brand) {
      setFormData({
        id: brand.id,
        name: brand.name,
        status: brand.status,
        updatedAt: new Date().toISOString(),
      })
      setIsFormModified(false)
    }
  }, [brand])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormModified) {
      toast.error("Không có thay đổi để cập nhật", {
        position: "top-right",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    try {
      const updateData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      }

      const result = await managerService.updateBrand(brand?.id || 0, updateData)

      if (result.success) {
        toast.success("Cập nhật thương hiệu thành công", {
          position: "top-right",
          duration: 3000,
        })

        // Gọi onSuccess trước khi đóng dialog
        onSuccess()

        // Đặt timeout để đảm bảo các styles được reset sau khi dialog đóng
        setTimeout(() => {
          // Reset body styles trước khi đóng dialog
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

  // Xử lý đóng dialog
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Đặt timeout để đảm bảo các styles được reset sau khi dialog đóng
      setTimeout(() => {
        // Reset body styles trước khi đóng dialog
        document.body.style.pointerEvents = "auto"
        document.body.style.overflow = "auto"
        onClose()
      }, 100)
    }
  }

  // Đảm bảo reset body styles khi component unmount
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto"
      document.body.style.overflow = "auto"
    }
  }, [])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
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
              <Input id="brand-id" value={formData.id} disabled className="bg-gray-100" />
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
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand-status" className="text-sm font-medium">
                Trạng thái <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.status.toString()} onValueChange={handleStatusChange}>
                <SelectTrigger id="brand-status" className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hoạt động</SelectItem>
                  <SelectItem value="0">Chờ xử lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Đặt timeout để đảm bảo các styles được reset sau khi dialog đóng
                setTimeout(() => {
                  // Reset body styles trước khi đóng dialog
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
