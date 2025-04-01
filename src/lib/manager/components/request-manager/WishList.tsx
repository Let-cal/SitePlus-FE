import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Heart, FileDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import managerService from "../../../../services/manager/manager.service";

// Interface cho Project (lấy từ managerService.ts)
interface Project {
  id: number;
  nameSite?: string;
  imageUrl: string;
  score?: number;
  siteCategoryName?: string;
  area?: string;
  address?: string;
  size?: number;
  floor?: number;
  totalFloor?: number;
  description?: string;
  statusName?: string;
  buildingName?: string;
}

interface WishListProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Project[];
  setFavorites: React.Dispatch<React.SetStateAction<Project[]>>;
  handleAddToFavorites: (project: Project) => Promise<void>;
  title: string;
  brandRequestId: number; // Thêm brandRequestId vào props
}

// CSS tùy chỉnh cho drawer
const customStyles = `
  .wishlist-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: hsl(var(--background));
    border-top: 1px solid hsl(var(--border));
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    display: flex;
    flex-direction: column;
  }
  .wishlist-header {
    position: sticky;
    top: 0;
    background-color: hsl(var(--background));
    z-index: 10;
    padding: 1.5rem;
    border-bottom: 1px solid hsl(var(--border));
  }
  .wishlist-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    padding-top: 0;
  }
`;

const WishList: React.FC<WishListProps> = ({ isOpen, onClose, favorites, setFavorites, handleAddToFavorites, title, brandRequestId }) => {
  // Thêm trạng thái loading cho nút "Xuất PDF" chung
  const [isExportingAll, setIsExportingAll] = useState(false);

  // Thêm custom styles cho drawer
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Hàm xử lý nút "Xem chi tiết" (placeholder)
  const handleViewDetails = (projectId: number) => {
    console.log(`Xem chi tiết mặt bằng ID: ${projectId}`);
    // Bạn có thể thêm logic để điều hướng hoặc mở modal chi tiết ở đây
  };

  // Hàm xử lý "Xuất PDF" cho tất cả site
  const handleExportAll = async () => {
    if (favorites.length === 0) {
      toast.error("Danh sách quan tâm trống", { position: "top-left", duration: 3000 });
      return;
    }

    setIsExportingAll(true);
    try {
      // Cập nhật status của từng site thành 5
      for (const project of favorites) {
        const updateSuccess = await managerService.updateSiteStatus(project.id, 5);
        if (!updateSuccess) {
          toast.error(`Không thể cập nhật status cho site ID: ${project.id}`, { position: "top-left", duration: 3000 });
          return; // Dừng nếu có lỗi
        }
      }

      // Gọi API xuất PDF với brandRequestId
      const pdfResponse = await managerService.exportPDF(brandRequestId);
      if (pdfResponse) {
        // Tạo link tải file PDF và tự động tải xuống
        const url = window.URL.createObjectURL(new Blob([pdfResponse], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `wishlist_${brandRequestId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Giải phóng URL object

        // Xóa tất cả site khỏi danh sách favorites sau khi xuất PDF thành công
        setFavorites([]);
        toast.success("Đã xuất PDF cho tất cả site", { position: "top-left", duration: 3000 });
      } else {
        toast.error("Không thể xuất PDF", { position: "top-left", duration: 3000 });
      }
    } catch (error) {
      console.error("Error in handleExportAll:", error);
      toast.error("Lỗi khi xuất PDF", { position: "top-left", duration: 3000 });
    } finally {
      setIsExportingAll(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="wishlist-drawer">
        {/* Phần tiêu đề (giữ cố định) */}
        <div className="wishlist-header">
          <div className="relative">
            <div className="flex justify-center items-center">
              <h2 className="text-xl font-semibold mt-1">{title}</h2>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="absolute top-1 right-0 p-5"
              aria-label="Đóng"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Phần nội dung (có thể cuộn) */}
        <div className="wishlist-content">
          <div className="mt-6">
            {/* Tiêu đề "Danh sách quan tâm" và nút "Xuất PDF" */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Danh sách quan tâm</h3>
              <Button
                variant="outline"
                onClick={handleExportAll}
                className="text-sm h-10 px-4"
                disabled={isExportingAll}
              >
                <FileDown className="h-4 w-4 mr-1" />
                {isExportingAll ? "Đang xuất..." : "Xuất PDF"}
              </Button>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 max-w-7xl mx-auto">
                {favorites.map((project) => {
                  const isFavorite = favorites.some((fav) => fav.id === project.id);
                  return (
                    <div
                      key={project.id}
                      className="relative p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-full"
                    >
                      {/* Badge Score (nếu có) */}
                      {project.score && (
                        <div className="absolute top-2 right-2 bg-red-100 text-red-600 font-semibold text-xs px-2 py-1 rounded-full">
                          {project.score}
                        </div>
                      )}

                      {/* ID và Tên địa điểm */}
                      <div className="mb-2">
                        <p className="text-sm text-gray-500">ID: {project.id}</p>
                        <p className="font-semibold text-gray-800 line-clamp-2 h-[48px]">{project.nameSite}</p>
                      </div>

                      {/* Hình ảnh (nếu có) hoặc placeholder */}
                      <div className="w-full h-[270px] mb-8 mx-auto">
                        {project.imageUrl !== "No Image" ? (
                          <img
                            src={project.imageUrl}
                            alt={project.nameSite}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-sm">Không có hình ảnh</span>
                          </div>
                        )}
                      </div>

                      {/* Các nút hành động */}
                      <div className="space-y-2">
                        {/* Chỉ giữ lại hàng: Xem chi tiết và Quan tâm/Bỏ quan tâm */}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleViewDetails(project.id)}
                            className="flex-1 text-sm"
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleAddToFavorites(project)}
                            className="flex-1 text-sm"
                          >
                            <Heart
                              className="h-4 w-4 mr-1"
                              fill={isFavorite ? "red" : "none"}
                              color={isFavorite ? "red" : "currentColor"}
                            />
                            {isFavorite ? "Bỏ quan tâm" : "Quan tâm"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">Chưa có site nào trong danh sách quan tâm</p>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-left" />
    </>
  );
};

export default WishList;