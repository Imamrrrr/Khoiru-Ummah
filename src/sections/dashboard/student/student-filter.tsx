import React from 'react';
import { Icon } from '@iconify/react';
// components
import { InputField } from '/src/components/form';

// ----------------------------------------------------------------------

interface StudentFilterProps {
  setFilterSearch: React.Dispatch<React.SetStateAction<string>>;
}

// ----------------------------------------------------------------------

const StudentFilter: React.FC<StudentFilterProps> = ({ setFilterSearch }) => {
  return (
    <div className="mt-5">
      <div className="relative">
        <Icon icon="ic:round-search" width={28} className="absolute left-3 top-[50%] translate-y-[-50%] text-neutral-400" />
        <InputField onChange={(e) => setFilterSearch(e.target.value)} placeholder="Cari NIS atau Nama" inputClassname="pl-11" />
      </div>
    </div>
  );
};

export default StudentFilter;
