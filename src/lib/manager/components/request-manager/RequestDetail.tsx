import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, ChevronDown, ChevronUp, Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import managerService from "../../../../services/manager/manager.service";
import WishList from "./WishList";

// Interface cho BrandRequestResponse (lấy từ ManagerService)
interface StoreProfileCriteria {
  id: number;
  storeProfileId: number;
  attributeId: number;
  attributeName: string;
  maxValue: string;
  minValue: string;
  defaultValue: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreProfile {
  id: number;
  brandId: number;
  storeProfileCategoryId: number;
  storeProfileCategoryName: string;
  createdAt: string;
  updatedAt: string;
}

interface BrandRequestStoreProfile {
  id: number;
  storeProfileId: number;
  brandRequestId: number;
}

interface BrandRequest {
  id: number;
  brandId: number;
  brandName: string;
  nameCustomer: string;
  emailCustomer: string;
  phoneCustomer: string;
  addressCustomer: string;
  status: number;
  statusName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface BrandRequestResponse {
  brandRequest: BrandRequest;
  brandRequestStoreProfile: BrandRequestStoreProfile;
  storeProfile: StoreProfile;
  storeProfileCriteria: StoreProfileCriteria[];
}

// Interface cho kết quả tìm kiếm bằng AI
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

interface RequestDetailProps {
  isOpen: boolean;
  onClose: () => void;
  brandRequestId: number;
}

// CSS tùy chỉnh cho drawer
const customStyles = `
  .request-detail-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: hsl(var(--background));
    border-top: 1px solid hsl(var(--border));
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }
  .request-detail-header {
    position: sticky;
    top: 0;
    background-color: hsl(var(--background));
    z-index: 10;
    padding: 1.5rem;
    border-bottom: 1px solid hsl(var(--border));
  }
  .request-detail-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    padding-top: 0;
  }
`;

const RequestDetail: React.FC<RequestDetailProps> = ({ isOpen, onClose, brandRequestId }) => {
  const [request, setRequest] = useState<BrandRequestResponse | null>(null);
  const [isExpanded, setIsExpanded] = useState(true); // Trạng thái thu gọn/mở rộng
  const [searchResults, setSearchResults] = useState<Project[]>([]); // Kết quả tìm kiếm bằng AI
  const [favorites, setFavorites] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi gọi API
  const [isWishListOpen, setIsWishListOpen] = useState(false); // Trạng thái mở/đóng WishList drawer

  // Lấy dữ liệu BrandRequest và Favorites từ API
  useEffect(() => {
    if (brandRequestId && isOpen) {
      const fetchData = async () => {
        try {
          // Lấy chi tiết BrandRequest
          const requestData = await managerService.fetchBrandRequestById(brandRequestId);
          if (requestData) {
            setRequest(requestData);
          }

          // Lấy danh sách favorites
          const favoritesData = await managerService.fetchFavorites(brandRequestId);
          // Loại bỏ trùng lặp trong favorites (dựa trên id)
          const uniqueFavorites = Array.from(
            new Map(favoritesData.map((item) => [item.id, item])).values()
          );
          setFavorites(uniqueFavorites);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Lỗi khi tải dữ liệu", { position: "top-left", duration: 3000 });
        }
      };
      fetchData();
    }
  }, [brandRequestId, isOpen]);

  // Reset state khi đóng drawer (không reset favorites)
  useEffect(() => {
    if (!isOpen) {
      setRequest(null);
      setSearchResults([]);
      setIsExpanded(true);
      setIsWishListOpen(false); // Đóng WishList drawer khi đóng RequestDetail
    }
  }, [isOpen]);

  // Thêm custom styles cho drawer
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Hàm tìm tiêu chí theo attributeId
  const getCriteriaByAttributeId = (attributeId: number) => {
    return request?.storeProfileCriteria.find((criteria) => criteria.attributeId === attributeId);
  };

  // Hàm xử lý nút "Tìm kiếm bằng AI"
  const handleSearchByAI = async () => {
    if (!request) return;

    setIsLoading(true);
    try {
      if (request.brandRequest.status === 1) {
        // Nếu status là 1 (Chấp nhận), cập nhật thành 3 (Đang ghép) trước
        const updateSuccess = await managerService.updateBrandRequestStatus(request.brandRequest.id, 3);
        if (updateSuccess) {
          // Cập nhật status trong state
          setRequest((prev) =>
            prev
              ? {
                ...prev,
                brandRequest: { ...prev.brandRequest, status: 3, statusName: "Đang ghép" },
              }
              : null
          );
          // Gọi API tìm kiếm bằng AI
          const results = await managerService.searchByAI(request.brandRequest.id);
          setSearchResults(results);
          if (results.length > 0) {
            toast.success("Tìm kiếm bằng AI thành công", { position: "top-left", duration: 3000 });
            setIsExpanded(false); // Thu gọn giao diện sau khi tìm kiếm
          }
        }
      } else if (request.brandRequest.status === 3) {
        // Nếu status đã là 3 (Đang ghép), chỉ gọi API tìm kiếm
        const results = await managerService.searchByAI(request.brandRequest.id);
        setSearchResults(results);
        if (results.length > 0) {
          toast.success("Tìm kiếm bằng AI thành công", { position: "top-left", duration: 3000 });
          setIsExpanded(false); // Thu gọn giao diện sau khi tìm kiếm
        }
      }
    } catch (error) {
      console.error("Error in handleSearchByAI:", error);
      toast.error("Lỗi khi thực hiện tìm kiếm bằng AI", { position: "top-left", duration: 3000 });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle thu gọn/mở rộng
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // Hàm xử lý nút "Xem chi tiết" (placeholder)
  const handleViewDetails = (projectId: number) => {
    console.log(`Xem chi tiết mặt bằng ID: ${projectId}`);
    // Bạn có thể thêm logic để điều hướng hoặc mở modal chi tiết ở đây
  };

  // Hàm xử lý nút "Quan tâm" (toggle)
  const handleAddToFavorites = async (project: Project) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.id === project.id);

    if (isAlreadyFavorite) {
      // Nếu đã có trong danh sách quan tâm, cập nhật status của site thành 1
      try {
        const success = await managerService.updateSiteStatus(project.id, 1);
        if (success) {
          // Nếu API thành công, xóa khỏi state favorites
          setFavorites((prevFavorites) => {
            const updatedFavorites = prevFavorites.filter((fav) => fav.id !== project.id);
            toast.success(`Đã xóa mặt bằng ID: ${project.id} khỏi danh sách quan tâm`, { position: "top-left", duration: 3000 });
            return updatedFavorites;
          });
        } else {
          // Nếu API thất bại, không xóa khỏi state
          toast.error("Không thể xóa mặt bằng khỏi danh sách quan tâm", { position: "top-left", duration: 3000 });
        }
      } catch (error) {
        console.error("Error removing from favorites:", error);
        toast.error("Lỗi khi xóa mặt bằng khỏi danh sách quan tâm", { position: "top-left", duration: 3000 });
      }
    } else {
      // Nếu chưa có, gọi API để thêm vào kho quan tâm
      try {
        const success = await managerService.updateMatchedSite(brandRequestId, project.id, project.score || 0);
        if (success) {
          // Nếu API thành công, thêm vào state favorites và loại bỏ trùng lặp
          setFavorites((prevFavorites) => {
            const updatedFavorites = [...prevFavorites, project];
            // Loại bỏ trùng lặp dựa trên id
            const uniqueFavorites = Array.from(
              new Map(updatedFavorites.map((item) => [item.id, item])).values()
            );
            toast.success(`Đã thêm mặt bằng ID: ${project.id} vào danh sách quan tâm`, { position: "top-left", duration: 3000 });
            return uniqueFavorites;
          });
        } else {
          // Nếu API thất bại, không thêm vào state
          toast.error("Không thể thêm mặt bằng vào danh sách quan tâm", { position: "top-left", duration: 3000 });
        }
      } catch (error) {
        console.error("Error adding to favorites:", error);
        toast.error("Lỗi khi thêm mặt bằng vào danh sách quan tâm", { position: "top-left", duration: 3000 });
      }
    }
  };

  // Hàm mở WishList drawer
  const handleViewFavorites = () => {
    setIsWishListOpen(true);
  };

  if (!isOpen) return null;

  // Lấy dữ liệu cho các trường
  const areaCriteria = getCriteriaByAttributeId(9); // Diện tích mặt bằng
  const budgetCriteria = getCriteriaByAttributeId(31); // Ngân sách thuê
  const nearbyCriteria = getCriteriaByAttributeId(32); // Gần khu vực
  const locationCriteria = getCriteriaByAttributeId(33); // Vị trí mong muốn

  // Kiểm tra điều kiện status để hiển thị nút "Tìm kiếm bằng AI"
  const showSearchByAIButton = request && (request.brandRequest.status === 1 || request.brandRequest.status === 3);

  // Tạo tiêu đề cho WishList (giống RequestDetail)
  const drawerTitle = request ? `ID ${request.brandRequest.id} - ${request.brandRequest.brandName}` : "Chi tiết yêu cầu thương hiệu";

  // Hàm tách nội dung "Yêu cầu đặc biệt" từ description
  const getSpecialRequest = (description: string) => {
    const specialRequestIndex = description.indexOf("Yêu cầu đặc biệt:");
    if (specialRequestIndex === -1) {
      return "Chưa có thông tin";
    }
    const specialRequestContent = description.substring(specialRequestIndex + "Yêu cầu đặc biệt:".length).trim();
    return specialRequestContent || "Chưa có thông tin";
  };

  return (
    <>
      <div className="request-detail-drawer">
        {/* Phần tiêu đề (giữ cố định) */}
        <div className="request-detail-header">
          <div className="relative">
            <div className="flex justify-center items-center">
              <h2 className="text-xl font-semibold mt-1">{drawerTitle}</h2>
              <Button
                variant="ghost"
                onClick={toggleExpand}
                className="ml-2 p-2"
                aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
              >
                {isExpanded ? <ChevronDown className="h-6 w-6" /> : <ChevronUp className="h-6 w-6" />}
              </Button>
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
        <div className="request-detail-content">
          {/* Email và Số điện thoại (giữ cố định) */}
          {request && (
            <div className="flex justify-end mb-6 mt-8">
              <div className="text-sm">
                <a
                  href={`mailto:${request.brandRequest.emailCustomer}`}
                  className="text-blue-500 italic hover:underline"
                >
                  {request.brandRequest.emailCustomer}
                </a>
                <span className="mx-2">|</span>
                <span>{request.brandRequest.phoneCustomer}</span>
              </div>
            </div>
          )}
          {/* Thông tin request (thu gọn hoặc mở rộng) */}
          {request && (
            <div className="space-y-3">
              {isExpanded ? (
                // Khi mở rộng: Hiển thị đầy đủ
                <>
                  {/* Loại cửa hàng */}
                  <div className="space-y-1">
                    <Label htmlFor="storeProfileCategoryName" className="text-sm">Loại cửa hàng</Label>
                    <div
                      id="storeProfileCategoryName"
                      className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                    >
                      {request.storeProfile.storeProfileCategoryName}
                    </div>
                  </div>

                  {/* Diện tích mặt bằng */}
                  <div className="space-y-1">
                    <Label className="text-sm">Diện tích mặt bằng</Label>
                    <div className="flex space-x-4">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="areaMax" className="text-sm">Tối đa</Label>
                        <div
                          id="areaMax"
                          className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                        >
                          {areaCriteria?.maxValue || "Chưa có thông tin"}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="areaMin" className="text-sm">Tối thiểu</Label>
                        <div
                          id="areaMin"
                          className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                        >
                          {areaCriteria?.minValue || "Chưa có thông tin"}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="areaDefault" className="text-sm">Mong muốn</Label>
                        <div
                          id="areaDefault"
                          className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                        >
                          {areaCriteria?.defaultValue || "Chưa có thông tin"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ngân sách thuê */}
                  <div className="space-y-1">
                    <Label className="text-sm">Ngân sách thuê</Label>
                    <div className="flex space-x-4">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="budgetMax" className="text-sm">Tối đa</Label>
                        <div
                          id="budgetMax"
                          className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                        >
                          {budgetCriteria?.maxValue || "Chưa có thông tin"}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="budgetMin" className="text-sm">Tối thiểu</Label>
                        <div
                          id="budgetMin"
                          className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                        >
                          {budgetCriteria?.minValue || "Chưa có thông tin"}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="budgetDefault" className="text-sm">Mong muốn</Label>
                        <div
                          id="budgetDefault"
                          className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                        >
                          {budgetCriteria?.defaultValue || "Chưa có thông tin"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gần khu vực */}
                  <div className="space-y-1">
                    <Label htmlFor="nearbyArea" className="text-sm">Gần khu vực</Label>
                    <div
                      id="nearbyArea"
                      className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                    >
                      {nearbyCriteria?.defaultValue || "Chưa có thông tin"}
                    </div>
                  </div>

                  {/* Vị trí mong muốn */}
                  <div className="space-y-1">
                    <Label htmlFor="desiredLocation" className="text-sm">Vị trí mong muốn</Label>
                    <div
                      id="desiredLocation"
                      className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                    >
                      {locationCriteria?.defaultValue || "Chưa có thông tin"}
                    </div>
                  </div>

                  {/* Yêu cầu đặc biệt */}
                  <div className="space-y-1">
                    <Label htmlFor="specialRequest" className="text-sm">Yêu cầu đặc biệt</Label>
                    <div
                      id="specialRequest"
                      className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                    >
                      {getSpecialRequest(request.brandRequest.description)}
                    </div>
                  </div>
                </>
              ) : (
                // Khi thu gọn: Hiển thị dạng 3 cột
                <div className="text-sm grid grid-cols-3 gap-4">
                  {/* Cột 1: Diện tích mặt bằng */}
                  <div>
                    <div className="font-semibold">Diện tích mặt bằng:</div>
                    <div>Tối đa: {areaCriteria?.maxValue || "Chưa có thông tin"}</div>
                    <div>Tối thiểu: {areaCriteria?.minValue || "Chưa có thông tin"}</div>
                    <div>Mong muốn: {areaCriteria?.defaultValue || "Chưa có thông tin"}</div>
                  </div>

                  {/* Cột 2: Ngân sách thuê */}
                  <div>
                    <div className="font-semibold">Ngân sách thuê:</div>
                    <div>Tối đa: {budgetCriteria?.maxValue || "Chưa có thông tin"}</div>
                    <div>Tối thiểu: {budgetCriteria?.minValue || "Chưa có thông tin"}</div>
                    <div>Mong muốn: {budgetCriteria?.defaultValue || "Chưa có thông tin"}</div>
                  </div>

                  {/* Cột 3: Loại cửa hàng, Gần khu vực, Vị trí mong muốn, Yêu cầu đặc biệt */}
                  <div>
                    <div className="font-semibold">Loại cửa hàng: {request.storeProfile.storeProfileCategoryName}</div>
                    <div>Gần khu vực: {nearbyCriteria?.defaultValue || "Chưa có thông tin"}</div>
                    <div>Vị trí mong muốn: {locationCriteria?.defaultValue || "Chưa có thông tin"}</div>
                    <div>Yêu cầu đặc biệt: {getSpecialRequest(request.brandRequest.description)}</div>
                  </div>
                </div>
              )}

              {showSearchByAIButton && (
                <div className="flex justify-end space-x-4 pt-3">
                  {/* Nút "Xem danh sách quan tâm" (hiển thị nếu status === 3) */}
                  {request?.brandRequest.status === 3 && (
                    <Button
                      variant="outline"
                      onClick={handleViewFavorites}
                      className="text-sm h-10 px-4"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Xem danh sách quan tâm ({favorites.length})
                    </Button>
                  )}
                  {/* Nút Tìm kiếm bằng AI */}
                  <Button
                    onClick={handleSearchByAI}
                    className="text-sm h-10 px-4"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang tìm kiếm..." : "Tìm kiếm bằng AI"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Kết quả tìm kiếm (nếu có) */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Kết quả tìm kiếm</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 max-w-7xl mx-auto">
                {searchResults.map((project) => {
                  const isFavorite = favorites.some((fav) => fav.id === project.id);
                  return (
                    <div
                      key={project.id}
                      className="relative p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-full"
                    >
                      {/* Badge Score ở góc phải */}
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
                  );
                })}
              </div>
            </div>
          )}

          {!request && <p className="text-center">Đang tải...</p>}
        </div>
      </div>

      {/* WishList Drawer */}
      <WishList
        isOpen={isWishListOpen}
        onClose={() => setIsWishListOpen(false)}
        favorites={favorites}
        setFavorites={setFavorites}
        handleAddToFavorites={handleAddToFavorites}
        title={drawerTitle}
        brandRequestId={brandRequestId} // Sửa thành brandRequestId (chữ "I" in hoa)
      />
      <Toaster />
    </>
  );
};

export default RequestDetail;