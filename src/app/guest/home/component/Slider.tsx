'use client';

import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import styles from './slider.module.css'; // Import the CSS Module

const sliderSettings: Settings = {
  dots: true,
  lazyLoad: 'ondemand',
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  customPaging: function (i) {
    return <button className={styles.slickDots} />;
  },
};
const images = ['/slider-3.jpg', '/slider-2.jpg', '/slider-1.jpg'];
export const Carousel = () => {
  return (
    <div>
      <Slider {...sliderSettings} className={styles.slickDots}>
        {images.map((src, index) => (
          <div key={index} className="!flex justify-center h-48">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              className="object-cover h-full w-full rounded-lg"
              width={100}
              height={50}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};
