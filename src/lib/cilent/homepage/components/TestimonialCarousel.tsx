import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";
import Heading from "../../../all-site/Heading";
const testimonials = [
  {
    image:
      "https://siteplus.vn/wp-content/uploads/2023/10/Le-Thanh-Dat_Founder-Rau-Ma-Mix-258x258.jpg",
    content:
      "Với chuỗi Rau Má Mix, việc lựa chọn điểm bán tiềm năng là vấn đề cực kỳ nan giải. Tuy nhiên, đội ngũ Site Plus đã giúp tôi giải quyết được vấn đề này. Từ khi hợp tác, chúng tôi đã mở thành công nhiều chi nhánh mới, đón nhận lượng khách tốt hơn.",
    name: "Lê Thành Đạt",
    position: "Founder Rau Má Mix",
  },
  {
    image: "https://siteplus.vn/wp-content/uploads/2023/10/mtb-258x258.jpg",
    content:
      "Site Plus thật sự đã mang đến cho tôi một danh sách điểm bán tiềm năng. Team Site Plus rất nhiệt tình, hỗ trợ hết mình, giúp tôi khá thành công trong việc mở điểm bán phù hợp với định hướng và tệp khách hàng của mình.",
    name: "Lê Đại Dương",
    position: "CEO Mỹ Thuật Bụi",
  },
  {
    image:
      "https://siteplus.vn/wp-content/uploads/2023/10/Nguyen-Minh-Tri_Founder-Hamster-Kingdom-1-258x258.jpg",
    content:
      "Tôi rất bất ngờ về cách mà Site Plus tư vấn chiến lược mặt bằng cho doanh nghiệp của mình. Những kinh nghiệm và kỹ năng đàm phán mặt bằng của Site Plus giúp tôi tiết kiệm được khoản chi phí khá lớn .",
    name: "Nguyễn Minh Trí",
    position: "Founder Hamter Kingdom",
  },
];

export function TestimonialCarousel() {
  return (
    <div className="w-full bg-[#fdf4ea] py-12">
      <div className="container mx-auto px-4">
        <Heading text="Khách Hàng Nói Gì Về Site Plus ?" />
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <Card className="border-none ">
                  <CardContent className="flex flex-col items-center p-6">
                    <div className="relative">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-6">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <blockquote className="text-lg md:text-xl text-[#020403] text-center mb-6 max-w-2xl mx-auto leading-relaxed">
                      {testimonial.content}
                    </blockquote>

                    <div className="text-center">
                      <h3 className="text-xl md:text-2xl font-medium text-[#020403] mb-2">
                        {testimonial.name}
                      </h3>
                      <p className="text-base md:text-lg text-[#020403] opacity-80">
                        {testimonial.position}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:block">
            <CarouselPrevious className="left-2 lg:-left-12 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-2 lg:-right-12 bg-white/80 hover:bg-white" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default TestimonialCarousel;
