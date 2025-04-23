"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Building, CalendarIcon, TagIcon, UsersIcon } from "lucide-react";
import * as React from "react";
import type { Brand } from "./BrandTable";

interface BrandDetailProps {
  brand: Brand | null;
  onClose: () => void;
}

export default function BrandDetail({ brand, onClose }: BrandDetailProps) {
  // Đảm bảo reset body styles khi component unmount
  React.useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  // Xử lý đóng dialog
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Đặt timeout để đảm bảo các styles được reset sau khi dialog đóng
      setTimeout(() => {
        // Reset body styles trước khi đóng dialog
        document.body.style.pointerEvents = "auto";
        document.body.style.overflow = "auto";
        onClose();
      }, 100);
    }
  };

  if (!brand) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <Dialog open={!!brand} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Chi tiết thương hiệu
            <Badge
              className={
                brand.status === 1
                  ? "bg-green-500 hover:bg-green-600 ml-2"
                  : "bg-red-500 hover:bg-red-600 ml-2"
              }
            >
              {brand.brandStatusName}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về thương hiệu {brand.name}
          </DialogDescription>
          <CardDescription className="text-lg font-medium mt-1">
            {brand.name}
          </CardDescription>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin cơ bản */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TagIcon className="mr-2 h-5 w-5 text-primary" />
                  Thông tin cơ bản
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      ID Thương hiệu
                    </div>
                    <div className="font-medium">{brand.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Tên thương hiệu
                    </div>
                    <div className="font-medium">{brand.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Trạng thái
                    </div>
                    <Badge
                      className={
                        brand.status === 1
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }
                    >
                      {brand.brandStatusName}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin thời gian */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                  Thông tin thời gian
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Ngày tạo
                    </div>
                    <div className="font-medium">
                      {formatDate(brand.createdAt)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Cập nhật lần cuối
                    </div>
                    <div className="font-medium">
                      {formatDate(brand.updatedAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loại ngành */}
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="mr-2 h-5 w-5 text-primary" />
                  Loại ngành
                </h3>

                <div className="flex flex-wrap gap-2">
                  {brand.industryCategories.length > 0 ? (
                    brand.industryCategories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1 border-primary/30"
                      >
                        {category.name}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-muted-foreground">
                      Chưa có thông tin loại ngành
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Đối tượng khách hàng */}
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <UsersIcon className="mr-2 h-5 w-5 text-primary" />
                  Đối tượng khách hàng
                </h3>

                <div className="flex flex-wrap gap-2">
                  {brand.customerSegments.length > 0 ? (
                    brand.customerSegments.map((segment, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1 border-primary/30"
                      >
                        {segment.name}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-muted-foreground">
                      Chưa có thông tin đối tượng khách hàng
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <DialogFooter className="px-6 py-4">
          <Button
            onClick={() => {
              // Đặt timeout để đảm bảo các styles được reset sau khi dialog đóng
              setTimeout(() => {
                document.body.style.pointerEvents = "auto";
                document.body.style.overflow = "auto";
                onClose();
              }, 100);
            }}
            className="w-full sm:w-auto"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
