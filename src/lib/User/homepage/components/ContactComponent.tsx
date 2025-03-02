import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CustomButton from "@/lib/all-site/Button";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import * as React from "react";
import Heading from "../../../all-site/Heading";
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function ModernContactForm() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Image Section */}
        <motion.div
          className="relative hidden md:block h-[600px] overflow-hidden rounded-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          <img
            src="/images/client/homepage/ly-do-dong-hanh-cung-siteplus.jpg"
            alt="SitePlus Background"
            className="object-cover w-full h-full transform transition-transform duration-700 hover:scale-105"
          />
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-7 h-full shadow-lg bg-white/90 backdrop-blur-sm ">
            <CardContent>
              <motion.div
                className="space-y-9"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                <div className="text-center space-y-4">
                  <motion.div>
                    <Heading text="Liên Hệ Ngay" />
                  </motion.div>
                  <motion.p
                    className="text-lg text-gray-600 leading-relaxed"
                    {...fadeInUp}
                  >
                    Nếu bạn có bất kỳ câu hỏi nào hay cần được hỗ trợ, hãy để
                    lại thông tin và lời nhắn, đội ngũ Site Plus sẽ liên hệ lại
                    ngay!
                  </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div {...fadeInUp}>
                    <Input
                      placeholder="Họ và tên"
                      className="bg-white/50 border-gray-300 focus:border-orange-400 transition-colors"
                    />
                  </motion.div>
                  <motion.div {...fadeInUp}>
                    <Input
                      placeholder="Email"
                      type="email"
                      className="bg-white/50 border-gray-300 focus:border-orange-400 transition-colors"
                    />
                  </motion.div>
                  <motion.div {...fadeInUp}>
                    <Input
                      placeholder="Số điện thoại"
                      type="tel"
                      className="bg-white/50 border-gray-300 focus:border-orange-400 transition-colors"
                    />
                  </motion.div>
                  <motion.div {...fadeInUp}>
                    <Input
                      placeholder="Website"
                      className="bg-white/50 border-gray-300 focus:border-orange-400 transition-colors"
                    />
                  </motion.div>
                </div>

                <motion.div {...fadeInUp}>
                  <Textarea
                    placeholder="Nội dung"
                    className="min-h-[120px] bg-white/50 border-gray-300 focus:border-orange-400 transition-colors"
                  />
                </motion.div>

                <motion.div {...fadeInUp} className="flex justify-center">
                  <CustomButton
                    type="submit"
                    width="40"
                    color="orange"
                    icon={<Send className="w-5 h-5" />}
                  >
                    GỬI TIN NHẮN
                  </CustomButton>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
