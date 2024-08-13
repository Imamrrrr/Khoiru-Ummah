import React from 'react';
// components
import { Image } from '/src/components/image';
import { Button } from '/src/components/button';
//
import HomeChart from '../home-chart';
import HomeFeature from '../home-feature';

// ----------------------------------------------------------------------

export interface FeatureHomeInterface {
  title: string;
  desc: string;
  image: string;
}
// ----------------------------------------------------------------------

const HomeView: React.FC = () => {
  const features: FeatureHomeInterface[] = [
    { title: 'Membuat Formulir', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', image: '/assets/images/image-2.png' },
    { title: 'Mengisi Formulir', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', image: '/assets/images/image-3.png' },
    { title: 'Visualisasi Hasil', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', image: '/assets/images/image-4.png' },
  ];

  return (
    <section>
      <div className="flex flex-col-reverse items-center lg:flex-row lg:items-start">
        <div className="flex max-w-[859px] flex-col items-center gap-5 md:gap-10 lg:items-start">
          <p className="text-center text-4xl font-semibold md:text-[42px] md:leading-normal lg:text-left">Mari Bersama Sama Mencatat dan Memantau Perkembangan Sikap Anak Anda</p>

          <p className="font-opensans text-center lg:text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consectetur ac ipsum a hendrerit. Nam iaculis dictum dui, ac egestas massa elementum non. Donec accumsan mauris nec tortor
            blandit, et lobortis quam gravida. Praesent malesuada, tellus et maximus tristique, mi neque placerat sem, id mollis dui dolor cursus nunc. Quisque ultrices iaculis congue. Proin pulvinar
            sem est, vel maximus nunc venenatis ac.\
          </p>

          <Button className="mt-5 rounded-xl px-[65px] py-[18px] text-xl md:text-2xl">Mulai</Button>
        </div>

        <div>
          <Image src="/assets/images/image-1.png" alt="teaching" className="h-[300px] w-[300px] md:h-[500px] md:w-[500px]" />
        </div>
      </div>

      <HomeFeature features={features} />

      <HomeChart />
    </section>
  );
};

export default HomeView;
