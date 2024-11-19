import { Greeting } from '@/app/guest/home/component/Greeting';
import { Service } from '@/app/guest/home/component/Service';
import { Carousel } from '@/app/guest/home/component/Slider';
import DarkModeToggle from '@/components/ui/dark-mode-toggle';
import { MapPin } from 'lucide-react';

export default function GuestHome() {
  return (
    <>
      <header className="flex justify-between">
        <div className="flex flex-col">
          <h3 className="font-bold">
            NHÀ HÀNG <span className="font-bold">&ldquo;TANREST&ldquo;</span>
          </h3>
          <div className="flex gap-1 items-center">
            <MapPin size="1rem" />
            <p className="text-sm color-">Kim Long, Châu Đức BR-VT</p>
          </div>
        </div>
        <DarkModeToggle />
      </header>
      <main>
        <section
          id="slider"
          className="slider-container my-4 min-h-52 overflow-hidden"
        >
          <Carousel />
        </section>
        <section id="info">
          <Greeting />
        </section>
        <section id="service-menu">
          <Service />
        </section>
      </main>
    </>
  );
}
