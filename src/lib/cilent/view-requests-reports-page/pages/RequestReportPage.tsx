import { Footer } from "@/lib/all-site/Footer";
import { Header } from "@/lib/all-site/Header";
import * as React from "react";
import RequestReportTable from "../components/RequestReportTable";
import ThankYouHeader from "../components/ThankYouHeader";

export default function RequestReportPage() {
  return (
    <div className="min-h-screen w-full flex flex-col space-y-4">
      <Header />
      <div className="px-4 lg:px-[124px]">
        <ThankYouHeader />
      </div>
      <div className="flex-1 w-full px-4 lg:px-[124px] py-8">
        <div className="mx-auto w-full">
          <RequestReportTable />
        </div>
      </div>
      <Footer />
    </div>
  );
}
