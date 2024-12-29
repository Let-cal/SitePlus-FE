import { MailIcon, PhoneIcon } from "lucide-react";
import * as React from "react";
import logo from "/images/logo-site-plus/logo.png";
export function Footer() {
  return (
    <footer className="bg-orange-500 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div>
            <img
              src={logo}
              alt="SitePlus Logo"
              width={160}
              height={60}
              className="h-15 w-auto"
            />
          </div>

          {/* Services Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">DỊCH VỤ</h3>
            <ul className="space-y-2">
              <li>
                <a href="/trang-chu" className="hover:text-gray-300">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/giai-phap" className="hover:text-gray-300">
                  Giải pháp
                </a>
              </li>
              <li>
                <a href="/tu-van" className="hover:text-gray-300">
                  Tư vấn triển khai
                </a>
              </li>
              <li>
                <a href="/thuc-thi" className="hover:text-gray-300">
                  Thực thi
                </a>
              </li>
              <li>
                <a href="/dao-tao" className="hover:text-gray-300">
                  Đào tạo
                </a>
              </li>
              <li>
                <a href="/thu-vien" className="hover:text-gray-300">
                  Thư viện
                </a>
              </li>
              <li>
                <a href="/lien-he" className="hover:text-gray-300">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* About Us Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">VỀ CHÚNG TÔI</h3>
            <ul className="space-y-2">
              <li>
                <a href="/gioi-thieu" className="hover:text-gray-300">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/doi-ngu" className="hover:text-gray-300">
                  Đội ngũ
                </a>
              </li>
              <li>
                <a href="/case-study" className="hover:text-gray-300">
                  Case Study
                </a>
              </li>
              <li>
                <a href="/du-an" className="hover:text-gray-300">
                  Dự án thực hiện
                </a>
              </li>
              <li>
                <a href="/tuyen-dung" className="hover:text-gray-300">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="/ho-tro" className="hover:text-gray-300">
                  Hỗ trợ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">DỊCH VỤ</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5" />
                <span>Contact support</span>
              </div>
              <div className="flex items-center space-x-2">
                <MailIcon className="h-5 w-5" />
                <span>Email support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
