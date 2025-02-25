import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Heading from "@/lib/all-site/Heading";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

const ThankYouHeader = () => {
  const [isOpen, setIsOpen] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true);
      setIsOpen(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[40px]">
      {/* Card Container */}
      <div
        className={`transition-all duration-700 ease-in-out overflow-hidden
          ${!isOpen ? "max-h-0" : "max-h-[500px]"}`}
      >
        <Card className="bg-gradient-to-r from-orange-600 via-orange-400 to-orange-200 shadow-lg rounded-lg border-none mb-6">
          <CardHeader>
            <Heading
              text="Cảm Ơn Bạn Đã Đồng Hành Cùng Chúng Tôi"
              setColor="text-theme-primary-light"
              size="sm"
              hasMargin={false}
            />
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="font-playwrite space-y-4">
              <p className="text-xl text-gray-800 leading-relaxed hover:text-gray-900 transition-all transform duration-300 hover:scale-105">
                "Một lời cảm ơn xin trao gửi,
              </p>
              <p className="text-xl text-gray-800 leading-relaxed hover:text-gray-900 transition-all transform duration-300 hover:scale-105">
                Tấm lòng tri ân thấm lòng người.
              </p>
              <p className="text-xl text-gray-800 leading-relaxed hover:text-gray-900 transition-all transform duration-300 hover:scale-105">
                Khách hàng như bạn là niềm tự hào,
              </p>
              <p className="text-xl text-gray-800 leading-relaxed hover:text-gray-900 transition-all transform duration-300 hover:scale-105">
                Đồng hành cùng bạn vượt gian lao."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toggle Button - Now Always Visible */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex flex-col items-center"
        >
          <div className="bg-orange-400 hover:bg-orange-500 transition-colors p-2 rounded-full shadow-lg">
            {isOpen ? (
              <ChevronUp className="w-6 h-6 text-white" />
            ) : (
              <ChevronDown className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="absolute w-1 h-8 bg-orange-400 top-full"></div>
          <div className="absolute w-3 h-3 bg-orange-400 rotate-45 top-[calc(100%+28px)]"></div>
        </button>
      </div>
    </div>
  );
};

export default ThankYouHeader;
