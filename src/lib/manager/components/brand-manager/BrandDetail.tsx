"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  CalendarIcon,
  HomeIcon,
  Loader2,
  MapPinIcon,
  Store,
  TagIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";
import managerService, {
  Store as StoreType,
} from "../../../../services/manager/manager.service";
import SiteDetail from "../site-manager/SiteDetail";
import type { Brand } from "./BrandTable";

interface SiteCategoryWithStores {
  siteCategory: {
    id: number;
    name: string;
  };
  stores: StoreType[];
}

interface BrandDetailProps {
  brand: Brand | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStoreCount?: (brandId: number, storeCount: number) => void;
}

export default function BrandDetail({
  brand,
  isOpen,
  onOpenChange,
  onUpdateStoreCount,
}: BrandDetailProps) {
  const [storesData, setStoresData] = React.useState<SiteCategoryWithStores[]>([]);
  const [isLoadingStores, setIsLoadingStores] = React.useState<boolean>(false);
  const [hasFetchedData, setHasFetchedData] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<"info" | "stores">("info");
  const [storeCount, setStoreCount] = React.useState<number>(0);
  const [selectedSiteId, setSelectedSiteId] = React.useState<number | null>(null);

  // Reset trạng thái khi dialog đóng
  React.useEffect(() => {
    if (!isOpen) {
      setStoresData([]);
      setHasFetchedData(false);
      setStoreCount(0);
      setActiveTab("info");
      setSelectedSiteId(null);
      setIsLoadingStores(false);
    }
  }, [isOpen]);

  // Gộp logic fetch dữ liệu: chỉ gọi API một lần
  const fetchData = React.useCallback(async () => {
    if (brand && brand.id) {
      setIsLoadingStores(true);
      try {
        const response = await managerService.fetchStoresByBrandId(brand.id);
        console.log("Fetch Stores Data - API Response:", response);
        if (response.success && response.data && Array.isArray(response.data.listData)) {
          const totalStores = response.data.listData.reduce(
            (total: number, category: SiteCategoryWithStores) => total + (category.stores?.length || 0),
            0
          );
          setStoreCount(totalStores);
          setStoresData(response.data.listData);
          if (onUpdateStoreCount && totalStores > 0) {
            onUpdateStoreCount(brand.id, totalStores);
          }
        } else {
          setStoreCount(0);
          setStoresData([]);
        }
        setHasFetchedData(true);
      } catch (error) {
        console.error("Failed to fetch stores data:", error);
        setStoreCount(0);
        setStoresData([]);
        setHasFetchedData(true);
      } finally {
        setIsLoadingStores(false);
      }
    }
  }, [brand, onUpdateStoreCount]);

  // Gọi API khi dialog mở hoặc khi tab "stores" được kích hoạt
  React.useEffect(() => {
    if (brand && isOpen && !hasFetchedData) {
      fetchData();
    }
  }, [brand, isOpen, hasFetchedData, fetchData]);

  if (!brand) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleViewSite = (siteId: number) => {
    setSelectedSiteId(siteId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden max-h-[95vh]">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Chi tiết thương hiệu
            <Badge
              className={
                brand.status === 1
                  ? "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 justify-center px-2 py-0.5"
                  : "bg-red-100 text-red-800 dark:bg-red-300 hover:bg-red-200 dark:hover:bg-red-400 justify-center px-2 py-0.5"
              }
            >
              {brand.status === 1 ? brand.brandStatusName : "Chờ xử lý"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về thương hiệu {brand.name}
          </DialogDescription>
          <CardDescription className="text-lg font-medium mt-1">
            {brand.name}
          </CardDescription>
        </DialogHeader>

        <Separator />

        <Tabs
          defaultValue="info"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "info" | "stores")}
          className="w-full"
        >
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Thông tin thương hiệu</TabsTrigger>
              <TabsTrigger value="stores" className="flex items-center gap-1">
                Cửa hàng
                {storeCount > 0 && (
                  <Badge variant="outline" className="ml-1">
                    {storeCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="pt-2">
            <ScrollArea className="max-h-[50vh] overflow-y-auto">
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Thông tin cơ bản */}
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <TagIcon className="mr-2 h-5 w-5 text-primary" />
                        Thông tin cơ bản
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            ID Thương hiệu
                          </div>
                          <div className="font-medium">{brand.id}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Tên thương hiệu
                          </div>
                          <div className="font-medium">{brand.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Trạng thái
                          </div>
                          <Badge
                            className={
                              brand.status === 1
                                ? "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 justify-center px-2 py-0.5"
                                : "bg-red-100 text-red-800 dark:bg-red-300 hover:bg-red-200 dark:hover:bg-red-400 justify-center px-2 py-0.5"
                            }
                          >
                            {brand.status === 1
                              ? brand.brandStatusName
                              : "Chờ xử lý"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Thông tin thời gian */}
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                        Thông tin thời gian
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Ngày tạo
                          </div>
                          <div className="font-medium">
                            {formatDate(brand.createdAt)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Cập nhật lần cuối
                          </div>
                          <div className="font-medium">
                            {formatDate(brand.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Loại ngành */}
                  <Card className="md:col-span-2">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Building className="mr-2 h-5 w-5 text-primary" />
                        Loại ngành
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {brand.industryCategories.length > 0 ? (
                          brand.industryCategories.map((category, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="px-3 py-1 border-primary/30"
                            >
                              {category.name}
                            </Badge>
                          ))
                        ) : (
                          <div className="text-muted-foreground">
                            Chưa có thông tin loại ngành
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Đối tượng khách hàng */}
                  <Card className="md:col-span-2">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <UsersIcon className="mr-2 h-5 w-5 text-primary" />
                        Đối tượng khách hàng
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {brand.customerSegments.length > 0 ? (
                          brand.customerSegments.map((segment, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="px-3 py-1 border-primary/30"
                            >
                              {segment.name}
                            </Badge>
                          ))
                        ) : (
                          <div className="text-muted-foreground">
                            Chưa có thông tin đối tượng khách hàng
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stores">
            <ScrollArea className="max-h-[50vh]">
              <div className="px-6 py-4">
                {isLoadingStores ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
                  </div>
                ) : storesData.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
                    <p className="text-lg font-medium">Không có cửa hàng nào</p>
                    <p className="text-sm">
                      Thương hiệu này chưa có bất kỳ cửa hàng nào được đăng ký.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 accordion-table-container">
                    <h3 className="text-lg font-semibold">
                      Danh sách cửa hàng ({storeCount})
                    </h3>
                    <Accordion type="multiple" className="w-full">
                      {storesData.map((categoryData) => (
                        <AccordionItem
                          key={categoryData.siteCategory.id}
                          value={`category-${categoryData.siteCategory.id}`}
                        >
                          <AccordionTrigger className="hover:bg-muted/50 px-3 rounded-md">
                            <div className="flex items-center gap-2">
                              <HomeIcon className="h-5 w-5 text-primary" />
                              <span>{categoryData.siteCategory.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {categoryData.stores.length}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2 pb-1">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[5%]">ID</TableHead>
                                    <TableHead className="w-[20%]">
                                      Tên cửa hàng
                                    </TableHead>
                                    <TableHead className="w-[20%] text-center">
                                      ID mặt bằng
                                    </TableHead>
                                    <TableHead className="w-[20%] text-center">
                                      Địa chỉ
                                    </TableHead>
                                    <TableHead className="w-[20%] text-center">
                                      Loại hồ sơ
                                    </TableHead>
                                    <TableHead className="w-[25%]">
                                      Xem mặt bằng
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {categoryData.stores.map((store) => (
                                    <TableRow key={store.id}>
                                      <TableCell className="font-medium">
                                        {store.id}
                                      </TableCell>
                                      <TableCell>{store.name}</TableCell>
                                      <TableCell className="text-center">
                                        {store.siteId || "-"}
                                      </TableCell>
                                      <TableCell className="flex items-center">
                                        <MapPinIcon className="h-4 w-4 text-muted-foreground mr-1 flex-shrink-0" />
                                        <span className="line-clamp-2">
                                          {store.address || "Chưa có địa chỉ"}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <Badge
                                          variant="secondary"
                                          className="text-xs font-normal"
                                        >
                                          {store.storeProfileCategory?.name || "Không xác định"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {store.siteId ? (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() =>
                                              handleViewSite(store.siteId)
                                            }
                                          >
                                            Xem mặt bằng
                                          </Button>
                                        ) : (
                                          <span className="text-gray-400 text-sm">
                                            Không có mặt bằng
                                          </span>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />
      </DialogContent>

      {selectedSiteId !== null && (
        <SiteDetail
          siteId={selectedSiteId}
          onClose={() => setSelectedSiteId(null)}
        />
      )}
    </Dialog>
  );
}