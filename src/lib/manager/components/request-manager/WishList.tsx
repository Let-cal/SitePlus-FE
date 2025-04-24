import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import managerService, { FavoriteSiteResponse } from "../../../../services/manager/manager.service";
import CloseSite from "./CloseSite";
import SiteDetailDrawer from "./SiteDetailDrawer";
import * as Dialog from "@radix-ui/react-dialog";

// Interface cho SearchAIProject (copy từ managerService.ts)
interface SearchAIProject {
  siteId: number;
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

interface WishListProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void; // Thêm prop onRefresh
  title: string;
  brandRequestId: number;
  favorites: SearchAIProject[];
  setFavorites: React.Dispatch<React.SetStateAction<SearchAIProject[]>>;
}

const WishList: React.FC<WishListProps> = ({ isOpen, onClose, onRefresh, title, brandRequestId, favorites, setFavorites }) => {
  const [closedSites, setClosedSites] = useState<SearchAIProject[]>([]);
  const [closedSitesCount, setClosedSitesCount] = useState<number>(0);
  const [showClosedSites, setShowClosedSites] = useState(false);
  const [isCloseSiteOpen, setIsCloseSiteOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchFavorites = async () => {
    try {
      const response = await managerService.fetchFavorites(brandRequestId);
      if (!response.success) {
        setFavorites([]);
        setClosedSitesCount(0);
        return;
      }

      // Lấy danh sách quan tâm (matchedSites)
      if (!response.data.matchedSites || response.data.matchedSites.length === 0) {
        setFavorites([]);
      } else {
        const matchedSites = response.data.matchedSites.map((site: FavoriteSiteResponse) => ({
          siteId: site.id,
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
        const uniqueFavorites = Array.from(
          new Map(matchedSites.map((item: SearchAIProject) => [item.siteId, item])).values()
        );
        setFavorites(uniqueFavorites);
      }

      // Lấy số lượng site đã chốt (closedSites)
      if (!response.data.closedSites || response.data.closedSites.length === 0) {
        setClosedSitesCount(0);
      } else {
        setClosedSitesCount(response.data.closedSites.length);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Lỗi khi tải danh sách quan tâm", { position: "top-left", duration: 3000 });
      setFavorites([]);
      setClosedSitesCount(0);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFavorites();
    }
  }, [isOpen, brandRequestId, refreshKey]);

  const handleViewDetails = (projectId: number) => {
    setSelectedSiteId(projectId);
  };

  const handleCloseSiteDetail = () => {
    setSelectedSiteId(null);
  };

  const handleRemoveFromFavorites = async (project: SearchAIProject) => {
    try {
      const success = await managerService.updateSiteStatus(project.siteId, 1);
      if (success) {
        setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.siteId !== project.siteId));
        toast.success(`Đã xóa mặt bằng ID: ${project.siteId} khỏi danh sách quan tâm`, {
          position: "top-left",
          duration: 3000,
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
  };

  const handleCloseSite = async (project: SearchAIProject) => {
    try {
      const success = await managerService.updateSiteStatus(project.siteId, 5);
      if (success) {
        setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.siteId !== project.siteId));
        setClosedSitesCount((prev) => prev + 1);
        toast.success(`Đã chốt mặt bằng ID: ${project.siteId}`, {
          position: "top-left",
          duration: 3000,
        });
        onRefresh(); // Gọi callback để trigger refetch trong RequestDetail
      } else {
        toast.error("Không thể chốt mặt bằng", {
          position: "top-left",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error closing site:", error);
      toast.error("Lỗi khi chốt mặt bằng", {
        position: "top-left",
        duration: 3000,
      });
    }
  };

  const handleOpenCloseSite = () => {
    setIsCloseSiteOpen(true);
    setShowClosedSites(true);
  };

  const handleBackToFavorites = () => {
    setShowClosedSites(false);
    setClosedSites([]);
    setIsCloseSiteOpen(false);
  };

  const handleUnclose = () => {
    setRefreshKey((prev) => prev + 1);
    onRefresh(); // Gọi callback để trigger refetch trong RequestDetail khi "Bỏ chốt"
  };

  if (!isOpen) return null;

  const displayList = showClosedSites ? closedSites : favorites;

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full h-screen bg-background border-t border-border shadow-[0_-4px_8px_rgba(0,0,0,0.1)] z-[1001] flex flex-col">
        <div className="sticky top-0 bg-background z-10 p-6 border-b border-border">
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

        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {showClosedSites ? "Danh sách đã chốt" : "Danh sách quan tâm"}
              </h3>
              {!showClosedSites && (
                <Button
                  variant="outline"
                  onClick={handleOpenCloseSite}
                  className="text-sm h-10 px-4"
                >
                  Xem danh sách đã chốt ({closedSitesCount})
                </Button>
              )}
              {showClosedSites && (
                <Button
                  variant="outline"
                  onClick={handleBackToFavorites}
                  className="text-sm h-10 px-4"
                >
                  Quay lại danh sách quan tâm
                </Button>
              )}
            </div>

            {displayList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
                {displayList.map((project) => (
                  <div
                    key={project.siteId}
                    className="relative bg-card border border-border rounded-lg p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium text-muted-foreground">
                          ID: {project.siteId}
                        </div>
                        <div className="text-base font-semibold text-foreground line-clamp-2 min-h-[3rem]">
                          {project.address || "-"}
                        </div>
                      </div>
                      {project.totalScore > 0 && (
                        <div className="absolute top-2 right-2 bg-destructive/10 text-destructive text-xs font-semibold px-2 py-1 rounded-full">
                          {project.totalScore}
                        </div>
                      )}
                    </div>

                    <div>
                      {project.imageUrl && project.imageUrl !== "Chưa có ảnh" ? (
                        <img
                          src={project.imageUrl}
                          alt={project.nameSite || project.address}
                          className="w-full h-[150px] object-cover rounded-md mb-3"
                        />
                      ) : (
                        <div className="w-full h-[150px] bg-muted rounded-md flex items-center justify-center mb-3">
                          <span className="text-muted-foreground text-sm">Không có hình ảnh</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-sm text-muted gap-1">
                        <span className="font-medium text-muted-foreground">Diện tích:</span>
                        <span className="font-medium text-foreground">
                          {project.size != null ? `${project.size} m²` : "-"}
                        </span>
                      </div>
                      {project.proposedPrice != null && (
                        <div className="flex items-center text-sm text-muted gap-1">
                          <span className="font-medium text-muted-foreground">Giá đề xuất:</span>
                          <span className="font-medium text-foreground">
                            {project.proposedPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </div>
                      )}
                      {project.deposit != null && (
                        <div className="flex items-center text-sm text-muted gap-1">
                          <span className="font-medium text-muted-foreground">Tiền cọc:</span>
                          <span className="font-medium text-foreground">
                            {project.deposit.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </div>
                      )}
                      {project.leaseTerm && (
                        <div className="flex items-center text-sm text-muted gap-1">
                          <span className="font-medium text-muted-foreground">Thời hạn:</span>
                          <span className="font-medium text-foreground">{project.leaseTerm}</span>
                        </div>
                      )}
                      {project.additionalTerms && (
                        <div className="flex items-center text-sm text-muted gap-1">
                          <span className="font-medium text-muted-foreground">Điều khoản bổ sung:</span>
                          <span className="font-medium text-foreground">{project.additionalTerms}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(project.siteId)}
                        className="flex-1 text-sm"
                      >
                        Xem chi tiết
                      </Button>
                      {!showClosedSites && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveFromFavorites(project)}
                            className="flex-1 text-sm"
                          >
                            <Heart className="h-4 w-4 mr-1" fill="red" color="red" />
                            Bỏ quan tâm
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleCloseSite(project)}
                            className="flex-1 text-sm"
                          >
                            Chốt
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                {showClosedSites ? "Chưa có site nào đã chốt" : "Chưa có site nào trong danh sách quan tâm"}
              </p>
            )}
          </div>
        </div>
      </div>

      <CloseSite
        isOpen={isCloseSiteOpen}
        onClose={handleBackToFavorites}
        onUnclose={handleUnclose}
        title={title}
        brandRequestId={brandRequestId}
        setFavorites={setFavorites}
      />

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

      <Toaster position="top-left" />
    </>
  );
};

export default WishList;