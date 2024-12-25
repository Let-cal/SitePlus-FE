import * as React from "react";
import { Divider } from "../../all-site/divider";
import { Footer } from "../../all-site/Footer";
import { Header } from "../../all-site/Header";
import MainContent from "../../homepage/components/MainConent";
import { CarouselList } from "../components/ProjectCarsousel";
import QualificationContent from "../components/QualificationContent";
import ServiceContent from "../components/ServiceContent";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col space-y-4">
      <Header />
      <div className="flex flex-col px-[124px] h-auto w-full gap-[26px]">
        <MainContent />
        <div className="flex flex-row gap-5 items-center">
          <Divider />
          <p className=" w-[60%] text-gray-500">
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
      <Footer />
    </div>
  );
}
