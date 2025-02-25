import * as React from "react";
import Heading from "../../../all-site/Heading"
import Content from "../../../all-site/Content";

const About: React.FC = () => {
  const headingText = "VỀ SITE PLUS";
  const contentText =
    "Site Plus đặt nền móng đầu tiên và duy nhất cho hoạt động tư vấn chiến lược mặt bằng tại Việt Nam. Sứ mệnh của Site Plus là giúp các doanh nghiệp tăng xác suất thành công, đồng thời tiết kiệm ngay, tối ưu ngay rất nhiều chi phí từ khi điểm bán chưa mở.";
  const imageUrl =
    "https://siteplus.vn/wp-content/uploads/2023/10/khoa-huan-luyen-thuc-thi-mo-diem-ban-1280x720.jpg";

  return (
    <div className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <Heading text={headingText} />
      <Content text={contentText} />
      <div className="flex justify-center">
        <img
          src={imageUrl}
          alt="Team discussing in front of a laptop"
          className="rounded-lg shadow-lg w-full max-w-4xl"
        />
      </div>
    </div>
  );
};

export default About;
