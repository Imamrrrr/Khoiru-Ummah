import React, { useEffect, useState } from 'react';
import Chart, { ArcElement } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
// interfaces
import { StudentInterface } from '/src/interfaces/student';

// ----------------------------------------------------------------------

interface HomeStudentsProps {
  students: StudentInterface[];
}

// ----------------------------------------------------------------------

const HomeStudent: React.FC<HomeStudentsProps> = ({ students }) => {
  const [dataChart, setDataChart] = useState<number[]>([]);

  Chart.register(ArcElement);

  // GET DATA CHART
  useEffect(() => {
    const getDataChart = () => {
      const filteredClass1 = students?.filter((std) => std.class === '1');
      const filteredClass2 = students?.filter((std) => std.class === '2');
      const filteredClass3 = students?.filter((std) => std.class === '3');
      const filteredClass4 = students?.filter((std) => std.class === '4');
      const filteredClass5 = students?.filter((std) => std.class === '5');
      const filteredClass6 = students?.filter((std) => std.class === '6');
      const result = [filteredClass1?.length, filteredClass2?.length, filteredClass3?.length, filteredClass4?.length, filteredClass5?.length, filteredClass6?.length];

      setDataChart(result);
    };

    getDataChart();

    return () => {
      setDataChart([]);
    };
  }, [students]);

  const data = {
    labels: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
    datasets: [
      {
        label: 'Jumlah Siswa',
        data: dataChart,
        backgroundColor: ['#dc2626', '#eab308', '#22c55e', '#0ea5e9', '#8b5cf6', '#ec4899'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-white p-3 shadow-lg drop-shadow-lg lg:w-[50%]">
      <p className="font-semibold">Jumlah Siswa</p>

      <div className="h-full w-full md:h-[400px] md:w-[400px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default HomeStudent;
