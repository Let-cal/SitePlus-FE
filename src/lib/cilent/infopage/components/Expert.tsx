import * as React from "react";
import pithai from '../../../../assets/pithai.jpg';
import shine30 from '../../../../assets/30shine.png';
import hamster from '../../../../assets/hamster.png';
import mia from '../../../../assets/mia.png';
import ministop from '../../../../assets/ministop.jpg';
import raumamix from '../../../../assets/raumamix.png';
import thaimarket from '../../../../assets/thaimarket.jpg';
import ybspa from '../../../../assets/ybspa.jpg';

const Expert = () => {
    const images = [
        pithai,
        shine30,
        hamster,
        ministop,
        mia,
        raumamix,
        thaimarket,
        ybspa
    ];

    return (
        <div className="bg-white px-4 md:px-[10%] py-8">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                {/* Left content section */}
                <div className="w-full lg:w-2/5">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl text-theme-orange-500 mb-12">Đội Ngũ Chuyên Gia</h1>
                    <div className="space-y-8 text-lg md:text-xl text-[#020403] mb-6 text-justify">
                        <p>
                            Trong thời gian gần, Site Plus đã phụ trách phát triển
                            chuỗi cửa hàng cho các công ty đa quốc gia và cố vấn
                            chiến lược cho các doanh nghiệp Việt Nam trong lĩnh
                            vực Bán lẻ và F&B : Ministop, Mia, 30Shine, Thai
                            Market, Pi Thai, Rau Má Mix, Hamster Kingdom, YB Spa,...
                        </p>
                        <p>
                            Đội ngũ cố vấn và thực thi của chúng tôi đều là những
                            quản lý, chủ doanh nghiệp đã từng mở cửa hàng, điều
                            hành doanh nghiệp nên rất thấu hiểu các khó khăn
                            của khách hàng. Chúng tôi đã mang lại những kết quả
                            khi tư vấn và triển khai phát triển cho các doanh
                            nghiệp ngành bán lẻ và F&B tại Việt Nam và Nước
                            ngoài.
                        </p>
                        <p>
                            Site Plus luôn nỗ lực không ngừng để mang tới
                            những dịch vụ tốt, đa dạng hơn cho các chủ doanh
                            nghiệp còn lo lắng về vấn đề mặt bằng khi kinh doanh.
                            Với kinh nghiệm nhiều năm trong ngành, chúng tôi hiểu rõ
                            những thách thức mà các doanh nghiệp phải đối mặt.
                        </p>
                        <p>
                            Với sự kết hợp giữa kinh nghiệm thực tiễn và kiến thức
                            chuyên sâu, chúng tôi cam kết mang đến những giải pháp
                            tối ưu nhất cho doanh nghiệp của bạn.
                        </p>
                    </div>
                </div>

                {/* Right image grid section */}
                <div className="w-full lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-4 lg:mt-24">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`
                                rounded-lg overflow-hidden shadow-lg
                                ${index === 3 ? 'md:col-span-2' : ''}
                            `}
                        >
                            <img
                                src={src}
                                alt={`Expert ${index + 1}`}
                                className="w-full h-48 object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Expert;