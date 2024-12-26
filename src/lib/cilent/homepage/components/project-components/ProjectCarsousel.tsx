import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CardItem } from "./CardItem";

export function CarouselList() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Dữ liệu mẫu
  const items = [
    { image: "/images/client/homepage/hamster.png", title: "Hamster Kingdom" },
    { image: "/images/client/homepage/rauma.png", title: "Rau Má Mix" },
    {
      image: "/images/client/homepage/fight.png",
      title: "Fight100",
    },
    { image: "/images/client/homepage/my-thuat.png", title: "Mỹ Thuật Bụi" },
    { image: "/images/client/homepage/cailonuong.png", title: "Cái Lò Nướng" },
  ];
  return (
    <div className="xs:relative w-full max-w-7xl mx-auto px-6">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          skipSnaps: false,
          slidesToScroll: 1,
          containScroll: "keepSnaps",
        }}
        className="w-full"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center">
                    <CardItem image={item.image} title={item.title} />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute lg:left-[-50px] xs:left-[-20px]  xs:flex" />
        <CarouselNext className="absolute lg:right-[-50px] xs:right-[-20px] xs:flex" />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
