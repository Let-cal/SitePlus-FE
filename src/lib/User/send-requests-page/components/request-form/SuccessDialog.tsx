import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import * as React from "react";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  onClose,
  email,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Yêu cầu đã được tiếp nhận
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-center space-y-2 py-4">
          <p className="text-gray-700">
            Chân thành cảm ơn Quý khách đã tin tưởng sử dụng dịch vụ của
            SitePlus.
          </p>
          <p className="text-gray-700">
            Đội ngũ chuyên viên tư vấn của chúng tôi sẽ sớm liên hệ qua email{" "}
            <span className="font-medium text-blue-600">{email}</span> để xác
            nhận và trao đổi chi tiết về yêu cầu tìm kiếm mặt bằng thương mại
            của Quý khách.
          </p>
          <p className="text-gray-700 italic">
            "Sự đồng hành của Quý khách là nguồn động lực quý giá để SitePlus
            không ngừng hoàn thiện và nâng cao chất lượng dịch vụ."
          </p>
        </DialogDescription>

        <DialogFooter className="sm:justify-center mt-4">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md transition-colors"
          >
            Đồng ý
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
