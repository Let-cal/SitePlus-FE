import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, FileDown, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import managerService from "../../../../services/manager/manager.service";
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

interface CloseSiteProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    brandRequestId: number;
    setFavorites: React.Dispatch<React.SetStateAction<SearchAIProject[]>>;
}

const customStyles = `
  .closesite-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: hsl(var(--background));
    border-top: 1px solid hsl(var(--border));
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1002;
    display: flex;
    flex-direction: column;
  }
  .closesite-header {
    position: sticky;
    top: 0;
    background-color: hsl(var(--background));
    z-index: 10;
    padding: 1.5rem;
    border-bottom: 1px solid hsl(var(--border));
  }
  .closesite-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    padding-top: 0;
  }
  .search-result-card {
    position: relative;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
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
    color: #6b7280;
  }
  .search-result-address {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
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
    background-color: #f3f4f6;
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
    color: #4b5563;
    gap: 0.25rem;
  }
  .search-result-info-item-label {
    font-weight: 500;
    color: #6b7280;
  }
  .search-result-info-item-value {
    font-weight: 500;
    color: #1f2937;
  }
  .search-result-score {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: #fee2e2;
    color: #dc2626;
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

const CloseSite: React.FC<CloseSiteProps> = ({ isOpen, onClose, title, brandRequestId, setFavorites }) => {
    const [closedSites, setClosedSites] = useState<SearchAIProject[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchClosedSites = async () => {
                try {
                    const response = await managerService.fetchFavorites(brandRequestId);
                    if (!response.success || !response.data.closedSites || response.data.closedSites.length === 0) {
                        setClosedSites([]);
                        return;
                    }
                    const closedSitesData = response.data.closedSites.map((site: any) => ({
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
                    const uniqueClosedSites = Array.from(
                        new Map(closedSitesData.map((item: SearchAIProject) => [item.siteId, item])).values()
                    );
                    setClosedSites(uniqueClosedSites);
                } catch (error) {
                    console.error("Error fetching closed sites:", error);
                    toast.error("Lỗi khi tải danh sách đã chốt", {
                        position: "top-left",
                        duration: 3000,
                    });
                    setClosedSites([]);
                }
            };
            fetchClosedSites();
        }
    }, [isOpen, brandRequestId]);

    useEffect(() => {
        const styleElement = document.createElement("style");
        styleElement.innerHTML = customStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const handleViewDetails = (projectId: number) => {
        setSelectedSiteId(projectId);
    };

    const handleCloseSiteDetail = () => {
        setSelectedSiteId(null);
    };

    const handleUncloseSite = async (project: SearchAIProject) => {
        try {
            const success = await managerService.updateSiteStatus(project.siteId, 1);
            if (success) {
                setClosedSites((prevClosedSites) => prevClosedSites.filter((site) => site.siteId !== project.siteId));
                setFavorites((prevFavorites) => {
                    const updatedFavorites = [...prevFavorites, project];
                    return Array.from(
                        new Map(updatedFavorites.map((item) => [item.siteId, item])).values()
                    );
                });
                toast.success(`Đã bỏ chốt mặt bằng ID: ${project.siteId}`, {
                    position: "top-left",
                    duration: 3000,
                });
            } else {
                toast.error("Không thể bỏ chốt mặt bằng", {
                    position: "top-left",
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error("Error unclosing site:", error);
            toast.error("Lỗi khi bỏ chốt mặt bằng", {
                position: "top-left",
                duration: 3000,
            });
        }
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const pdfBlob = await managerService.exportPDF(brandRequestId);
            if (pdfBlob) {
                const url = window.URL.createObjectURL(pdfBlob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Summary_${brandRequestId}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.success("Xuất PDF thành công!", {
                    position: "top-left",
                    duration: 3000,
                });

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error("Không thể xuất PDF", {
                    position: "top-left",
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error("Error exporting PDF:", error);
            toast.error("Lỗi khi xuất PDF", {
                position: "top-left",
                duration: 3000,
            });
        } finally {
            setIsExporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="closesite-drawer">
                <div className="closesite-header">
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

                <div className="closesite-content">
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Danh sách đã chốt</h3>
                            <Button
                                variant="outline"
                                onClick={handleExportPDF}
                                className="flex items-center gap-2"
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <FileDown className="h-5 w-5" />
                                )}
                                {isExporting ? "Đang xuất..." : "Xuất PDF"}
                            </Button>
                        </div>

                        {closedSites.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
                                {closedSites.map((project) => (
                                    <div key={project.siteId} className="search-result-card">
                                        <div className="search-result-header">
                                            <div className="search-result-title">
                                                <div className="search-result-id">ID: {project.siteId}</div>
                                                <div className="search-result-address">{project.address || "-"}</div>
                                            </div>
                                            {project.totalScore > 0 && (
                                                <div className="search-result-score">{project.totalScore}</div>
                                            )}
                                        </div>

                                        <div>
                                            {project.imageUrl && project.imageUrl !== "Chưa có ảnh" ? (
                                                <img
                                                    src={project.imageUrl}
                                                    alt={project.nameSite || project.address}
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
                                                <span className="search-result-info-item-label">Diện tích:</span>
                                                <span className="search-result-info-item-value">
                                                    {project.size != null ? `${project.size} m²` : "-"}
                                                </span>
                                            </div>
                                            {project.proposedPrice != null && (
                                                <div className="search-result-info-item">
                                                    <span className="search-result-info-item-label">Giá đề xuất:</span>
                                                    <span className="search-result-info-item-value">
                                                        {project.proposedPrice.toLocaleString("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                            {project.deposit != null && (
                                                <div className="search-result-info-item">
                                                    <span className="search-result-info-item-label">Tiền cọc:</span>
                                                    <span className="search-result-info-item-value">
                                                        {project.deposit.toLocaleString("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                            {project.leaseTerm && (
                                                <div className="search-result-info-item">
                                                    <span className="search-result-info-item-label">Thời hạn:</span>
                                                    <span className="search-result-info-item-value">{project.leaseTerm}</span>
                                                </div>
                                            )}
                                            {project.additionalTerms && (
                                                <div className="search-result-info-item">
                                                    <span className="search-result-info-item-label">Điều khoản bổ sung:</span>
                                                    <span className="search-result-info-item-value">{project.additionalTerms}</span>
                                                </div>
                                            )}
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
                                                onClick={() => handleUncloseSite(project)}
                                                className="flex-1 text-sm"
                                            >
                                                Bỏ chốt
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Chưa có site nào đã chốt</p>
                        )}
                    </div>
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

            <Toaster position="top-left" />
        </>
    );
};

export default CloseSite;