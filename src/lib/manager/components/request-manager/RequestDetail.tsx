import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import managerService, { SearchAIProject, FavoriteSiteResponse } from "../../../../services/manager/manager.service";
import WishList from "./WishList";
import CloseSite from "./CloseSite";
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
  brandRequestStoreProfile?: BrandRequestStoreProfile;
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

const RequestDetail: React.FC<RequestDetailProps> = ({ isOpen, onClose, brandRequestId }) => {
  const [request, setRequest] = useState<BrandRequestResponse | null>(null);
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [favorites, setFavorites] = useState<SearchAIProject[]>([]);
  const [closedSitesCount, setClosedSitesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishListOpen, setIsWishListOpen] = useState(false);
  const [isCloseSiteOpen, setIsCloseSiteOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"space-budget" | "business-characteristics">("space-budget");
  const [refreshKey, setRefreshKey] = useState(0); // Thêm refreshKey để trigger refetch

  const fetchFavoritesData = async () => {
    try {
      const response = await managerService.fetchFavorites(brandRequestId);
      if (response.success) {
        // Lấy danh sách quan tâm (matchedSites)
        if (response.data.matchedSites && response.data.matchedSites.length > 0) {
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

        // Lấy số lượng site đã chốt (closedSites)
        if (response.data.closedSites && response.data.closedSites.length > 0) {
          setClosedSitesCount(response.data.closedSites.length);
        } else {
          setClosedSitesCount(0);
        }
      } else {
        setFavorites([]);
        setClosedSitesCount(0);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
      setClosedSitesCount(0);
    }
  };

  useEffect(() => {
    if (brandRequestId && isOpen) {
      const fetchData = async () => {
        try {
          setError(null);
          setFavorites([]);
          setClosedSitesCount(0);

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
  }, [brandRequestId, isOpen, refreshKey]); // Thêm refreshKey để refetch khi cần

  useEffect(() => {
    if (!isOpen) {
      setRequest(null);
      setSearchResults([]);
      setFavorites([]);
      setClosedSitesCount(0);
      setIsWishListOpen(false);
      setIsCloseSiteOpen(false);
      setSelectedSiteId(null);
      setError(null);
      setActiveTab("space-budget");
    }
  }, [isOpen]);

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

  const handleViewClosedSites = () => {
    setIsCloseSiteOpen(true);
  };

  // Callback để trigger refetch dữ liệu
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
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
      <div className="fixed bottom-0 left-0 w-full h-screen bg-background border-t border-border shadow-[0_-4px_8px_rgba(0,0,0,0.1)] z-[1000] flex flex-col">
        <div className="sticky top-0 bg-background z-10 p-4 border-b border-border">
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

        <div className="flex-1 overflow-y-auto p-4 pt-0">
          {error ? (
            <p className="text-center text-destructive">{error}</p>
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
                <div className="py-2">
                  <div className="flex gap-4 mb-4 border-b border-border">
                    <div
                      className={`p-2 text-base font-medium cursor-pointer border-b-2 transition-colors duration-300 ${activeTab === "space-budget" ? "border-primary font-semibold" : "border-transparent"}`}
                      onClick={() => setActiveTab("space-budget")}
                    >
                      Yêu cầu mặt bằng
                    </div>
                    <div
                      className={`p-2 text-base font-medium cursor-pointer border-b-2 transition-colors duration-300 ${activeTab === "business-characteristics" ? "border-primary font-semibold" : "border-transparent"}`}
                      onClick={() => setActiveTab("business-characteristics")}
                    >
                      Thông tin kinh doanh
                    </div>
                  </div>

                  {activeTab === "space-budget" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 items-stretch">
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border min-h-[350px]">
                          <div className="text-[0.955rem] font-semibold text-foreground mb-2 border-b-2 border-border pb-2">Thông tin cửa hàng</div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Loại cửa hàng</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatValue(request.storeProfile.storeProfileCategoryName)}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gần khu vực</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatValue(nearbyCriteria?.defaultValue)}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vị trí mong muốn</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{getDesiredLocation()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border min-h-[350px]">
                          <div className="text-[0.955rem] font-semibold text-foreground mb-2 border-b-2 border-border pb-2">Diện tích mặt bằng (m²)</div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối đa</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatValue(areaCriteria?.maxValue)} m²</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối thiểu</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatValue(areaCriteria?.minValue)} m²</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mong muốn</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatValue(areaCriteria?.defaultValue)} m²</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border min-h-[350px]">
                          <div className="text-[0.955rem] font-semibold text-foreground mb-2 border-b-2 border-border pb-2">Ngân sách thuê (VNĐ)</div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối đa</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatCurrency(budgetCriteria?.maxValue)}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối thiểu</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatCurrency(budgetCriteria?.minValue)}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mong muốn</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatCurrency(budgetCriteria?.defaultValue)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border min-h-[350px]">
                          <div className="text-[0.955rem] font-semibold text-foreground mb-2 border-b-2 border-border pb-2">{getLeaseTermPrefix(leaseTermCriteria)}</div>
                          {leaseTermCriteria && (leaseTermCriteria.maxValue?.includes("Mặt bằng cho thuê") || leaseTermCriteria.minValue?.includes("Mặt bằng cho thuê") || leaseTermCriteria.defaultValue?.includes("Mặt bằng cho thuê")) && (
                            <>
                              <div className="flex flex-col gap-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối đa</Label>
                                <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatLeaseTerm(formatValue(leaseTermCriteria?.maxValue))}</div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối thiểu</Label>
                                <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatLeaseTerm(formatValue(leaseTermCriteria?.minValue))}</div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mong muốn</Label>
                                <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatLeaseTerm(formatValue(leaseTermCriteria?.defaultValue))}</div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border min-h-[350px]">
                          <div className="text-[0.955rem] font-semibold text-foreground mb-2 border-b-2 border-border pb-2">Tiền đặt cọc (VNĐ)</div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối đa</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatCurrency(depositCriteria?.maxValue)}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối thiểu</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatCurrency(depositCriteria?.minValue)}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mong muốn</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatCurrency(depositCriteria?.defaultValue)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border min-h-[350px]">
                          <div className="text-[0.955rem] font-semibold text-foreground mb-2 border-b-2 border-border pb-2">Điều kiện đặt cọc</div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối đa</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatValue(depositConditionCriteria?.maxValue)}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tối thiểu</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatValue(depositConditionCriteria?.minValue)}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mong muốn</Label>
                            <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{formatValue(depositConditionCriteria?.defaultValue)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "business-characteristics" && (
                    <div className={`grid ${Object.keys(specialRequests).length > 0 ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"} gap-6 mb-4 items-stretch`}>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border min-h-[350px]">
                          <div className="text-[0.955rem] font-semibold text-foreground mb-2 border-b-2 border-border pb-2">Ngành nghề</div>
                          {request.brandRequest.industryCategories.length > 0 ? (
                            request.brandRequest.industryCategories.map((category, index) => (
                              <div key={index} className="flex flex-col gap-2">
                                <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{category.name}</div>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col gap-2">
                              <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">-</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border min-h-[350px]">
                          <div className="text-[0.955rem] font-semibold text-foreground mb-2 border-b-2 border-border pb-2">Khách hàng mục tiêu</div>
                          {request.brandRequest.customerSegments.length > 0 ? (
                            request.brandRequest.customerSegments.map((segment, index) => (
                              <div key={index} className="flex flex-col gap-2">
                                <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{segment.name}</div>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col gap-2">
                              <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">-</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {Object.keys(specialRequests).length > 0 && (
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border min-h-[350px]">
                            <div className="text-[0.955rem] font-semibold text-foreground mb-2 border-b-2 border-border pb-2">Yêu cầu đặc biệt</div>
                            {(Object.entries(specialRequests) as [string, string][]).map(([key, value]) => (
                              <div key={key} className="flex flex-col gap-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{key}</Label>
                                <div className="text-sm font-medium text-foreground leading-relaxed bg-muted p-2 rounded-md">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {showSearchByAIButton && (
                    <div className="flex justify-end gap-4 mt-4">
                      {request?.brandRequest.status === 1 && (
                        <>
                          <Button
                            variant="outline"
                            onClick={handleViewFavorites}
                            className="text-sm h-10 px-4"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Xem danh sách quan tâm ({favorites.length})
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleViewClosedSites}
                            className="text-sm h-10 px-4"
                          >
                            Xem danh sách đã chốt ({closedSitesCount})
                          </Button>
                        </>
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
                        <div key={project.siteDealId} className="relative bg-card border border-border rounded-lg p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col gap-1">
                              <div className="text-sm font-medium text-muted-foreground">ID: {project.siteId}</div>
                              <div className="text-base font-semibold text-foreground leading-relaxed min-h-[3rem] line-clamp-2">{project.address}</div>
                            </div>
                            {project.totalScore > 0 && (
                              <div className="absolute top-2 right-2 bg-green-100/85 text-green-500 text-base font-semibold px-2 py-1 rounded-full">{project.totalScore}</div>
                            )}
                          </div>

                          <div>
                            {project.imageUrl && project.imageUrl !== "Chưa có ảnh" ? (
                              <img
                                src={project.imageUrl}
                                alt={project.nameSite || "Hình ảnh mặt bằng"}
                                className="w-full h-[150px] object-cover rounded-md mb-3"
                              />
                            ) : (
                              <div className="w-full h-[150px] bg-muted rounded-md flex items-center justify-center mb-3">
                                <span className="text-muted-foreground text-sm">Không có hình ảnh</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center text-sm text-foreground gap-1">
                              <span className="font-medium text-muted-foreground">Diện tích:</span>
                              <span className="font-medium text-foreground">{project.size} m²</span>
                            </div>
                            <div className="flex items-center text-sm text-foreground gap-1">
                              <span className="font-medium text-muted-foreground">Giá đề xuất:</span>
                              <span className="font-medium text-foreground">
                                {project.proposedPrice.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-foreground gap-1">
                              <span className="font-medium text-muted-foreground">Tiền cọc:</span>
                              <span className="font-medium text-foreground">
                                {project.deposit.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-foreground gap-1">
                              <span className="font-medium text-muted-foreground">Thời hạn:</span>
                              <span className="font-medium text-foreground">{project.leaseTerm}</span>
                            </div>
                            <div className="flex items-center text-sm text-foreground gap-1">
                              <span className="font-medium text-muted-foreground">Điều khoản bổ sung:</span>
                              <span className="font-medium text-foreground">{project.additionalTerms}</span>
                            </div>
                            <div className="h-6"></div>
                          </div>

                          <div className="flex gap-2 mt-4">
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
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card rounded-lg shadow-lg z-[1002] w-[90vw] max-w-5xl h-[90vh] flex flex-col overflow-hidden">
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
        onRefresh={handleRefresh} // Truyền callback để trigger refetch
        title={drawerTitle}
        brandRequestId={brandRequestId}
        favorites={favorites}
        setFavorites={setFavorites}
      />

      <CloseSite
        isOpen={isCloseSiteOpen}
        onClose={() => {
          setIsCloseSiteOpen(false);
          handleRefresh(); // Refetch dữ liệu khi đóng CloseSite
        }}
        onUnclose={handleRefresh} // Truyền callback để refetch khi "Bỏ chốt"
        title={drawerTitle}
        brandRequestId={brandRequestId}
        setFavorites={setFavorites}
      />

      <Toaster />
    </>
  );
};

export default RequestDetail;