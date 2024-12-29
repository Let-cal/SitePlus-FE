import * as React from "react";
import { Lock, LayoutGrid, Wallet, Flag } from "lucide-react";
import Heading from "../../all-site/Heading";

const Benefit = () => {
  const benefits = [
    {
      icon: <Lock className="w-12 h-12" style={{ color: '#ff7426' }} />,
      title: "KINH NGHIỆM ĐA DẠNG",
      description: "Với đội ngũ chuyên gia nhiều năm kinh nghiệm thực chiến, tư vấn và phát triển mặt bằng cho khách hàng trong nhiều lĩnh vực.",
    },
    {
      icon: <LayoutGrid className="w-12 h-12" style={{ color: '#ff7426' }} />,
      title: "QUY TRÌNH CHUYÊN NGHIỆP",
      description: "Site Plus cung cấp một quy trình làm việc rõ ràng, chi tiết và đơn giản hóa. Giúp khách hàng dễ dàng theo dõi tiến độ công việc.",
    },
    {
      icon: <Wallet className="w-12 h-12" style={{ color: '#ff7426' }} />,
      title: "THÔNG TIN CHÍNH XÁC",
      description: "Với kinh nghiệm thị trường, và nguồn thông tin từ các đối tác mới giới uy tín, Site Plus giúp khách hàng tiết kiệm rất nhiều thời gian sàng lọc thông tin và đưa ra đề xuất lựa chọn mặt bằng nhanh chóng.",
    },
    {
      icon: <Flag className="w-12 h-12" style={{ color: '#ff7426' }} />,
      title: "HẠN CHẾ RỦI RO",
      description: "Với kinh nghiệm đàm phán với hàng ngàn chủ nhà, Site Plus luôn tư vấn các rủi ro phát sinh, điều khoản cần có đảm bảo lợi ích cho khách hàng trong hợp đồng.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <Heading text="Lợi ích đồng hành cùng Site Plus" />
        
        <p className="text-center text-xl text-gray-600 mb-12">
          Đơn vị tiên phong trong lĩnh vực tư vấn phát triển điểm bán tại Việt Nam.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex flex-col items-start text-left p-6 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {benefit.title}
              </h3>
              <p className="text-lg md:text-xl text-[#020403] mb-6 text-justify">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefit;
