import * as React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Phone, MapPin, Mail } from 'lucide-react';

const ContactPage = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-[10%] bg-gray-50 py-8">
        {/* First section content remains the same */}
        <div className="lg:w-1/3 flex flex-col justify-between lg:h-full mb-12 lg:mb-0 text-center lg:text-left">
          <div>
            <p className="text-sm font-bold text-gray-600 uppercase mb-2">LIÊN HỆ CHÚNG TÔI</p>
            <h1 className="text-4xl font-bold text-gray-800 my-8">Hãy liên hệ ngay hôm nay!</h1>
            <p className="text-gray-600 mb-6">
              Chúng tôi am hiểu chiến lược tổng thể và tỉ mỉ trong từng chi tiết để chọn mặt bằng tối ưu.
            </p>
            <div className="space-y-4">
              <div className="text-gray-700">
                <span className="font-bold text-gray-600 ">Hotline: </span>
                <span className="text-blue-500">0915057079</span>
              </div>
              <div className="text-gray-700">
                <span className="font-bold text-gray-600 ">Email: </span>
                <span className="text-blue-500 hover:underline">
                  <a href="mailto:minh@siteplus.vn">minh@siteplus.vn</a>
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6 justify-center lg:justify-start">
            <a href="#" className="text-blue-400 hover:text-blue-600">
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/minhphan155189"
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-pink-500 hover:text-pink-700">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-900">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="lg:w-5/12">
          <img
            src="https://siteplus.vn/wp-content/uploads/2024/06/khoa-hoc.jpg"
            alt="Team partners"
            className="w-full object-cover rounded-lg shadow-lg max-h-[400px]"
          />
        </div>
      </div>

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 my-16">
        <p className="uppercase text-sm font-bold tracking-wide mb-4">MỜI BẠN GHÉ THĂM VĂN PHÒNG</p>

        <h2 className="text-4xl font-bold text-gray-900 mb-16">
          Hỗ trợ doanh nghiệp nhỏ<br />hiện thực ý tưởng lớn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-20">
          <div className="flex flex-col items-center h-full text-black py-8 px-4 rounded-lg">
            <div className="h-24 flex items-center justify-center">
              <Phone className="w-12 h-12 text-orange-500" />
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <p className="mb-2">0915057079</p>
                <p className="mb-4">0826521234</p>
              </div>
              <button className="font-semibold">Nhận hỗ trợ</button>
            </div>
          </div>

          <div className="flex flex-col items-center h-full bg-gray-900 text-white py-8 px-4 rounded-lg">
            <div className="h-24 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-orange-500" />
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <p className="mb-2">Tầng 2 - 13 Quách Văn Tuấn, Phường 12, Tân Bình, Hồ Chí Minh</p>
              </div>
              <button className="font-semibold">Nhận hỗ trợ</button>
            </div>
          </div>

          <div className="flex flex-col items-center h-full text-black py-8 px-4 rounded-lg">
            <div className="h-24 flex items-center justify-center">
              <Mail className="w-12 h-12 text-orange-500" />
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <span className="hover:underline cursor-pointer">
                  <a href="mailto:minh@siteplus.vn">minh@siteplus.vn</a>
                </span>
                <br />
                <span className="hover:underline cursor-pointer">
                  <a href="mailto:sangtran.dna@gmail.com">sangtran.dna@gmail.com</a>
                </span>
              </div>
              <button className="font-semibold">Nhận hỗ trợ</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="uppercase font-bold text-xs text-gray-700 tracking-wide mb-4">Rất mong được gặp bạn!</p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Cùng trao đổi!</h2>
          <button
            className="bg-orange-500 text-white px-8 py-3 rounded-md uppercase hover:bg-orange-600"
            onClick={() => {
              window.location.href = "/survey-requests-page";
            }}
          >
            Liên hệ ngay
          </button>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
