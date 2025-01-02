import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Eye } from "lucide-react";
import * as React from "react";
import { useState } from "react";

// Mock data for demonstration
const mockData = {
  surveyRequests: [
    {
      id: 1,
      title: "Customer Satisfaction Survey",
      specificAddress: "123 Main St, City",
      clientEmail: "client1@example.com",
      reasons: "I want to improve...",
      scoreCheck: null,
      status: "inProgress",
    },
    {
      id: 2,
      title: "Employee Feedback Survey",
      specificAddress: "456 Work Ave, Town",
      clientEmail: "client2@example.com",
      reasons: "I want to know...",
      scoreCheck: 4.5,
      status: "done",
    },
    {
      id: 3,
      title: "Employee Feedback Survey",
      specificAddress: "456 Work Ave, Town",
      clientEmail: "client2@example.com",
      reasons: "I want to know...",
      scoreCheck: 4.5,
      status: "inProgress",
    },
    {
      id: 4,
      title: "Employee Feedback Survey",
      specificAddress: "456 Work Ave, Town",
      clientEmail: "client2@example.com",
      reasons: "I want to know...",
      scoreCheck: 4.5,
      status: "rejected",
    },
  ],
  ratingRequests: [
    {
      id: 1,
      title: "Product Rating Request",
      specificAddress: "789 Shop St, City",
      clientEmail: "client3@example.com",
      reasons: "I want to rate...",
      scoreCheck: 4.8,
      status: "done",
    },
    {
      id: 2,
      title: "Service Rating Request",
      specificAddress: "321 Service Rd, Town",
      clientEmail: "client4@example.com",
      reasons: "I want to evaluate...",
      scoreCheck: null,
      status: "inProgress",
    },
    {
      id: 3,
      title: "Service Rating Request",
      specificAddress: "321 Service Rd, Town",
      clientEmail: "client4@example.com",
      reasons: "I want to evaluate...",
      scoreCheck: null,
      status: "rejected",
    },
    {
      id: 4,
      title: "Service Rating Request",
      specificAddress: "321 Service Rd, Town",
      clientEmail: "client4@example.com",
      reasons: "I want to evaluate...",
      scoreCheck: null,
      status: "rejected",
    },
  ],
};

const RequestTable = () => {
  const [requestType, setRequestType] = useState("survey");

  const getStatusBadge = (status) => {
    const statusStyles = {
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

  const currentData =
    requestType === "survey"
      ? mockData.surveyRequests
      : mockData.ratingRequests;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Request Management</h2>
        <Select value={requestType} onValueChange={setRequestType}>
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
            <TableHead>Specific Address</TableHead>
            <TableHead>Client Email</TableHead>
            <TableHead>Reasons</TableHead>
            <TableHead>Score Check</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((request) => (
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
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestTable;
