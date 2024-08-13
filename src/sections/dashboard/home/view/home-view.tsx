import React from 'react';
// hooks
import { useDatabaseForm } from '/src/hooks/use-database-form';
import { useDatabaseUser } from '/src/hooks/use-database-user';
import { useDatabaseStudent } from '/src/hooks/use-database-student';
import { useDatabaseAssessment } from '/src/hooks/use-database-assessment';
//
import HomeDashboardTeacher from '../home-dashboard-teacher';
import HomeDashboardParent from '../home-dashboard-parent';

// ----------------------------------------------------------------------

const HomeView: React.FC = () => {
  const { currentUser } = useDatabaseUser();

  const { forms } = useDatabaseForm();

  const { students } = useDatabaseStudent();

  const { assessments } = useDatabaseAssessment();

  return (
    <section>
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-center text-3xl font-semibold">
          Selamat Datang di Dashboard{' '}
          <span className="text-primary-1">{(currentUser?.databaseUsers?.role === 'parent' && 'Orang Tua') || (currentUser?.databaseUsers?.role === 'teacher' && 'Guru')}</span>
        </p>
        <p className="text-center text-3xl font-semibold">{currentUser?.displayName?.toUpperCase()}</p>
      </div>

      {currentUser?.databaseUsers?.role === 'teacher' && <HomeDashboardTeacher students={students} forms={forms} assessments={assessments} />}

      {currentUser?.databaseUsers?.role === 'parent' && <HomeDashboardParent currentUser={currentUser} assessments={assessments} forms={forms} students={students} />}
    </section>
  );
};

export default HomeView;
