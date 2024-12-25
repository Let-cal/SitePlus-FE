import { Button } from "@/components/ui/button";
import * as React from "react";

import BackgroundMain from "/images/client/homepage/imageMainContent.png";
export default function MainContent() {
  return (
    <div>
      <div className="flex flex-col py-[164px] gap-4">
        {" "}
        <div className="flex flex-row justify-between  gap-[89px]">
          {/* text */}
          <div className="flex flex-col gap-[47px] w-[60%]">
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
          </div>
          {/* image */}
          <div className="relative lg:h-[300px] lg:w-[40%] hidden md:block overflow-hidden rounded-lg ">
            <img
              src={BackgroundMain}
              alt="SitePlus Logo"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="flex justify-center">
          {/* {" buttons"} */}
          <Button
            type="submit"
            className="w-[20%]  items-center bg-orange-500 hover:bg-orange-600 text-white"
          >
            LIÊN HỆ NGAY
          </Button>
        </div>
      </div>
     
    </div>
  );
}
