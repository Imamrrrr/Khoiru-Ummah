import React from 'react';
// components
import { Image } from '/src/components/image';
import { Button } from '/src/components/button';
//
import { FeatureHomeInterface } from './view/home-view';

// ----------------------------------------------------------------------

interface HomeFeatureProps {
  features: FeatureHomeInterface[];
}

// ----------------------------------------------------------------------

const HomeFeature: React.FC<HomeFeatureProps> = ({ features }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-16 pt-20">
      <div className="flex max-w-[808px] flex-col gap-3">
        <p className="text-center text-4xl font-semibold md:text-[42px] md:leading-normal">Coba Fitur Kami</p>
        <p className="font-opensans text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consectetur ac ipsum a hendrerit. Nam iaculis dictum dui, ac egestas massa elementum non.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-20">{features?.map((feature, i) => <RenderCard key={i} feature={feature} />)}</div>

      <Button className="rounded-xl px-[65px] py-[10px] text-xl md:w-[376px] md:text-2xl">Learn More</Button>
    </div>
  );
};

function RenderCard({ feature }: { feature: FeatureHomeInterface }) {
  return (
    <div className="w-full rounded-xl bg-white shadow-md shadow-neutral-400 drop-shadow-md">
      <Image src={feature.image} alt={feature.title} className="w-full object-cover" />

      <div className="flex flex-col gap-2 p-5">
        <p className="text-2xl font-semibold md:text-[26px]">{feature?.title}</p>
        <p>{feature.desc}</p>
      </div>
    </div>
  );
}

export default HomeFeature;
