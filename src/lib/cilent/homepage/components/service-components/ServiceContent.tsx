import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Heading from "@/lib/all-site/Heading";
import * as React from "react";
import BoxContent from "./BoxContent";
import IconService2 from "/icons/Base feature icon (1).svg";
import IconService3 from "/icons/Base feature icon (2).svg";
import IconService1 from "/icons/Base feature icon.svg";
interface ServiceContentProps {
  className?: string;
}
export default function ServiceContent({ className }: ServiceContentProps) {
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
    <div id="service-content" className={className}>
      <div className="flex flex-col gap-[26px] pb-[20px] justify-center items-center px-4">
        <h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
          TÌM HIỂU NGAY
        </h3>
        <Heading text="Dịch Vụ Của Site Plus" />

        {/* Desktop view */}
        <div className="hidden lg:flex lg:flex-row lg:space-x-4 lg:h-[420.667px]">
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

        {/* Mobile/Tablet view with Carousel */}
        <div className="lg:hidden w-full max-w-[370.667px] relative px-8">
          <Carousel className="w-full">
            <CarouselContent>
              {services.map((service, index) => (
                <CarouselItem key={index}>
                  <BoxContent
                    iconUrl={service.iconUrl}
                    title={service.title}
                    description={service.description}
                    bulletPoints={service.bulletPoints}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-32px] flex" />
            <CarouselNext className="absolute right-[-32px] flex" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
