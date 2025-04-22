import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import managerService, { SearchAIProject, FavoriteSiteResponse } from "../../../../services/manager/manager.service";
import WishList from "./WishList";
import SiteDetailDrawer from "./SiteDetailDrawer";
import * as Dialog from "@radix-ui/react-dialog";

// Interface cho BrandRequestResponse
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
  customerSegments: { name: string }[];
  industryCategories: { name: string }[];
}

interface BrandRequestResponse {
  brandRequest: BrandRequest;
  brandRequestStoreProfile: BrandRequestStoreProfile;
  storeProfile: StoreProfile;
  storeProfileCriteria: StoreProfileCriteria[];
}

// Interface cho kết quả tìm kiếm bằng AI
interface Project {
  siteId: number;
  siteDealId: number;
  address: string;
  size: number;
  leaseTerm: string;
  proposedPrice: number;
  deposit: number;
  additionalTerms: string;
  imageUrl: string;
  totalScore: number;
  nameSite?: string;
}

interface RequestDetailProps {
  isOpen: boolean;
  onClose: () => void;
  brandRequestId: number;
}

// CSS tùy chỉnh
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
    padding: 1rem;
    border-bottom: 1px solid hsl(var(--border));
  }
  .request-detail-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    padding-top: 0;
  }
  .request-form {
    padding: 0.5rem 0;
  }
  .request-form-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid hsl(var(--border));
  }
  .request-form-tab {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: border-bottom 0.3s ease;
  }
  .request-form-tab.active {
    border-bottom: 2px solid hsl(var(--primary));
    font-weight: 600;
  }
  .request-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1rem;
    align-items: stretch;
  }
  .request-form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }
  .request-form-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .request-form-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--foreground));
    line-height: 1.5;
    background-color: hsl(var(--muted));
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
  }
  .request-form-value-full {
    grid-column: span 2;
  }
  .request-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background-color: hsl(var(--muted));
    border-radius: 8px;
    border: 1px solid hsl(var(--border));
    min-height: 350px;
  }
  .request-form-group-label {
    font-size: 0.955rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
    border-bottom: 2px solid hsl(var(--border));
    padding-bottom: 0.5rem;
  }
  .request-form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
  .search-result-card {
    position: relative;
    background-color: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;
  }
  .search-result-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .search-result-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }
  .search-result-title {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .search-result-id {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
  }
  .search-result-address {
    font-size: 1rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    line-height: 1.5;
    min-height: 3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .search-result-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 0.75rem;
  }
  .search-result-placeholder {
    width: 100%;
    height: 150px;
    background-color: hsl(var(--muted));
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
  }
  .search-result-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .search-result-info-item {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
    gap: 0.25rem;
  }
  .search-result-info-item-label {
    font-weight: 500;
    color: hsl(var(--muted-foreground));
  }
  .search-result-info-item-value {
    font-weight: 500;
    color: hsl(var(--foreground));
  }
  .search-result-score {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
  }
  .search-result-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
`;

const RequestDetail: React.FC<RequestDetailProps> = ({ isOpen, onClose, brandRequestId }) => {
  const [request, setRequest] = useState<BrandRequestResponse | null>(null);
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [favorites, setFavorites] = useState<SearchAIProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishListOpen, setIsWishListOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"space-budget" | "business-characteristics">("space-budget");

  const fetchFavoritesData = async () => {
    try {
      const response = await managerService.fetchFavorites(brandRequestId);
      if (response.success && response.data.matchedSites && response.data.matchedSites.length > 0) {
        const matchedSites: SearchAIProject[] = response.data.matchedSites.map((site: FavoriteSiteResponse) => ({
          siteId: site.id,
          siteDealId: 0,
          address: site.address,
          size: site.size,
          leaseTerm: site.leaseTerm,
          proposedPrice: site.proposedPrice,
          deposit: site.deposit,
          additionalTerms: site.additionalTerms,
          imageUrl: site.imageUrl || "https://via.placeholder.com/150",
          totalScore: 0,
          nameSite: site.address,
        }));
        setFavorites(matchedSites);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
    }
  };

  useEffect(() => {
    if (brandRequestId && isOpen) {
      const fetchData = async () => {
        try {
          setError(null);
          setFavorites([]);

          const requestData = await managerService.fetchBrandRequestById(brandRequestId);
          if (requestData) {
            setRequest(requestData);
            if (requestData.brandRequest.status === 1) {
              await fetchFavoritesData();
            }
          } else {
            setError("Không tìm thấy yêu cầu thương hiệu.");
            toast.error("Không tìm thấy yêu cầu thương hiệu", { position: "top-left", duration: 3000 });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
          toast.error("Lỗi khi tải dữ liệu", { position: "top-left", duration: 3000 });
        }
      };
      fetchData();
    }
  }, [brandRequestId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setRequest(null);
      setSearchResults([]);
      setIsWishListOpen(false);
      setSelectedSiteId(null);
      setError(null);
      setActiveTab("space-budget");
    }
  }, [isOpen]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const getCriteriaByAttributeId = (attributeId: number) => {
    return request?.storeProfileCriteria.find((criteria) => criteria.attributeId === attributeId);
  };

  const parseDescription = (description: string): { result: { [key: string]: string }; specialRequests: { [key: string]: string } } => {
    const parts = description.split(" - ").map(part => part.trim());
    const result: { [key: string]: string } = {};
    const specialRequests: { [key: string]: string } = {};

    parts.forEach(part => {
      const [key, ...valueParts] = part.split(": ");
      const value = valueParts.join(": ").trim();
      if (key && value) {
        if (["Ngành nghề muốn thay đổi", "Loại ngành nghề đang muốn hướng tới", "Nhu cầu khách hàng mong muốn", "Loại cửa hàng mong muốn"].includes(key)) {
          specialRequests[key] = value;
        } else {
          result[key] = value;
        }
      }
    });

    return { result, specialRequests };
  };

  const getDesiredLocation = () => {
    if (!request) return "-";
    const { result } = parseDescription(request.brandRequest.description);
    const district = result["Quận/Huyện"] || "";
    const street = result["Đường"] || "";
    const ward = getCriteriaByAttributeId(33)?.defaultValue || "";

    const locationParts = [district, street, ward].filter(part => part).join(", ");
    return locationParts || "-";
  };

  const formatLeaseTerm = (value: string) => {
    if (value === "-") return "-";
    if (value.includes("Mặt bằng cho thuê")) {
      return value.replace("Mặt bằng cho thuê - Thời hạn ", "");
    } else if (value.includes("Mặt bằng chuyển nhượng")) {
      return value.replace("Mặt bằng chuyển nhượng", "").trim();
    }
    return value;
  };

  const getLeaseTermPrefix = (criteria: StoreProfileCriteria | undefined) => {
    if (!criteria) return "Thời hạn cho thuê";
    const value = criteria.maxValue || criteria.minValue || criteria.defaultValue;
    if (value?.includes("Mặt bằng cho thuê")) {
      return "Thời hạn cho thuê (Mặt bằng cho thuê)";
    } else if (value?.includes("Mặt bằng chuyển nhượng")) {
      return "Thời hạn cho thuê (Mặt bằng chuyển nhượng)";
    }
    return "Thời hạn cho thuê";
  };

  const handleSearchByAI = async () => {
    if (!request) return;

    setIsLoading(true);
    try {
      const results = await managerService.searchByAI(request.brandRequest.id, 10);
      const formattedResults = results.map((item: Project) => ({
        ...item,
        nameSite: item.address,
      }));
      setSearchResults(formattedResults);
      await fetchFavoritesData();
      if (results.length > 0) {
        toast.success("Tìm kiếm bằng AI thành công", { position: "top-left", duration: 3000 });
      }
    } catch (error) {
      console.error("Error in handleSearchByAI:", error);
      toast.error("Lỗi khi thực hiện tìm kiếm bằng AI", { position: "top-left", duration: 3000 });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (projectId: number) => {
    setSelectedSiteId(projectId);
  };

  const handleCloseSiteDetail = () => {
    setSelectedSiteId(null);
  };

  const handleAddToFavorites = async (project: Project) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.siteId === project.siteId);

    if (isAlreadyFavorite) {
      try {
        const success = await managerService.updateSiteStatus(project.siteId, 1);
        if (success) {
          setFavorites((prevFavorites) => {
            const updatedFavorites = prevFavorites.filter((fav) => fav.siteId !== project.siteId);
            toast.success(`Đã xóa mặt bằng ID: ${project.siteId} khỏi danh sách quan tâm`, {
              position: "top-left",
              duration: 3000,
            });
            return updatedFavorites;
          });
        } else {
          toast.error("Không thể xóa mặt bằng khỏi danh sách quan tâm", {
            position: "top-left",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error removing from favorites:", error);
        toast.error("Lỗi khi xóa mặt bằng khỏi danh sách quan tâm", {
          position: "top-left",
          duration: 3000,
        });
      }
    } else {
      try {
        const success = await managerService.updateMatchedSite(
          brandRequestId,
          project.siteDealId,
          project.totalScore || 0
        );
        if (success) {
          setFavorites((prevFavorites) => {
            const updatedFavorites = [...prevFavorites, project];
            const uniqueFavorites = Array.from(
              new Map(updatedFavorites.map((item) => [item.siteId, item])).values()
            );
            toast.success(`Đã thêm mặt bằng ID: ${project.siteId} vào danh sách quan tâm`, {
              position: "top-left",
              duration: 3000,
            });
            return uniqueFavorites;
          });
        } else {
          toast.error("Không thể thêm mặt bằng vào danh sách quan tâm", {
            position: "top-left",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error adding to favorites:", error);
        toast.error("Lỗi khi thêm mặt bằng vào danh sách quan tâm", {
          position: "top-left",
          duration: 3000,
        });
      }
    }
  };

  const handleViewFavorites = () => {
    setIsWishListOpen(true);
  };

  if (!isOpen) return null;

  const areaCriteria = getCriteriaByAttributeId(9);
  const budgetCriteria = getCriteriaByAttributeId(31);
  const nearbyCriteria = getCriteriaByAttributeId(32);
  const leaseTermCriteria = getCriteriaByAttributeId(37);
  const depositCriteria = getCriteriaByAttributeId(38);
  const depositConditionCriteria = getCriteriaByAttributeId(39);

  const showSearchByAIButton = request && request.brandRequest.status === 1;

  const drawerTitle = request
    ? `ID ${request.brandRequest.id} - ${request.brandRequest.brandName}`
    : "Chi tiết yêu cầu thương hiệu";

  const { specialRequests } = request ? parseDescription(request.brandRequest.description) : { specialRequests: {} };

  const formatValue = (value: string | undefined) => {
    return value || "-";
  };

  const formatCurrency = (value: string | undefined) => {
    if (!value) return "-";
    const cleanValue = value.replace(/,/g, "");
    const numValue = parseFloat(cleanValue);
    if (isNaN(numValue)) return value;
    return `${numValue.toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <>
      <div className="request-detail-drawer">
        <div className="request-detail-header">
          <div className="relative">
            <div className="flex justify-center items-center">
              <h2 className="text-xl font-semibold mt-1">{drawerTitle}</h2>
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

        <div className="request-detail-content">
          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              {request && (
                <div className="flex justify-end mt-2">
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

              {request && (
                <div className="request-form">
                  <div className="request-form-tabs">
                    <div
                      className={`request-form-tab ${activeTab === "space-budget" ? "active" : ""}`}
                      onClick={() => setActiveTab("space-budget")}
                    >
                      Yêu cầu mặt bằng
                    </div>
                    <div
                      className={`request-form-tab ${activeTab === "business-characteristics" ? "active" : ""}`}
                      onClick={() => setActiveTab("business-characteristics")}
                    >
                      Thông tin kinh doanh
                    </div>
                  </div>

                  {activeTab === "space-budget" && (
                    <div className="request-form-grid">
                      <div className="request-form-field">
                        <div className="request-form-group">
                          <div className="request-form-group-label">Thông tin cửa hàng</div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Loại cửa hàng</Label>
                            <div className="request-form-value">{formatValue(request.storeProfile.storeProfileCategoryName)}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Gần khu vực</Label>
                            <div className="request-form-value">{formatValue(nearbyCriteria?.defaultValue)}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Vị trí mong muốn</Label>
                            <div className="request-form-value">{getDesiredLocation()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="request-form-field">
                        <div className="request-form-group">
                          <div className="request-form-group-label">Diện tích mặt bằng (m²)</div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối đa</Label>
                            <div className="request-form-value">{formatValue(areaCriteria?.maxValue)} m²</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối thiểu</Label>
                            <div className="request-form-value">{formatValue(areaCriteria?.minValue)} m²</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Mong muốn</Label>
                            <div className="request-form-value">{formatValue(areaCriteria?.defaultValue)} m²</div>
                          </div>
                        </div>
                      </div>

                      <div className="request-form-field">
                        <div className="request-form-group">
                          <div className="request-form-group-label">Ngân sách thuê (VNĐ)</div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối đa</Label>
                            <div className="request-form-value">{formatCurrency(budgetCriteria?.maxValue)}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối thiểu</Label>
                            <div className="request-form-value">{formatCurrency(budgetCriteria?.minValue)}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Mong muốn</Label>
                            <div className="request-form-value">{formatCurrency(budgetCriteria?.defaultValue)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="request-form-field">
                        <div className="request-form-group">
                          <div className="request-form-group-label">{getLeaseTermPrefix(leaseTermCriteria)}</div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối đa</Label>
                            <div className="request-form-value">{formatLeaseTerm(formatValue(leaseTermCriteria?.maxValue))}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối thiểu</Label>
                            <div className="request-form-value">{formatLeaseTerm(formatValue(leaseTermCriteria?.minValue))}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Mong muốn</Label>
                            <div className="request-form-value">{formatLeaseTerm(formatValue(leaseTermCriteria?.defaultValue))}</div>
                          </div>
                        </div>
                      </div>

                      <div className="request-form-field">
                        <div className="request-form-group">
                          <div className="request-form-group-label">Tiền đặt cọc (VNĐ)</div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối đa</Label>
                            <div className="request-form-value">{formatCurrency(depositCriteria?.maxValue)}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối thiểu</Label>
                            <div className="request-form-value">{formatCurrency(depositCriteria?.minValue)}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Mong muốn</Label>
                            <div className="request-form-value">{formatCurrency(depositCriteria?.defaultValue)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="request-form-field">
                        <div className="request-form-group">
                          <div className="request-form-group-label">Điều kiện đặt cọc</div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối đa</Label>
                            <div className="request-form-value">{formatValue(depositConditionCriteria?.maxValue)}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Tối thiểu</Label>
                            <div className="request-form-value">{formatValue(depositConditionCriteria?.minValue)}</div>
                          </div>
                          <div className="request-form-field">
                            <Label className="request-form-label">Mong muốn</Label>
                            <div className="request-form-value">{formatValue(depositConditionCriteria?.defaultValue)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "business-characteristics" && (
                    <div className="request-form-grid">
                      <div className="request-form-field">
                        <div className="request-form-group">
                          <div className="request-form-group-label">Ngành nghề</div>
                          {request.brandRequest.industryCategories.length > 0 ? (
                            request.brandRequest.industryCategories.map((category, index) => (
                              <div key={index} className="request-form-field">
                                <div className="request-form-value">{category.name}</div>
                              </div>
                            ))
                          ) : (
                            <div className="request-form-field">
                              <div className="request-form-value">-</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="request-form-field">
                        <div className="request-form-group">
                          <div className="request-form-group-label">Khách hàng mục tiêu</div>
                          {request.brandRequest.customerSegments.length > 0 ? (
                            request.brandRequest.customerSegments.map((segment, index) => (
                              <div key={index} className="request-form-field">
                                <div className="request-form-value">{segment.name}</div>
                              </div>
                            ))
                          ) : (
                            <div className="request-form-field">
                              <div className="request-form-value">-</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {Object.keys(specialRequests).length > 0 && (
                        <div className="request-form-field request-form-value-full">
                          <div className="request-form-group">
                            <div className="request-form-group-label">Yêu cầu đặc biệt</div>
                            {(Object.entries(specialRequests) as [string, string][]).map(([key, value]) => (
                              <div key={key} className="request-form-field">
                                <Label className="request-form-label">{key}</Label>
                                <div className="request-form-value">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {showSearchByAIButton && (
                    <div className="request-form-buttons">
                      {request?.brandRequest.status === 1 && (
                        <Button
                          variant="outline"
                          onClick={handleViewFavorites}
                          className="text-sm h-10 px-4"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Xem danh sách quan tâm ({favorites.length})
                        </Button>
                      )}
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

              {searchResults.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Kết quả tìm kiếm</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
                    {searchResults.map((project) => {
                      const isFavorite = favorites.some((fav) => fav.siteId === project.siteId);
                      return (
                        <div key={project.siteDealId} className="search-result-card">
                          <div className="search-result-header">
                            <div className="search-result-title">
                              <div className="search-result-id">ID: {project.siteId}</div>
                              <div className="search-result-address">{project.address}</div>
                            </div>
                            {project.totalScore > 0 && (
                              <div className="search-result-score">{project.totalScore}</div>
                            )}
                          </div>

                          <div>
                            {project.imageUrl && project.imageUrl !== "Chưa có ảnh" ? (
                              <img
                                src={project.imageUrl}
                                alt={project.nameSite || "Hình ảnh mặt bằng"}
                                className="search-result-image"
                              />
                            ) : (
                              <div className="search-result-placeholder">
                                <span className="text-gray-500 text-sm">Không có hình ảnh</span>
                              </div>
                            )}
                          </div>
                          <div className="search-result-info">
                            <div className="search-result-info-item">
                              <span className="search-result-info-item-label">Deal:</span>
                              <span className="search-result-info-item-value">{project.siteDealId}</span>
                            </div>
                            <div className="search-result-info-item">
                              <span className="search-result-info-item-label">Diện tích:</span>
                              <span className="search-result-info-item-value">{project.size} m²</span>
                            </div>
                            <div className="search-result-info-item">
                              <span className="search-result-info-item-label">Giá đề xuất:</span>
                              <span className="search-result-info-item-value">
                                {project.proposedPrice.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            </div>
                            <div className="search-result-info-item">
                              <span className="search-result-info-item-label">Tiền cọc:</span>
                              <span className="search-result-info-item-value">
                                {project.deposit.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            </div>
                            <div className="search-result-info-item">
                              <span className="search-result-info-item-label">Thời hạn:</span>
                              <span className="search-result-info-item-value">{project.leaseTerm}</span>
                            </div>
                            <div className="search-result-info-item">
                              <span className="search-result-info-item-label">Điều khoản bổ sung:</span>
                              <span className="search-result-info-item-value">{project.additionalTerms}</span>
                            </div>
                          </div>

                          <div className="search-result-buttons">
                            <Button
                              variant="outline"
                              onClick={() => handleViewDetails(project.siteId)}
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

              {!request && !error && <p className="text-center">Đang tải...</p>}
            </>
          )}
        </div>
      </div>

      <Dialog.Root open={selectedSiteId !== null} onOpenChange={(open) => !open && setSelectedSiteId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[1001]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-[1002] w-[90vw] max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            {selectedSiteId !== null && (
              <SiteDetailDrawer
                siteId={selectedSiteId}
                onClose={handleCloseSiteDetail}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <WishList
        isOpen={isWishListOpen}
        onClose={() => setIsWishListOpen(false)}
        title={drawerTitle}
        brandRequestId={brandRequestId}
        favorites={favorites}
        setFavorites={setFavorites}
      />

      <Toaster />
    </>
  );
};

export default RequestDetail;