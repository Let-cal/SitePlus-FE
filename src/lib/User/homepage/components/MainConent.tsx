import { Button } from "@/components/ui/button";
import * as React from "react";

import BackgroundMain from "/images/client/homepage/imageMainContent.png";
interface MainContentProps {
  className?: string;
}
export default function MainContent({ className }: MainContentProps) {
  return (
    <div id="main-content" className={className}>
      <div className="flex flex-col py-[164px] gap-4 ">
        {" "}
        <div className="grid lg:grid-cols-2 justify-between  gap-[89px]">
          {/* text */}
          <div className="flex flex-col space-y-9 md:w-full sm:w-full xs:w-full xs:p-6">
            <h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
              SITE PLUS
            </h3>
            <div className="text-theme-orange-500">
              <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                Tư Vấn Chiến Lược
              </h1>
              <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                Điểm Bán
              </h1>
            </div>
            <h3 className="scroll-m-20 text-3xl font-bold tracking-tight">
              Đơn vị tiên phong trong lĩnh vực tư vấn phát triển điểm bán tại
              Việt Nam.
            </h3>
            <div className="flex ">
              {/* {" buttons"} */}
              <Button
                type="submit"
                className="lg:w-[40%]  items-center bg-orange-500 hover:bg-orange-600 text-white"
              >
                LIÊN HỆ NGAY
              </Button>
            </div>
          </div>
          {/* image */}
          <div className="relative lg:h-[400px] lg:block hidden md:block overflow-hidden rounded-lg ">
            <img
              src={BackgroundMain}
              alt="SitePlus Logo"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
