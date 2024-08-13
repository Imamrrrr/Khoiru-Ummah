import React from 'react';
// interfaces
import { StudentInterface } from '/src/interfaces/student';
import { FormInterface } from '/src/interfaces/form';
import { AssessmentInterface } from '/src/interfaces/assessment';
//
import HomeSummary from './home-summary';
import HomeStudent from './home-student';

// ----------------------------------------------------------------------

interface HomeDashboardTeacherProps {
  students: StudentInterface[];
  forms: FormInterface[];
  assessments: AssessmentInterface[];
}

// ----------------------------------------------------------------------

const HomeDashboardTeacher: React.FC<HomeDashboardTeacherProps> = ({ students, assessments, forms }) => {
  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <HomeSummary title="Jumlah Siswa" total={students?.length} icon="mdi:users" />
        <HomeSummary title="Jumlah Form" total={forms?.length} icon="mdi:form" />
        <HomeSummary title="Jawaban Form" total={assessments?.length} icon="mdi:users" />
      </div>

      <div className="mt-10">
        <HomeStudent students={students} />
      </div>
    </div>
  );
};

export default HomeDashboardTeacher;
