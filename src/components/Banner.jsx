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
    <Swiper
      autoplay={{ delay: 3000 }}
      loop
      modules={[Autoplay]}
      className="h-[300px] md:h-[500px]"
    >
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <img
            src={src}
            alt={`Banner ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
