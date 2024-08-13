import React, { useEffect, useState } from 'react';
import Chart, { ArcElement } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
// interfaces
import { FormInterface } from '/src/interfaces/form';
import { AssessmentInterface } from '/src/interfaces/assessment';

// ----------------------------------------------------------------------

interface DataChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

interface HomeChartAssessmentProps {
  forms: FormInterface[];
  assessments: AssessmentInterface[];
}

// ----------------------------------------------------------------------

const HomeChartAssessment: React.FC<HomeChartAssessmentProps> = ({ assessments, forms }) => {
  const [dataChart, setDataChart] = useState<DataChart | null>(null);

  Chart.register(ArcElement);

  const chartOptions = {
    type: 'line',
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Grup Pertanyaan',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Nilai',
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  // GET DATA CHART
  useEffect(() => {
    const getDataChart = () => {
      const mapingAssessments = assessments?.map((as) => ({
        labels: as.questionPoints.map((qp) => qp.group.name?.toUpperCase()),
        label: as.role === 'parent' ? 'Orang Tua' : 'Guru',
        questionsPoints: as.questionPoints,
      }));

      if (mapingAssessments?.length) {
        const result = {
          labels: mapingAssessments[0].labels,
          datasets: mapingAssessments.map((ma) => ({
            label: ma.label,
            data: ma.questionsPoints?.map((qp) => qp.accumulationPoints),
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15,
          })),
        };

        setDataChart(result);
      }
    };

    getDataChart();

    return () => {
      setDataChart(null);
    };
  }, [assessments]);

  const getFormTitle = (): string => {
    const filteredForm = forms?.find((form) => form.id === assessments?.[0]?.formId);

    if (filteredForm) {
      return filteredForm.title;
    }

    return '';
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 rounded-xl bg-white p-5 shadow-lg drop-shadow-lg">
      <div className="flex w-full flex-col gap-1">
        <p className="text-center text-xl font-semibold text-primary-1 md:text-left">Hasil Nilai {getFormTitle()}</p>
        <p className="text-center font-opensans md:text-left">Grafik Perkembangan hasil penilaian orang tua dari waktu ke waktu</p>
      </div>

      <div className="h-full w-full">{dataChart && <Line data={dataChart!} options={chartOptions} />}</div>

      <div className="w-full border-t-2 border-neutral-300 pt-3">
        <p className="font-semibold">Keterangan Grup Pertanyaan :</p>

        <div className="mt-1">
          {assessments?.[0]?.questionPoints?.map((qp, i) => (
            <p key={i} className="text-sm">
              {qp.group.name?.toUpperCase()} = {qp.group.title}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeChartAssessment;
