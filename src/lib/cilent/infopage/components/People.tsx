import * as React from "react";
import { useEffect, useCallback } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Facebook, Youtube } from "lucide-react";
import sangtran from "@/assets/sangtran.jpg";
import minhphan from "@/assets/minhphan.jpg";
import tudinh from "@/assets/tudinh.jpg";
import chaunguyen from "@/assets/chaunguyen.jpg";
import locnguyen from "@/assets/locnguyen.jpg";

const People = () => {
    const [api, setApi] = React.useState(null);
    const [autoplay, setAutoplay] = React.useState(true);
    const intervalRef = React.useRef(null);

    const people = [
        {
            name: "Sang Trần",
            role: "CEO DigiFnB",
            experience: "10+ năm",
            phone: "0826 521 234",
            email: "sangtran.dna@gmail.com",
            social: {
                facebook: "https://www.facebook.com/SangTranMar",
                youtube: "https://www.youtube.com/@sangfoodapp"
            },
            image: sangtran,
            description: {
                title: "CÂU CHUYỆN THÀNH CÔNG",
                content: [
                    "Sang Trần là chuyên gia trong lĩnh vực Food Apps và Digital Marketing. Với hơn 10 năm kinh nghiệm làm việc cho các tập đoàn đa quốc gia, tư vấn Marketing và Food Apps cho hơn 50 doanh nghiệp, Sang Trần hiểu rõ thị trường và đưa đến định hướng phù hợp nhất cho doanh nghiệp .",
                    "Hiện tại, Sang Trần đang đồng hành cùng nhiều doanh nghiệp FnB trong việc phát triển thương hiệu, đặc biệt là định hướng Food Delivery.",
                ],
            },
        },
        {
            name: "Minh Phan",
            role: "Co-Founder Site Plus",
            experience: "10+ năm",
            phone: "0901 017 630",
            email: "minh@siteplus.vn",
            social: {
                facebook: "https://www.facebook.com/minhphan155189",
            },
            image: minhphan,
            description: {
                title: "CÂU CHUYỆN THÀNH CÔNG",
                content: [
                    "Minh Phan là chuyên gia phát triển mặt bằng có hơn 10 năm kinh nghiệm, từng làm việc tại 3 chuỗi cửa hàng tiện lợi lớn nhất Việt Nam.",
                    "Anh còn là gương mặt quen thuộc ở các diễn đàn liên quan đến mặt bằng kinh doanh, là cổ vấn chiến lược mặt bằng cho các chuỗi bán lẻ, chuỗi F&B lớn. Ngoài ra, anh đang phát triển chuỗi quán cà phê cho riêng mình và mở một công ty tư vấn chiến lược về mặt bằng.",
                ],
            },
        },
        {
            name: "Tú Đinh",
            role: "Trưởng phòng Thực thi",
            experience: "5+ năm",
            phone: "0901 192 413",
            email: "tu@siteplus.vn",
            social: {
                facebook: "https://www.facebook.com/profile.php?id=100011697296589",
            },
            image: tudinh,
            description: {
                title: "CÂU CHUYỆN THÀNH CÔNG",
                content: [
                    "Tú Đinh là chuyên gia phát triển mặt bằng đặc biệt các khu vực Hồ Chí Minh và các tỉnh lân cận như Đồng Nai, Bình Dương. Anh từng đảm nhận vai trò trưởng phòng phát triển Rau Má Mix trước khi lựa chọn đồng hành cùng Site Plus.",
                    "Hiện có hơn 5 năm kinh nghiệm trực tiếp đi phát triển cho chuỗi cửa hàng thời trang, thú cưng, trà sữa, cửa hàng tiện lợi,...",
                ],
            },
        },
        {
            name: "Châu Nguyễn",
            role: "Quản lý Dự án",
            experience: "4+ năm",
            phone: "0931 816 276",
            email: "chau@siteplus.vn",
            social: {
                facebook: "https://www.facebook.com/baochau.nguyentan",
            },
            image: chaunguyen,
            description: {
                title: "CÂU CHUYỆN THÀNH CÔNG",
                content: [
                    "Lên kế hoạch và timeline dự án cần triển khai khảo sát, tổng hợp dữ liệu từ khách hàng. Đưa ra các phân tích điểm tốt và chưa tốt của cửa hàng, điểm cần khắc phục từ mong muốn của nhóm đối tượng khách hàng chủ yếu.",
                ],
            },
        },
        {
            name: "Lộc Nguyễn",
            role: "Cố Vấn Pháp Lý Tài Chính và Bất Động Sản",
            experience: "15+ năm",
            phone: "0935 754 447",
            email: "lsnguyenvanloc@gmail.com",
            social: {
                facebook: "https://www.facebook.com/",
            },
            image: locnguyen,
            description: {
                title: "CÂU CHUYỆN THÀNH CÔNG",
                content: [
                    "LS Nguyễn Văn Lộc là người sáng lập Công ty Luật LPVN (LPVN Law Firm) cùng với các LS cộng sự chuyên về tài chính và bất động sản. Bản thân anh trong giai đoạn làm thuê trải qua hàng trăm dự án tư vấn pháp lý về bất động sản, anh lấy kinh nghiệm đó làm xuất phát điểm nghề LS của mình.",
                    "Đội ngũ tư vấn luật của công ty rất nhiều kinh nghiệm là cộng sự thân cận với các doanh chủ trong việc hoạch định các chiến lược pháp lý, tham vấn kế hoạch kinh doanh và đặc biệt là người “đồng đội” của doanh nhân trong giao dịch kinh doanh, thương mại và đầu tư.",
                ],
            },
        },
    ];

    const scrollNext = useCallback(() => {
        if (api) {
            api.scrollNext();
        }
    }, [api]);

    // Set up autoplay
    useEffect(() => {
        if (!api || !autoplay) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            return;
        }

        intervalRef.current = setInterval(scrollNext, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [api, autoplay, scrollNext]);

    // Pause autoplay on hover
    const handleMouseEnter = () => setAutoplay(false);
    const handleMouseLeave = () => setAutoplay(true);

    return (
        <div 
            className="w-full max-w-6xl mx-auto px-8 md:px-12 lg:px-16 py-8 relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Carousel 
                className="relative" 
                opts={{ loop: true }}
                setApi={setApi}
            >
                <CarouselContent>
                    {people.map((person, index) => (
                        <CarouselItem key={index}>
                            <div className="flex flex-col lg:flex-row gap-8 items-center">
                                {/* Left content */}
                                <div className="w-full lg:w-1/2">
                                    <div className="space-y-6">
                                        <h2 className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl text-theme-orange-500 mb-12">
                                            {person.description.title}
                                        </h2>
                                        <div className="space-y-4 text-lg md:text-xl text-[#020403] mb-6 text-justify">
                                            {person.description.content.map((paragraph, idx) => (
                                                <p key={idx} className="text-[#020403]">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Contact info */}
                                    <div className="mt-8 lg:mt-14">
                                        <div className="bg-orange-100 rounded-lg p-6 relative">
                                            <h3 className="font-bold text-xl mb-2">{person.name}</h3>
                                            <p className="text-gray-600 mb-4">{person.role}</p>

                                            <div className="absolute -top-4 right-4 bg-orange-200 text-orange-800 px-4 py-1 rounded-full">
                                                <span className="font-semibold">KINH NGHIỆM</span>
                                                <span className="ml-2">{person.experience}</span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <span className="font-semibold mr-2 w-20">SĐT:</span>
                                                    <span>{person.phone}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-semibold mr-2 w-20">EMAIL:</span>
                                                    <span>{person.email}</span>
                                                </div>
                                                <div className="flex items-center justify-center mt-6 gap-6">
                                                    {person.social.facebook && (
                                                        <a
                                                            href={person.social.facebook}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-full hover:bg-orange-200 transition-colors"
                                                        >
                                                            <Facebook className="w-6 h-6 text-blue-600" />
                                                        </a>
                                                    )}
                                                    {person.social.youtube && (
                                                        <a
                                                            href={person.social.youtube}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-full hover:bg-orange-200 transition-colors"
                                                        >
                                                            <Youtube className="w-6 h-6 text-red-600" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right image */}
                                <div className="w-full lg:w-1/2 flex justify-center">
                                    <div className="w-full max-w-[545px] h-[545px]">
                                        <img
                                            src={person.image}
                                            alt={person.name}
                                            className="w-full h-full object-cover rounded-lg shadow-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className="hidden md:block absolute -left-6 lg:-left-16 top-1/2 transform -translate-y-1/2">
                    <CarouselPrevious className="relative left-0 translate-y-0" />
                </div>
                <div className="hidden md:block absolute -right-6 lg:-right-16 top-1/2 transform -translate-y-1/2">
                    <CarouselNext className="relative right-0 translate-y-0" />
                </div>
            </Carousel>
        </div>
    );
};

export default People;