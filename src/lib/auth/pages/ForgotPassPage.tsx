import * as React from "react";
import { Footer } from "../../all-site/Footer";
import { Header } from "../../all-site/Header";
import ForgotForm from "../components/ForgotForm";

export default function ForgotPassPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid gap-12 items-center">
          {/* Hình ảnh */}

          {/* Form đăng nhập */}
          <div className="flex justify-center items-center">
            <ForgotForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
