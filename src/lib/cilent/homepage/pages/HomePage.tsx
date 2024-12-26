import * as React from "react";
import { Divider } from "../../all-site/divider";
import { Footer } from "../../all-site/Footer";
import { Header } from "../../all-site/Header";
import MainContent from "../../homepage/components/MainConent";
import ContactComponent from "../components/ContactComponent";
import ModernCaseStudy from "../components/ModernCaseStudy";
import { CarouselList } from "../components/project-components/ProjectCarsousel";
import QualificationContent from "../components/qualification-components/QualificationContent";
import ServiceContent from "../components/service-components/ServiceContent";
import TestimonialCarousel from "../components/TestimonialCarousel";
export default function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col space-y-4  overflow-y: auto h-full ">
      <Header />
      <div className="flex flex-col lg:px-[124px]  h-auto w-full gap-[26px]">
        <MainContent />
        <div className="flex flex-row gap-5 items-center">
          <Divider />
          <p className=" w-[60%] text-gray-500 xs:w-full ">
            “Chọn sai mặt bằng là mất cả gia tài”
          </p>
          <Divider />
        </div>

        <ServiceContent />
        <Divider />
        <h1 className="flex justify-center scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl text-theme-orange-500">
          Các Dự Án Site Plus tham gia
        </h1>
        <CarouselList />
        <Divider />
        <QualificationContent />
      </div>
      <div className="px-[124px]">
        {" "}
        <Divider />
      </div>
      <TestimonialCarousel />
      <div className="px-[124px]">
        {" "}
        <Divider />
      </div>
      <ModernCaseStudy />
      <ContactComponent />
      <Footer />
    </div>
  );
}
