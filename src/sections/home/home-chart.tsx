import React from 'react';
// components
import { Image } from '/src/components/image';

// ----------------------------------------------------------------------

const HomeChart: React.FC = () => {
  return (
    <div className="flex flex-col justify-center gap-16 pt-20 lg:pt-40">
      <div className="flex flex-col-reverse items-center justify-between gap-10 lg:flex-row">
        <div className="flex max-w-[724px] flex-col gap-3">
          <p className="text-center text-4xl font-semibold md:text-[42px]">Lacak Perkembangan Anak Anda</p>
          <p className="font-opensans text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consectetur ac ipsum a hendrerit. Nam iaculis dictum dui, ac egestas massa elementum non.{' '}
          </p>
        </div>

        <div className="h-[262px] w-[295px]">
          <Image src="/assets/images/image-5.png" alt="data-visual" />
        </div>
      </div>

      <div className="">
        <Image src="/assets/images/image-6.png" alt="chart" />
      </div>
    </div>
  );
};

export default HomeChart;
