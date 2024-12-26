import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import * as React from "react";
import Heading from "../../all-site/Heading";
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const CaseStudyCard = ({ title, content, images, labels }) => (
  <Card className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
    <CardContent className="p-6 md:p-8">
      <motion.h3
        className="text-2xl md:text-3xl font-bold text-[#020403] mb-6"
        {...fadeIn}
      >
        {title}
      </motion.h3>

      <motion.div
        className="prose text-[#020403] text-lg leading-relaxed mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {content}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.2 }}
          >
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src={image}
                alt={labels[index]}
                className="w-full h-[300px] object-cover transform  transition-all duration-500 hover:scale-105"
              />
            </div>
            <p className="text-center mt-3 text-sm font-medium text-[#020403]/80">
              {labels[index]}
            </p>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const CaseStudyCard2 = ({ title, content, images, labels }) => (
  <Card className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
    <CardContent className="p-6 md:p-8">
      <motion.h3
        className="text-2xl md:text-3xl font-bold text-[#020403] mb-6"
        {...fadeIn}
      >
        {title}
      </motion.h3>

      <motion.div
        className="prose text-[#020403] text-lg leading-relaxed mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {content}
      </motion.div>

      <div className="grid md:grid-rows-1 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.2 }}
          >
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src={image}
                alt={labels[index]}
                className="w-full lg:h-[600px] object-cover transform transition-all duration-500 hover:scale-105"
              />
            </div>
            <p className="text-center mt-3 text-sm font-medium text-[#020403]/80">
              {labels[index]}
            </p>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function ModernCaseStudy() {
  return (
    <ScrollArea className="w-full h-full bg-[#fdf4ea]">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Heading text="Case Study" />
          <Separator className="mx-auto w-24 bg-[#020403]/20 my-4" />
        </motion.div>

        <div className="space-y-16">
          {/* Rau Má Mix Case Study */}
          <CaseStudyCard
            title="Nhận diện cửa hàng - Rau Má Mix"
            content={
              <div className="space-y-4">
                <p>
                  Rau Má Mix là một trong những chuỗi cửa hàng nổi tiếng trong
                  ngành FnB, sở hữu hơn 70 gian hàng tại Thành phố Hồ Chí Minh
                  và Bình Dương.
                </p>
                <p>
                  Nhiều cửa hàng của chuỗi Rau Má Mix có bảng vẫy nhưng khách
                  hàng lại không nhận diện được từ xa. Bên cạnh đó, nội dung và
                  vị trí đặt bảng vẫy chưa tối ưu. Và mong muốn của Rau Má Mix
                  khi tin tưởng Site Plus là 100% cửa hàng phải được nhận diện
                  từ khoảng cách 50m cả chiều thuận và nghịch.
                </p>
                <p>
                  Sau khi hợp tác, Site Plus tiến hành phân tích và thực thi tối
                  ưu bảng vẫy cho Rau Má Mix, doanh số cửa hàng đã tăng 10%. Đây
                  là số liệu minh chứng cho năng lực của đội ngũ Site Plus.
                </p>
              </div>
            }
            images={[
              "/images/client/homepage/rauma-before.png",
              "/images/client/homepage/rauma-after.png",
            ]}
            labels={["TRƯỚC KHI THAY ĐỔI", "SAU KHI THAY ĐỔI"]}
          />

          {/* Fight100 Case Study */}
          <CaseStudyCard2
            title="Chuyển điểm - Fight100"
            content={
              <div className="space-y-4">
                <p>
                  Fingt100 là phòng tập Kick-Boxing Đốt Mỡ nổi tiếng tại Sài
                  Gòn.
                </p>
                <p>
                  Trước đây, giá thuê mặt bằng của Figh100 cao so với tình hình
                  doanh thu. Vận hành phức tạp, không có chỗ đậu ô tô, thang máy
                  chật hẹp. Bên cạnh đó, Figh100 không có khách vãng lai đủ ở 2
                  mặt tiền khu vực đẹp nhất và doanh nghiệp phát triển thêm sản
                  phẩm mới, mặt bàng cũ không phù hợp.
                </p>
                <p>
                  Mong muốn của Figh100 là chuyển điểm bán doanh thu x2 nhưng
                  đảm bảo được tiêu chí không mất khách cũ, thêm khách vãng lai
                  và giá thuê không quá 65 triệu/tháng.
                </p>
                <p>
                  Sau khi hợp tác cùng Site Plus, tổng kết dự án, Figh100 tiết
                  kiệm được tổng 950 triệu đồng bao gồm tiền thuê, tiền đặt cọc
                  và thời gian sửa nhà.
                </p>
              </div>
            }
            images={["/images/client/homepage/fight-image.png"]}
            labels={["KẾT QUẢ SAU KHI HỢP TÁC"]}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
