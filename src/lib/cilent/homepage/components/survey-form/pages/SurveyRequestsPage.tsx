// SurveyRequestsPage.jsx
import { Footer } from "@/lib/all-site/Footer";
import { Header } from "@/lib/all-site/Header";
import * as React from "react";
import SurveyLayout from "../components/SurveyLayout";
import YourSpaceSurveyForm from "../components/YourSpaceSurveyForm";

export default function SurveyRequestsPage() {
  return (
    <SurveyLayout>
      <div className="min-h-screen w-full flex flex-col space-y-4">
        <Header />
        <div className="flex-1 w-full px-4 lg:px-[124px] py-8">
          <div className="max-w-4xl mx-auto w-full">
            <YourSpaceSurveyForm />
          </div>
        </div>
        <Footer />
      </div>
    </SurveyLayout>
  );
}
