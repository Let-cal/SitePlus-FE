import { ArrowRight } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router-dom"; // Thêm nếu dùng React Router

interface QualificationItem {
  number: string;
  title: string;
  description: string;
}

interface QualificationHero {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  backgroundImage?: string;
}

interface QualificationHighlight {
  number: string;
  title: string;
  description: string;
  backgroundColor?: string;
  textColor?: string;
}

interface QualificationContentProps {
  hero: QualificationHero;
  qualificationItems: QualificationItem[];
  highlight: QualificationHighlight;
}

const QualificationBox = ({
  number,
  title,
  description,
}: QualificationItem) => (
  <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
    <span className="text-4xl font-bold text-gray-900">{number}</span>
    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
      {title}
    </h3>
    <p className="text-base text-gray-700 leading-relaxed">{description}</p>
    <button className="flex items-center gap-2 text-gray-900 hover:text-orange-500 transition-colors duration-300 group w-fit">
      <span className="font-medium">Xem thêm</span>
      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  </div>
);

export default function QualificationProbs({
  hero,
  qualificationItems,
  highlight,
}: QualificationContentProps) {
  const navigate = useNavigate(); // Sử dụng useNavigate nếu dùng React Router

  const handleButtonClick = () => {
    if (hero.onButtonClick) {
      hero.onButtonClick();
    } else {
      navigate("/info-page"); 
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-12 items-start">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="space-y-6 max-w-xl">
            <h1 className=" md:text-5xl scroll-m-20 text-3xl font-extrabold tracking-tight text-theme-orange-500 leading-tight">
              {hero.title}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {hero.description}
            </p>
            <button
              onClick={handleButtonClick}
              className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg 
                       hover:bg-orange-600 transition-colors duration-300 
                       transform hover:scale-105 active:scale-95"
            >
              {hero.buttonText}
            </button>
          </div>
          {hero.backgroundImage && (
            <div
              className="h-64 md:h-96 rounded-2xl bg-cover bg-center xs:hidden"
              style={{ backgroundImage: `url(${hero.backgroundImage})` }}
            />
          )}
        </div>

        {/* Qualification Grid */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qualificationItems.slice(0, 2).map((item, index) => (
              <QualificationBox key={index} {...item} />
            ))}
          </div>

          {/* Highlight Section */}
          <div
            className="p-8 rounded-2xl text-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:bg-opacity-90"
            style={{
              backgroundColor: highlight.backgroundColor || "#FF7426",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <span className="text-4xl font-bold">{highlight.number}</span>
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-wide text-center md:text-left">
                  {highlight.title}
                </h3>
                <p className="text-base leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qualificationItems.slice(2).map((item, index) => (
              <QualificationBox key={index + 2} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}