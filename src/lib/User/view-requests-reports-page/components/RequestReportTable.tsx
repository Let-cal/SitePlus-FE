import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Heading from "@/lib/all-site/Heading";
import { Eye, Search } from "lucide-react";
import * as React from "react";
import { useState } from "react";
const RequestReportPage = () => {
  const [requestType, setRequestType] = useState("survey");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with your actual data
  const mockRequests = [
    {
      id: "1",
      title: "Đánh giá địa điểm Quận 1",
      address: "123 Nguyễn Huệ",
      clientEmail: "khachhang1@example.com",
      reason: "Khảo sát địa điểm mới",
      status: "done",
      scoreCheck: 4.5,
      report: {
        evaluation: "Vị trí đẹp, lưu lượng người qua lại cao",
        recommendations: "Nên tiến hành thuê mặt bằng",
        details: "Địa điểm đáp ứng đầy đủ các tiêu chí",
      },
    },
    {
      id: "2",
      title: "Xem xét mặt bằng bán lẻ",
      address: "456 Lê Lợi",
      clientEmail: "khachhang2@example.com",
      reason: "Kế hoạch mở rộng",
      status: "inProgress",
      scoreCheck: null,
    },
    {
      id: "3",
      title: "Xem xét mặt bằng bán lẻ",
      address: "456 Lê Lợi",
      clientEmail: "khachhang2@example.com",
      reason: "Kế hoạch mở rộng",
      status: "inProgress",
      scoreCheck: null,
    },
    {
      id: "4",
      title: "Xem xét mặt bằng bán lẻ",
      address: "456 Lê Lợi",
      clientEmail: "khachhang2@example.com",
      reason: "Kế hoạch mở rộng",
      status: "inProgress",
      scoreCheck: null,
    },
    {
      id: "5",
      title: "Đánh giá địa điểm Quận 1",
      address: "123 Nguyễn Huệ",
      clientEmail: "khachhang1@example.com",
      reason: "Khảo sát địa điểm mới",
      status: "done",
      scoreCheck: 4.5,
      report: {
        evaluation: "Vị trí đẹp, lưu lượng người qua lại cao",
        recommendations: "Nên tiến hành thuê mặt bằng",
        details: "Địa điểm đáp ứng đầy đủ các tiêu chí",
      },
    },
    {
      id: "6",
      title: "Đánh giá địa điểm Quận 1",
      address: "123 Nguyễn Huệ",
      clientEmail: "khachhang1@example.com",
      reason: "Khảo sát địa điểm mới",
      status: "done",
      scoreCheck: 4.5,
      report: {
        evaluation: "Vị trí đẹp, lưu lượng người qua lại cao",
        recommendations: "Nên tiến hành thuê mặt bằng",
        details: "Địa điểm đáp ứng đầy đủ các tiêu chí",
      },
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      done: "bg-green-500 hover:bg-green-600",
      inProgress: "bg-blue-500 hover:bg-blue-600",
      rejected: "bg-red-500 hover:bg-red-600",
    };

    const statusText: Record<string, string> = {
      done: "Hoàn thành",
      inProgress: "Đang xử lý",
      rejected: "Từ chối",
    };

    return (
      <div className="flex items-center gap-2">
        <Badge className={`${statusStyles[status]} text-white`}>
          {statusText[status]}
        </Badge>
        {status === "done" && (
          <div className="w-3 h-3 rounded-full bg-blue-500" />
        )}
      </div>
    );
  };

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <Heading text="Các Đơn Yêu Cầu Của Bạn" size="sm" hasMargin={false} />
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-balance text-center pb-3">
            SitePlus xin chân thành Cảm ơn quý khách đã tin tưởng và lựa chọn
            dịch vụ của chúng tôi. Sự hài lòng của quý khách chính là động lực
            để chúng tôi không ngừng hoàn thiện và phát triển
          </p>
          <p className="text-gray-600 text-balance text-center">
            "Cảm ơn quý khách đã để chúng tôi trở thành một phần trong hành
            trình thành công của bạn."
          </p>
        </CardContent>
      </Card>

      {/* Controls Section */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="done">Hoàn thành</SelectItem>
              <SelectItem value="inProgress">Đang xử lý</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select
          value={requestType}
          onValueChange={(value) => setRequestType(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn loại yêu cầu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="survey">Yêu cầu khảo sát</SelectItem>
            <SelectItem value="rating">Yêu cầu đánh giá</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableCaption>
              Danh sách yêu cầu{" "}
              {requestType === "survey" ? "khảo sát" : "đánh giá"} và báo cáo
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Địa chỉ/Thời gian</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === request.id ? null : request.id
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {request.title}
                    </TableCell>
                    <TableCell>{request.address}</TableCell>
                    <TableCell>{request.clientEmail}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      {request.status === "done" ? (
                        <span className="font-medium text-green-600">
                          {request.scoreCheck}/5.0
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                  {request.status === "done" && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <Accordion
                          type="single"
                          value={expandedRow ?? ""}
                          className="w-full"
                        >
                          <AccordionItem value={request.id}>
                            <AccordionContent className="p-4 bg-blue-50">
                              <div className="space-y-2">
                                <h4 className="font-semibold">
                                  Chi tiết báo cáo
                                </h4>
                                <p>
                                  <strong>Đánh giá:</strong>{" "}
                                  {request.report?.evaluation}
                                </p>
                                <p>
                                  <strong>Đề xuất:</strong>{" "}
                                  {request.report?.recommendations}
                                </p>
                                <p>
                                  <strong>Chi tiết bổ sung:</strong>{" "}
                                  {request.report?.details}
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestReportPage;
