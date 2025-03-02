import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Award,
  Briefcase,
  ChevronRight,
  FileText,
  History,
  MessageSquare,
} from "lucide-react";
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
      className="group cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex flex-row justify-between space-x-4">
          <div> {children}</div>
          <ChevronRight className="w-10 h-4 mt-2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
        </div>
      </div>
    </NavigationMenuLink>
  );
};

const NavSection = ({ title, children, icon: Icon }) => (
  <div className="space-y-1">
    <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5" />}
      {title}
    </h4>
    {children}
  </div>
);

const HomePageNav = () => {
  return (
    <NavigationMenu className="relative z-10">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Trang Chủ</NavigationMenuTrigger>
          <NavigationMenuContent className="absolute mt-2 bg-white border border-gray-200 shadow-lg rounded-lg w-[350px] md:w-[450px] lg:w-[500px]">
            <div className="grid grid-cols-2 gap-4 p-4">
              <NavSection title="Giới Thiệu" icon={History}>
                <ScrollToComponent targetId="main-content">
                  <div className="text-sm font-medium text-gray-600">
                    Nội Dung Chính
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tìm hiểu về lịch sử, tầm nhìn, và sứ mệnh của Site Plus. Đây
                    là những giá trị cốt lõi của chúng tôi.
                  </p>
                </ScrollToComponent>
              </NavSection>

              <NavSection title="Dịch Vụ" icon={Briefcase}>
                <ScrollToComponent targetId="service-content">
                  <div className="text-sm font-medium text-gray-600">
                    Các Dịch Vụ
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Chúng tôi cung cấp các dịch vụ phân tích, tư vấn và lập
                    chiến lược mở điểm bán tiềm năng.
                  </p>
                </ScrollToComponent>
              </NavSection>

              <NavSection title="Dự Án" icon={FileText}>
                <ScrollToComponent targetId="project-carousel">
                  <div className="text-sm font-medium text-gray-600">
                    Dự Án Tiêu Biểu
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Khám phá những dự án nổi bật mà Site Plus đã triển khai
                    thành công.
                  </p>
                </ScrollToComponent>
              </NavSection>

              <NavSection title="Năng Lực" icon={Award}>
                <ScrollToComponent targetId="qualification-content">
                  <div className="text-sm font-medium text-gray-600">
                    Năng Lực Chuyên Môn
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Đội ngũ chuyên gia giàu kinh nghiệm và những chứng chỉ uy
                    tín trong ngành.
                  </p>
                </ScrollToComponent>
              </NavSection>

              <NavSection title="Đánh Giá" icon={MessageSquare}>
                <ScrollToComponent targetId="testimonial-carousel">
                  <div className="text-sm font-medium text-gray-600">
                    Phản Hồi Khách Hàng
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Những đánh giá tích cực từ khách hàng về chất lượng dịch vụ
                    của chúng tôi.
                  </p>
                </ScrollToComponent>
              </NavSection>

              <NavSection title="Case Study" icon={FileText}>
                <ScrollToComponent targetId="case-study">
                  <div className="text-sm font-medium text-gray-600">
                    Case Study Mới Nhất
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Nghiên cứu về những chiến lược thành công mà chúng tôi đã áp
                    dụng.
                  </p>
                </ScrollToComponent>
              </NavSection>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default HomePageNav;
