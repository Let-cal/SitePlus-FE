import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import areaManagerService from "../../../../services/area-manager/area-manager.service";

// Interface cho dữ liệu chi tiết site (đã định nghĩa trong areaManagerService, import lại để sử dụng)
interface SiteImage {
  id: number;
  url: string;
}

interface SiteDeal {
  proposedPrice: number;
  leaseTerm: string;
  deposit: number;
  additionalTerms: string;
  depositMonth: string;
  status: number;
  statusName: string;
  createdAt: string;
  updatedAt: string;
}

interface AttributeValue {
  id: number;
  value: string;
  additionalInfo: string;
}

interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
}

interface AttributeGroup {
  id: number;
  name: string;
  attributes: Attribute[];
}

interface SiteDetail {
  id: number;
  address: string;
  size: number;
  floor: number;
  totalFloor: number;
  description: string;
  buildingName: string;
  status: number;
  statusName: string;
  areaId: number;
  areaName: string;
  districtName: string;
  cityName: string;
  siteCategoryId: number;
  siteCategoryName: string;
  images: SiteImage[];
  attributeGroups: AttributeGroup[];
  siteDeals: SiteDeal[];
}

interface SiteDetailProps {
  siteId: number;
  onClose: () => void;
}

export default function SiteDetail({ siteId, onClose }: SiteDetailProps) {
  const [site, setSite] = React.useState<SiteDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null); // Thêm state error
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [openGroups, setOpenGroups] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState("info");

  // Gọi API để lấy chi tiết site
  React.useEffect(() => {
    const loadSiteDetail = async () => {
      setIsLoading(true);
      setError(null); // Reset error
      try {
        const siteData = await areaManagerService.getSiteById(siteId);
        if (siteData) {
          setSite(siteData);
        } else {
          setError("Không tìm thấy dữ liệu mặt bằng.");
        }
      } catch (error) {
        console.error("Error loading site detail:", error);
        setError("Lỗi khi tải dữ liệu mặt bằng. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    loadSiteDetail();
  }, [siteId]);

  // Chỉ reset trạng thái mở/đóng của các group khi dialog đóng hoàn toàn
  React.useEffect(() => {
    return () => {
      setOpenGroups([]); // Reset khi component unmount
    };
  }, []);

  // Định dạng tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Định dạng ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Xử lý attributeGroups: Gộp dữ liệu lặp lại
  const processAttributeGroups = (groups: AttributeGroup[]) => {
    return groups.map((group) => {
      const mergedAttributes: { [key: string]: AttributeValue[] } = {};

      // Gộp các attribute có cùng name
      group.attributes.forEach((attr) => {
        if (!mergedAttributes[attr.name]) {
          mergedAttributes[attr.name] = [];
        }
        mergedAttributes[attr.name].push(...attr.values);
      });

      // Gộp các value có cùng value
      const processedAttributes = Object.entries(mergedAttributes).map(([name, values]) => {
        const mergedValues: { [key: string]: string[] } = {};
        values.forEach((val) => {
          if (!mergedValues[val.value]) {
            mergedValues[val.value] = [];
          }
          mergedValues[val.value].push(val.additionalInfo);
        });

        return {
          name,
          values: Object.entries(mergedValues).map(([value, additionalInfos]) => ({
            value,
            additionalInfo: additionalInfos.join(", "),
          })),
        };
      });

      return {
        ...group,
        attributes: processedAttributes,
      };
    });
  };

  // Sắp xếp siteDeals theo createdAt (mới nhất lên trên)
  const sortedSiteDeals = site?.siteDeals
    ? [...site.siteDeals].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  // Xử lý chuyển đổi hình ảnh trong modal
  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleNextImage = () => {
    if (!site || !selectedImage) return;
    const currentIndex = site.images.findIndex((img) => img.url === selectedImage);
    const nextIndex = (currentIndex + 1) % site.images.length;
    setSelectedImage(site.images[nextIndex].url);
  };

  const handlePrevImage = () => {
    if (!site || !selectedImage) return;
    const currentIndex = site.images.findIndex((img) => img.url === selectedImage);
    const prevIndex = (currentIndex - 1 + site.images.length) % site.images.length;
    setSelectedImage(site.images[prevIndex].url);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Phần cố định: Tiêu đề */}
        <DialogHeader className="pr-8">
          <DialogTitle className="text-center">
            ID {siteId} - {site?.siteCategoryName || "Loading..."}
          </DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="text-center py-4 text-destructive">{error}</div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full mt-2 flex flex-col flex-1"
          >
            <TabsList className="grid w-full grid-cols-2 sticky top-0 bg-muted z-10">
              <TabsTrigger value="info">Thông tin mặt bằng</TabsTrigger>
              <TabsTrigger value="attributes">Thuộc tính</TabsTrigger>
            </TabsList>

            {/* Container cho phép cuộn */}
            <div className="flex-1 overflow-y-auto">
              {/* Tab 1: Thông tin mặt bằng */}
              <TabsContent
                value="info"
                className="mt-4 px-4 overflow-y-auto max-h-[calc(90vh-120px)]"
              >
                {isLoading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : !site ? (
                  <div className="text-center py-4">Không có dữ liệu để hiển thị</div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {/* Địa chỉ (gộp cityName) */}
                    <div>
                      <p className="font-semibold text-lg">
                        Địa chỉ: {site.address}, {site.areaName}, {site.districtName}, {site.cityName}
                      </p>
                    </div>

                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-2 gap-4">
                      <p>
                        <span className="font-medium">Diện tích:</span> {site.size}m²
                      </p>
                      {site.siteCategoryId === 1 ? (
                        <>
                          <p>
                            <span className="font-medium">Tên tòa nhà:</span> {site.buildingName}
                          </p>
                          <p>
                            <span className="font-medium">Vị trí tầng:</span> {site.floor}
                          </p>
                          <p>
                            <span className="font-medium">Tổng số tầng:</span> {site.totalFloor}
                          </p>
                        </>
                      ) : (
                        <p>
                          <span className="font-medium">Tổng số tầng:</span> {site.floor}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Mô tả:</span> {site.description || "Không có mô tả"}
                      </p>
                    </div>

                    {/* Hình ảnh */}
                    {site.images && site.images.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Hình ảnh:</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {site.images.map((image) => (
                            <img
                              key={image.id}
                              src={image.url}
                              alt={`Site image ${image.id}`}
                              className="w-full h-[150px] object-cover cursor-pointer rounded-md"
                              onClick={() => handleImageClick(image.url)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Điều kiện thuê */}
                    {sortedSiteDeals.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Điều kiện thuê:</h3>
                        {sortedSiteDeals.map((deal, index) => (
                          <div key={index} className="border p-4 rounded-md mb-4">
                            <div className="flex justify-between items-center bg-muted p-2 rounded-md mb-2">
                              <p className="font-semibold text-lg">
                                Ngày tạo: {formatDate(deal.createdAt)}
                              </p>
                              <Badge
                                className={
                                  deal.status === 1
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }
                              >
                                {deal.statusName}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p>
                                  <span className="font-medium">Giá đề xuất:</span> {formatCurrency(deal.proposedPrice)}
                                </p>
                                <p>
                                  <span className="font-medium">Thời hạn thuê:</span> {deal.leaseTerm}
                                </p>
                                <p>
                                  <span className="font-medium">Tiền cọc:</span> {formatCurrency(deal.deposit)}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">Điều khoản bổ sung:</span> {deal.additionalTerms || "Không có"}
                                </p>
                                <p>
                                  <span className="font-medium">Số tháng cọc:</span> {deal.depositMonth}
                                </p>
                                <p>
                                  <span className="font-medium">Ngày cập nhật:</span> {formatDate(deal.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Thuộc tính */}
              <TabsContent
                value="attributes"
                className="mt-4 px-4 overflow-y-auto max-h-[calc(90vh-120px)]"
              >
                {isLoading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : !site ? (
                  <div className="text-center py-4">Không có dữ liệu để hiển thị</div>
                ) : site.attributeGroups && site.attributeGroups.length > 0 ? (
                  <Accordion
                    type="multiple"
                    className="w-full pb-4"
                    value={openGroups}
                    onValueChange={(value) => setOpenGroups(value)}
                  >
                    {processAttributeGroups(site.attributeGroups).map((group) => (
                      <AccordionItem key={group.id} value={`group-${group.id}`}>
                        <AccordionTrigger className="uppercase">{group.name}</AccordionTrigger>
                        <AccordionContent>
                          {group.attributes.map((attr, index) => (
                            <div key={index} className="mb-2">
                              <p className="font-medium">{attr.name}:</p>
                              <ul className="list-disc pl-5">
                                {attr.values.map((val, idx) => (
                                  <li key={idx}>
                                    {val.value}{val.additionalInfo ? `: ${val.additionalInfo}` : ""}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p>Không có thuộc tính để hiển thị</p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        )}

        {/* Modal hiển thị hình ảnh lớn - Không có nút "X" */}
        {selectedImage && (
          <Dialog
            open={true}
            onOpenChange={() => setSelectedImage(null)}
          >
            <DialogContent className="max-w-5xl bg-transparent border-none shadow-none">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Site image"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <button
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-background/70 rounded-full p-2 hover:bg-background/90"
                  onClick={handlePrevImage}
                >
                  ←
                </button>
                <button
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-background/70 rounded-full p-2 hover:bg-background/90"
                  onClick={handleNextImage}
                >
                  →
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}