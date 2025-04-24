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
    onUnclose: () => void;
    title: string;
    brandRequestId: number;
    setFavorites: React.Dispatch<React.SetStateAction<SearchAIProject[]>>;
}

const CloseSite: React.FC<CloseSiteProps> = ({ isOpen, onClose, onUnclose, title, brandRequestId, setFavorites }) => {
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
                toast.success(`Đã bỏ chốt mặt bằng ID: ${project.siteId}`, {
                    position: "top-left",
                    duration: 3000,
                });
                onUnclose(); // Gọi callback để trigger refetch trong WishList và RequestDetail
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
                link.setAttribute("download", `Summary_${String(brandRequestId)}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                const updateResult = await managerService.updateBrandRequestStatus(brandRequestId, 9);
                if (updateResult.success) {
                    toast.success("Đã cập nhật trạng thái yêu cầu thành Đã Đóng!", {
                        position: "top-left",
                        duration: 3000,
                    });
                } else {
                    console.error("Lỗi khi cập nhật trạng thái yêu cầu:", updateResult.message);
                    toast.error("Lỗi khi cập nhật trạng thái yêu cầu", {
                        position: "top-left",
                        duration: 3000,
                    });
                }

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
                            disabled={isExporting}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pt-0">
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
                                                disabled={isExporting}
                                            >
                                                Xem chi tiết
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleUncloseSite(project)}
                                                className="flex-1 text-sm"
                                                disabled={isExporting}
                                            >
                                                Bỏ chốt
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">Chưa có site nào đã chốt</p>
                        )}
                    </div>
                </div>
            </div>

            <Dialog.Root open={selectedSiteId !== null} onOpenChange={(open) => !open && setSelectedSiteId(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[1001]" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card rounded-lg shadow-lg z-[1002] w-[90vw] max-w-5xl h-[90vh] flex flex-col overflow-y-auto">
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