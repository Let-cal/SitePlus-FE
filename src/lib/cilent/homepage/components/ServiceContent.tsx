import * as React from "react";
import BoxContent from "./BoxContent";
import IconService2 from "/icons/Base feature icon (1).svg";
import IconService3 from "/icons/Base feature icon (2).svg";
import IconService1 from "/icons/Base feature icon.svg";
export default function ServiceContent() {
  const services = [
    {
      iconUrl: IconService1,
      title: "CHIẾN LƯỢC MỞ ĐIỂM",
      description:
        "Site Plus phân tích, tư vấn và lập chiến lược mở điểm bán tiềm năng, phù hợp với định hướng của doanh nghiệp.",
      bulletPoints: ["Tư vấn 1-1", "Xây dựng concept", "Lập bản đồ mở điểm"],
    },
    {
      iconUrl: IconService2,
      title: "THỰC THI",
      description:
        "Giúp doanh nghiệp tìm điểm bán hiệu quả theo chiến lược và kinh nghiệm.",
      bulletPoints: [
        "Thẩm định online.",
        "Thẩm định trực tiếp.",
        "Đàm phán.",
        "Tối ưu nhận diện.",
        "Thực thi tìm điểm.",
      ],
    },
    {
      iconUrl: IconService3,
      title: "ĐÀO TẠO",
      description:
        "Site Plus đào tạo nội bộ doanh nghiệp về kinh nghiệm, kỹ năng thực thi mở điểm bán đậm tính thực chiến.",
      bulletPoints: ["Đào tạo nội bộ doanh nghiệp.", "Đào tạo khóa học."],
    },
  ];

  return (
    <div className="flex flex-col gap-[26px] pb-[20px] justify-center items-center">
      <h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
        TÌM HIỂU NGAY
      </h3>

      <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl text-theme-orange-500">
        Dịch Vụ Của Site Plus
      </h1>

      <div className="flex flex-row space-x-4 h-[386.667px]">
        {services.map((service, index) => (
          <BoxContent
            key={index}
            iconUrl={service.iconUrl}
            title={service.title}
            description={service.description}
            bulletPoints={service.bulletPoints}
          />
        ))}
      </div>
    </div>
  );
}
