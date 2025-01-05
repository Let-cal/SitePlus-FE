import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { CheckCircle, Info, XCircle } from "lucide-react"; // Import icons
import * as React from "react";

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

interface RequestDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: RequestData | null;
  type: "survey" | "rating";
}

export const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  open,
  onOpenChange,
  data,
  type,
}) => {
  const getStatusBadge = (status: number) => {
    const statusMap = {
      0: {
        label: "Rejected",
        className: "bg-red-500",
        icon: <XCircle className="w-4 h-4 mr-1" />,
      },
      1: {
        label: "In Progress",
        className: "bg-blue-500",
        icon: <Info className="w-4 h-4 mr-1" />,
      },
      2: {
        label: "Done",
        className: "bg-green-500",
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
      },
    };
    const statusInfo = statusMap[status] || statusMap[1];
    return (
      <Badge className={`${statusInfo.className} text-white flex items-center`}>
        {statusInfo.icon}
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-auto">
        <DialogHeader className="flex items-center gap-2">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Request Details
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-auto pr-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-muted-foreground" />
                  {data?.title}
                </div>
                {data?.status !== undefined && getStatusBadge(data.status)}
              </CardTitle>
              <CardDescription>Request ID: {data?.id}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <span className="text-muted-foreground text-sm">
                        Name:
                      </span>
                      <p>{data?.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">
                        Tax Code:
                      </span>
                      <p>{data?.taxCode}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">
                        Industry:
                      </span>
                      <p>{data?.industry}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    Additional Details
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {type === "rating" ? (
                      <>
                        <div>
                          <span className="text-muted-foreground text-sm">
                            Specific Address:
                          </span>
                          <p>{data?.specificAddress}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">
                            Area Size:
                          </span>
                          <p>{data?.areaSize} m²</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-muted-foreground text-sm">
                            Expected Time:
                          </span>
                          <p>
                            {data?.expectedTime &&
                              format(new Date(data.expectedTime), "PPP")}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">
                            Expected Rental Price:
                          </span>
                          <p>${data?.expectedRentalPrice}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">
                            Preferred Area:
                          </span>
                          <p>{data?.preferredArea}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Description
                </h4>
                <p className="text-sm text-muted-foreground">
                  {data?.description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Status Information
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-muted-foreground text-sm">
                      Score Check:
                    </span>
                    <p>{data?.scoreCheck}/200</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">
                      Reason:
                    </span>
                    <p>{data?.reason}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
