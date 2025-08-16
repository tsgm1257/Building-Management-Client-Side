import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const Banner = () => {
  const images = [
    "https://i.ibb.co/k6Dv05GN/image-2.png",
    "https://i.ibb.co/HpKRWwjw/image-3.png",
    "https://i.ibb.co/0jZFRYFj/image-4.png",
    "https://i.ibb.co/vCZwQGkN/image-1.png",
  ];

  return (
    <div className="w-full">
      <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-base-300/20">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          loop
          className="w-full h-full"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i} className="w-full h-full">
              <img
                src={src}
                alt={`Banner ${i + 1}`}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
