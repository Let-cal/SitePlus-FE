import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {clientService} from "@/services/client-role/client.service";
import { PlusCircle } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CreateBrandDialog = ({
  onBrandCreated,
  industries = [],
  allCustomerSegments = [],
  allIndustryCategories = [],
  suggestedSegments = [],
  suggestedIndustryCategories = [],
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCustomerSegments, setSelectedCustomerSegments] = useState([]);
  const [selectedIndustryCategory, setSelectedIndustryCategory] = useState("");
  const [localSuggestedSegments, setLocalSuggestedSegments] =
    useState(suggestedSegments);
  const [
    localSuggestedIndustryCategories,
    setLocalSuggestedIndustryCategories,
  ] = useState(suggestedIndustryCategories);
  const [brandNameError, setBrandNameError] = useState("");
  const [existingBrands, setExistingBrands] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const brandName = watch("name");

  // Fetch tất cả thương hiệu hiện có khi dialog mở
  useEffect(() => {
    if (open) {
      const fetchAllBrands = async () => {
        try {
          const brands = await clientService.getAllBrands();
          console.log("Fetched all brands:", brands);
          setExistingBrands(brands);
        } catch (error) {
          console.error("Error fetching all brands:", error);
          setExistingBrands([]);
        }
      };
      fetchAllBrands();
    }
  }, [open]);

  // Kiểm tra trùng tên brand khi người dùng nhập
  useEffect(() => {
    if (brandName && existingBrands.length > 0) {
      // Chuyển đổi tên brand người dùng nhập sang lowercase và loại bỏ khoảng trắng thừa
      const normalizedInput = brandName.trim().toLowerCase();

      // Kiểm tra các trường hợp trùng lặp
      const isDuplicate = existingBrands.some((brand) => {
        // Trường hợp 1: Trùng chính xác (không phân biệt hoa thường)
        if (brand.name.trim().toLowerCase() === normalizedInput) {
          return true;
        }

        // Trường hợp 2: Tên brand hiện tại là một phần của tên brand đang nhập
        // hoặc tên brand đang nhập là một phần của tên brand hiện tại
        const existingBrandName = brand.name.trim().toLowerCase();
        if (
          existingBrandName.includes(normalizedInput) ||
          normalizedInput.includes(existingBrandName)
        ) {
          return true;
        }

        return false;
      });

      if (isDuplicate) {
        setBrandNameError(
          "Đã tồn tại thương hiệu với tên tương tự trong hệ thống. Vui lòng chọn tên khác."
        );
      } else {
        setBrandNameError("");
      }
    } else {
      setBrandNameError("");
    }
  }, [brandName, existingBrands]);

  // Reset selections khi đóng dialog
  useEffect(() => {
    if (!open) {
      setSelectedIndustry("");
      setSelectedCustomerSegments([]);
      setSelectedIndustryCategory("");
      setLocalSuggestedSegments([]);
      setLocalSuggestedIndustryCategories([]);
      setBrandNameError("");
      reset();
    }
  }, [open, reset]);

  // Fetch gợi ý khi selectedIndustry thay đổi
  useEffect(() => {
    const fetchSuggestedData = async () => {
      if (selectedIndustry) {
        const industry = industries.find(
          (item) => item.name.toLowerCase() === selectedIndustry.toLowerCase()
        );
        if (industry) {
          try {
            let segments = [];

            if (industry.id === 7) {
              segments = allCustomerSegments.filter((segment) =>
                [1, 2, 4].includes(segment.id)
              );
            } else {
              segments = await clientService.getCustomerSegmentsByIndustry(
                industry.id
              );
            }
            setLocalSuggestedSegments(segments);
            const categories =
              await clientService.getIndustryCategoriesByIndustry(industry.id);
            setLocalSuggestedIndustryCategories(categories);
          } catch (error) {
            console.error("Error fetching suggested data:", error);
            setLocalSuggestedSegments([]);
            setLocalSuggestedIndustryCategories([]);
          }
        } else {
          setLocalSuggestedSegments([]);
          setLocalSuggestedIndustryCategories([]);
        }
      } else {
        setLocalSuggestedSegments([]);
        setLocalSuggestedIndustryCategories([]);
      }
    };
    fetchSuggestedData();
  }, [selectedIndustry, industries]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Kiểm tra lại một lần nữa trước khi submit
      if (brandNameError) {
        throw new Error(brandNameError);
      }

      if (!selectedCustomerSegments.length) {
        throw new Error("Vui lòng chọn ít nhất một customer segment");
      }
      if (!selectedIndustryCategory || Number(selectedIndustryCategory) <= 0) {
        throw new Error("Vui lòng chọn một industry category hợp lệ");
      }

      const brandData = {
        id: 0,
        name: data.name,
        status: 0,
        createdAt: new Date().toISOString(),
        brandCustomerSegment: selectedCustomerSegments.map((id) => ({
          customerSegmentId: Number(id),
        })),
        brandIndustryCategory: {
          industryCategoryId: Number(selectedIndustryCategory),
        },
      };

      console.log("Brand data prepared for submission:", brandData);

      onBrandCreated({
        name: data.name,
        industry: selectedIndustry,
        customerSegments: selectedCustomerSegments,
        industryCategory: selectedIndustryCategory,
        brandData: brandData,
      });
      console.log("Selected Customer Segments:", selectedCustomerSegments);
      console.log("Selected Industry Category:", selectedIndustryCategory);
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Error preparing brand data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomerSegment = (segmentId) => {
    setSelectedCustomerSegments((prev) =>
      prev.includes(segmentId)
        ? prev.filter((id) => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2 text-sm bg-theme-orange-500 hover:bg-theme-orange-600">
          Tạo thông tin cho thương hiệu của bạn
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Thương Hiệu Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin thương hiệu mới của bạn. Lưu ý, tên thương hiệu không
            được trùng lặp với các thương hiệu đã tồn tại trong hệ thống.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Tên thương hiệu</Label>
            <Input
              id="name"
              placeholder="Nhập tên thương hiệu"
              {...register("name", { required: "Tên thương hiệu là bắt buộc" })}
              className={`focus-visible:ring-orange-400 focus-visible:ring-offset-0 ${
                brandNameError ? "border-red-500" : ""
              }`}
            />
            {errors.name?.message && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.name.message)}
              </p>
            )}
            {brandNameError && (
              <p className="text-red-500 text-sm mt-1">{brandNameError}</p>
            )}
          </div>

          {/* Industry Selection */}
          <div>
            <Label htmlFor="industry">Ngành nghề</Label>
            <Select
              onValueChange={(value) => setSelectedIndustry(value)}
              value={selectedIndustry}
            >
              <SelectTrigger className="focus-visible:ring-orange-400 focus-visible:ring-offset-0">
                <SelectValue placeholder="Chọn ngành nghề" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.name}>
                    {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industry Category Selection */}
          <div>
            <Label htmlFor="industryCategory">Phân loại ngành nghề</Label>
            {selectedIndustry &&
              localSuggestedIndustryCategories.length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-100">
                  <h4 className="text-sm font-semibold mb-3 text-orange-800">
                    Gợi ý phân loại ngành nghề
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {localSuggestedIndustryCategories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="px-3 py-1 bg-white text-orange-700 border-orange-200 hover:bg-orange-100 cursor-pointer"
                        onClick={() =>
                          setSelectedIndustryCategory(String(category.id))
                        }
                      >
                        {category.name}
                        <PlusCircle className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
              {allIndustryCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-white transition-colors"
                >
                  <Checkbox
                    id={`dialog-category-${category.id}`}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIndustryCategory(String(category.id));
                      } else {
                        setSelectedIndustryCategory("");
                      }
                    }}
                    checked={selectedIndustryCategory === String(category.id)}
                    className="text-orange-500 border-orange-300 focus:ring-orange-500"
                  />
                  <Label
                    htmlFor={`dialog-category-${category.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments Selection */}
          <div>
            <Label htmlFor="customerSegments">
              Mô hình khách hàng đang nhắm tới
            </Label>
            {selectedIndustry && localSuggestedSegments.length > 0 && (
              <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-100">
                <h4 className="text-sm font-semibold mb-3 text-orange-800">
                  Gợi ý mô hình khách hàng theo ngành
                </h4>
                <div className="flex flex-wrap gap-2">
                  {localSuggestedSegments.map((segment) => (
                    <Badge
                      key={segment.id}
                      variant="outline"
                      className="px-3 py-1 bg-white text-orange-700 border-orange-200 hover:bg-orange-100 cursor-pointer"
                      onClick={() => toggleCustomerSegment(String(segment.id))}
                    >
                      {segment.name}
                      <PlusCircle className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
              {allCustomerSegments.map((segment) => (
                <div
                  key={segment.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-white transition-colors"
                >
                  <Checkbox
                    id={`dialog-customer-${segment.id}`}
                    onCheckedChange={() =>
                      toggleCustomerSegment(String(segment.id))
                    }
                    checked={selectedCustomerSegments.includes(
                      String(segment.id)
                    )}
                    className="text-orange-500 border-orange-300 focus:ring-orange-500"
                  />
                  <Label
                    htmlFor={`dialog-customer-${segment.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {segment.name}
                  </Label>
                </div>
              ))}
            </div>
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
              disabled={
                loading ||
                !!brandNameError ||
                !selectedIndustry ||
                !selectedIndustryCategory ||
                selectedCustomerSegments.length === 0
              }
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
