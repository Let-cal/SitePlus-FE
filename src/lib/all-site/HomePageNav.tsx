import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import * as React from "react";

const ScrollToComponent = ({ children, targetId }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <NavigationMenuLink
      className="cursor-pointer block select-none rounded-md p-3 leading-none no-underline outline-none transition-transform hover:scale-105 hover:shadow-md focus:shadow-md"
      onClick={handleClick}
    >
      {children}
    </NavigationMenuLink>
  );
};

const HomePageNav = () => {
  return (
    <NavigationMenu className="relative z-10">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Trang Chủ</NavigationMenuTrigger>
          <NavigationMenuContent className="absolute mt-2 bg-white border border-gray-200 shadow-lg rounded-lg w-[350px] md:w-[450px] lg:w-[500px]">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-800">
                  Giới Thiệu
                </h4>
                <ScrollToComponent targetId="main-content">
                  <div className="text-sm font-medium text-gray-600 ">
                    Nội Dung Chính
                  </div>
                  <p className="text-xs text-gray-500">
                    Tìm hiểu về lịch sử, tầm nhìn, và sứ mệnh của Site Plus. Đây
                    là những giá trị cốt lõi của chúng tôi.
                  </p>
                </ScrollToComponent>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-800">Dịch Vụ</h4>
                <ScrollToComponent targetId="service-content">
                  <div className="text-sm font-medium text-gray-600">
                    Các Dịch Vụ
                  </div>
                  <p className="text-xs text-gray-500">
                    Chúng tôi cung cấp các dịch vụ phân tích, tư vấn và lập
                    chiến lược mở điểm bán tiềm năng.
                  </p>
                </ScrollToComponent>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-800">Dự Án</h4>
                <ScrollToComponent targetId="project-carousel">
                  <div className="text-sm font-medium text-gray-600">
                    Dự Án Tiêu Biểu
                  </div>
                  <p className="text-xs text-gray-500">
                    Khám phá những dự án nổi bật mà Site Plus đã triển khai
                    thành công.
                  </p>
                </ScrollToComponent>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-800">Năng Lực</h4>
                <ScrollToComponent targetId="qualification-content">
                  <div className="text-sm font-medium text-gray-600">
                    Năng Lực Chuyên Môn
                  </div>
                  <p className="text-xs text-gray-500">
                    Đội ngũ chuyên gia giàu kinh nghiệm và những chứng chỉ uy
                    tín trong ngành.
                  </p>
                </ScrollToComponent>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-800">Đánh Giá</h4>
                <ScrollToComponent targetId="testimonial-carousel">
                  <div className="text-sm font-medium text-gray-600">
                    Phản Hồi Khách Hàng
                  </div>
                  <p className="text-xs text-gray-500">
                    Những đánh giá tích cực từ khách hàng về chất lượng dịch vụ
                    của chúng tôi.
                  </p>
                </ScrollToComponent>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-800">
                  Case Study
                </h4>
                <ScrollToComponent targetId="case-study">
                  <div className="text-sm font-medium text-gray-600">
                    Case Study Mới Nhất
                  </div>
                  <p className="text-xs text-gray-500">
                    Nghiên cứu về những chiến lược thành công mà chúng tôi đã áp
                    dụng.
                  </p>
                </ScrollToComponent>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default HomePageNav;
