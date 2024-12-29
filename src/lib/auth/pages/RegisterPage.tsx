import * as React from "react";
import { Footer } from "../../all-site/Footer";
import { Header } from "../../all-site/Header";
import RegisterForm from "../components/RegisterForm";
import BackgroundLogin from "/images/client/login/imageWork.jpg";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hình ảnh */}
          <div className="relative lg:h-full hidden md:block overflow-hidden rounded-lg shadow-lg">
            <img
              src={BackgroundLogin}
              alt="SitePlus Logo"
              className="object-cover w-full h-full transform transition duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>{" "}
            {/* Màu phủ mờ */}
          </div>

          {/* Form đăng nhập */}
          <div className="flex justify-center items-center">
            <RegisterForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
