import * as React from "react";
import QualificationProbs from "./QualificationProbs";
const qualificationData = {
  hero: {
    title: "Năng Lực Của Site Plus",
    description:
      "Chúng tôi hỗ trợ khách hàng lựa chọn những vị trí mặt bằng phù hợp nhất. Lựa chọn một mặt bằng có thể đơn giản nhưng chọn được mặt bằng phù hợp cần có chiến lược tổng thể.",
    buttonText: "TÌM HIỂU THÊM",
    backgroundImage: "/images/client/homepage/Avatar.svg",
    onButtonClick: () => console.log("Button clicked"),
  },
  qualificationItems: [
    {
      number: "1",
      title: "DỮ LIỆU THỰC TẾ",
      description:
        "Site Plus có dữ liệu cập nhật về lưu lượng các tuyến đường, mật độ dân cư các khu vực, phân bố khách hàng, hành vi mua sắm, thông tin mặt bằng,… giúp khoanh vùng khu vực, tuyến đường, vị trí tiềm năng",
    },
    {
      number: "2",
      title: "CÔNG THỨC MỞ ĐIỂM",
      description:
        "Site Plus số hóa chi tiết các tiêu chí để lựa chọn điểm bán, phù hợp từng mô hình kinh doanh, giúp việc đưa ra quyết định nhanh, chính xác và tránh cảm tính.",
    },
    {
      number: "3",
      title: "THƯƠNG THẢO HỢP ĐỒNG",
      description:
        "Hơn 10 năm kinh nghiệm làm việc với hàng ngàn chủ nhà của Site Plus sẽ giúp doanh nghiệp, đối tác luôn nắm lợi thế khi thương thảo và yên tâm đặt bút ký kết hợp đồng.",
    },
    {
      number: "4",
      title: "NGUỒN CUNG MẶT BẰNG",
      description:
        "Site Plus hợp tác với những đơn vị môi giới thuê nhà uy tín, giúp cập nhật và sàng lọc thông tin thị trường chưa kiểm chứng kết hợp chấm thực tế các vị trí có thể phù hợp yêu cầu khách hàng vì thế Site Plus có nguồn thông tin chính xác phù hợp và theo sát tình hình thị trường hơn các trang tin.",
    },
  ],
  highlight: {
    number: "5",
    title: "KINH NGHIỆM THỊ TRƯỜNG",
    description:
      "Các chuyên gia của Site Plus với kinh nghiệm hơn 10.000 giờ chuyên môn mở hàng trăm điểm bán mọi ngành nghề, nắm rõ mặt bằng giá thị trường, đặc điểm từng khu vực, tuyến đường..",
    backgroundColor: "#FF7426",
  },
};
interface QualificationContentProps {
  className?: string;
}
export default function QualificationContent({
  className,
}: QualificationContentProps) {
  return (
    <div id="qualification-content" className={className}>
      <QualificationProbs {...qualificationData} />
    </div>
  );
}
