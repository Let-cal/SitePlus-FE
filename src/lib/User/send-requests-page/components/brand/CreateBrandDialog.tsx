"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ClientService from "@/services/client-role/client.service";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
const CreateBrandDialog = ({ onBrandCreated }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const brand = await ClientService.createBrand({ name: data.name });
      if (brand) {
        // Make sure to call onBrandCreated with the correct brand format
        onBrandCreated(brand);
        setOpen(false);
        reset();
      }
    } catch (error) {
      console.error("Error creating brand:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2 text-sm bg-theme-orange-500 hover:bg-theme-orange-600">
          Tạo thông tin cho mặt bằng của bạn
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Thương Hiệu Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin thương hiệu mới của bạn. Lưu ý, tên thương hiệu không
            được trùng lặp.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Tên thương hiệu</Label>
            <Input
              id="name"
              placeholder="Nhập tên thương hiệu"
              {...register("name", { required: "Tên thương hiệu là bắt buộc" })}
            />
            {errors.name?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.name.message)}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-theme-orange-500 hover:bg-theme-orange-600"
            >
              {loading ? "Đang tạo..." : "Tạo thương hiệu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrandDialog;
