import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/lib/all-site/pagination";
import { adminService } from "@/services/admin/admin.service";
import { Eye } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { RequestDetailsDialog } from "./RequestDetailsDialog";

// Define proper interfaces for the response types
interface RatingRequest {
  id: number;
  title: string;
  specificAddress: string;
  reason: string;
  scoreCheck: number;
  status: number;
  clientId: number;
}

interface SurveyRequest {
  id: number;
  title: string;
  expectedTime: string;
  reason: string;
  scoreCheck: number;
  status: number;
  clientId: number;
}

interface Request {
  id: number;
  title: string;
  specificAddress: string;
  clientEmail: string;
  reasons: string;
  scoreCheck: number;
  status: string;
}

interface RequestData {
  id: number;
  title?: string;
  status?: number;
  name?: string;
  taxCode?: string;
  industry?: string;
  specificAddress?: string;
  areaSize?: number;
  expectedTime?: string;
  expectedRentalPrice?: number;
  preferredArea?: string;
  description?: string;
  scoreCheck?: number;
  reason?: string;
}

type RequestType = "survey" | "rating";

const RequestTable = () => {
  const [requestType, setRequestType] = useState<RequestType>("survey");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = async (id: number) => {
    try {
      const response =
        requestType === "survey"
          ? await adminService.getSurveyRequestDetails(id)
          : await adminService.getRatingRequestDetails(id);

      if (response.data) {
        // Convert the response data to RequestData type
        const requestData: RequestData = {
          id: response.data.id,
          // Add other required fields based on your RequestData interface
          ...response.data,
        };
        setSelectedRequest(requestData);
        setDetailsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const handleRequestTypeChange = (value: string) => {
    if (value === "survey" || value === "rating") {
      setRequestType(value);
    }
  };
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response =
        requestType === "survey"
          ? await adminService.getSurveyRequests(currentPage, pageSize)
          : await adminService.getRatingRequests(currentPage, pageSize);

      if (Array.isArray(response.data)) {
        const mappedData = response.data.map(
          (item: SurveyRequest | RatingRequest) => ({
            id: item.id,
            title: item.title,
            specificAddress:
              requestType === "survey"
                ? (item as SurveyRequest).expectedTime
                : (item as RatingRequest).specificAddress || "N/A",
            clientEmail: `client${item.clientId}@example.com`,
            reasons: item.reason,
            scoreCheck: item.scoreCheck,
            status: getStatusFromNumber(item.status),
          })
        );

        setRequests(mappedData);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, requestType]);

  const getStatusFromNumber = (status: number): string => {
    switch (status) {
      case 0:
        return "rejected";
      case 1:
        return "inProgress";
      case 2:
        return "done";
      default:
        return "inProgress";
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      done: "bg-green-500 hover:bg-green-600",
      inProgress: "bg-blue-500 hover:bg-blue-600",
      rejected: "bg-red-500 hover:bg-red-600",
    };

    return (
      <Badge className={`${statusStyles[status]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Request Management</h2>
        <Select value={requestType} onValueChange={handleRequestTypeChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select request type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="survey">Survey Requests</SelectItem>
            <SelectItem value="rating">Rating Requests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>
          List of {requestType === "survey" ? "Survey" : "Rating"} Requests
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>
              {requestType === "survey" ? "Expected Time" : "Specific Address"}
            </TableHead>
            <TableHead>Client Email</TableHead>
            <TableHead>Reasons</TableHead>
            <TableHead>Score Check</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 7 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.title}</TableCell>
                  <TableCell>{request.specificAddress}</TableCell>
                  <TableCell>{request.clientEmail}</TableCell>
                  <TableCell>{request.reasons}</TableCell>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(request.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(requests.length / pageSize)}
          onPageChange={handlePageChange}
        />
      </div>
      <RequestDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        data={selectedRequest}
        type={requestType}
      />
    </div>
  );
};

export default RequestTable;
