import * as React from "react";
import Heading from "../../all-site/Heading";
import Content from "../../all-site/Content";

const Ability: React.FC = () => {
    const headingText = "NĂNG LỰC SITE PLUS";
    const founderText = "Người Sáng Lập";
    const contentText1 = `
      Chuyên gia Minh Phan
      Co-Founder & CEO Site Plus
      Tác giả "Đến Sahara mở quán trà đá"
      Cuốn sách về bí quyết tìm kiếm mặt bằng kinh doanh đầu tiên tại Việt Nam.
      "Chọn sai mặt bằng là mất một căn nhà".
    `;
    const contentText2 = `
      • Hơn 10 năm làm việc tại các hệ thống cửa hàng tiện lợi như Ministop, Family Mart, Circle K, cùng với tư vấn cho các chuỗi Bán lẻ và F&B tại Việt Nam. Minh nhận thấy thiệt hại khi đóng cửa những điểm bán kém hiệu quả là một trong những chi phí lớn nhất của đa số các doanh nghiệp.
      
      • Chúng ta bỏ ra rất nhiều tiền để đầu tư cho từng cửa hàng, nhưng lại bỏ qua ít thời gian để nghiên cứu chiến lược và tìm công thức mở điểm bán cho đúng. Do đó, sứ mệnh của Minh và Site Plus chính là giúp doanh nghiệp tiết kiệm và tối ưu ngay từ khi chưa mở điểm bán.
    `;
    const imageUrl1 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkI1wSbu0DwfaMDV5Hc4d4R4AeJm4TuunhNhVPTXYjazhkXRKHL0w1JnUQIY2YgXiZQMA&usqp=CAU";
    const imageUrl2 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKxhBRO6wetr4KhyqKd8UCg6duIAvyZ9ca3g&s";
    const imageUrl3 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg0TsGtg1E8tRvHrmIsQ2Jli6fjJU1O4IrUN84_pminyskwOOSms7IdrbSnxk73IL7aHE&usqp=CAU";

    return (
        <div className="bg-white px-4 md:px-[10%] py-8 relative min-h-screen">
            <Heading text={headingText} />
            <div className="flex flex-col lg:flex-row items-start">
                
                <div className="hidden lg:flex absolute left-[10%] top-1/2 -translate-y-1/2 items-center space-x-4 z-10">
                    <img
                        src={imageUrl1}
                        alt="Left image"
                        className="rounded-lg shadow-lg w-24 h-56 object-cover"
                    />
                    <img
                        src={imageUrl2}
                        alt="Middle image"
                        className="rounded-lg shadow-lg w-28 h-96 object-cover"
                    />
                    <img
                        src={imageUrl3}
                        alt="Right image"
                        className="rounded-lg shadow-lg w-24 h-72 object-cover"
                    />
                </div>

                
                <div className="flex lg:hidden flex-col items-center space-y-4 mb-8 w-full">
                    <img
                        src={imageUrl1}
                        alt="Left image"
                        className="rounded-lg shadow-lg w-full h-40 object-cover"
                    />
                    <img
                        src={imageUrl2}
                        alt="Middle image"
                        className="rounded-lg shadow-lg w-full h-48 object-cover"
                    />
                    <img
                        src={imageUrl3}
                        alt="Right image"
                        className="rounded-lg shadow-lg w-full h-44 object-cover"
                    />
                </div>

                {/* Content section */}
                <div className="w-full lg:w-1/2 lg:ml-auto">
                    
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{founderText}</h1>
                    <div className="mb-4 md:mb-6 text-justify">
                        {contentText1.split("\n").map((line, idx) => (
                            <p key={idx} className="text-lg md:text-xl text-[#020403] mb-6 text-justify">
                                {line.trim()}
                            </p>
                        ))}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Định hướng</h3>
                    <div className="text-justify">
                        {contentText2.split("\n").map((line, idx) => (
                            <p key={idx} className="text-lg md:text-xl text-[#020403] mb-6 text-justify">
                                {line.trim()}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ability;