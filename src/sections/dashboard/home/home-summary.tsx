import React from 'react';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

interface HomeSummaryProps {
  total: number;
  title: string;
  icon: string;
}

// ----------------------------------------------------------------------

const HomeSummary: React.FC<HomeSummaryProps> = ({ total, title, icon }) => {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-lg drop-shadow-lg">
      <div className="flex flex-col items-center justify-center">
        <p className="text-center text-4xl font-semibold text-primary-1">{total}</p>
        <p className="text-center font-semibold">{title}</p>
      </div>

      <Icon icon={icon} width={78} className="text-primary-1" />
    </div>
  );
};

export default HomeSummary;
