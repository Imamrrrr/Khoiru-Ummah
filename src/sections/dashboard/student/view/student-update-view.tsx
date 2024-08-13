import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// hooks
import { useDatabaseStudent } from '/src/hooks/use-database-student';
// routes
import { paths } from '/src/routes/paths';
// layouts
import { RoleBasedGuard } from '/src/layouts/guard';
// interfaces
import { StudentInterface } from '/src/interfaces/student';
// components
import { Button } from '/src/components/button';
import { LoadingScreen } from '/src/components/loading-screen';
//
import UpdateForm from '../update/update-form';

// ----------------------------------------------------------------------

interface StudentUpdateViewProps {
  slug: string;
}

// ----------------------------------------------------------------------

const StudentUpdateView: React.FC<StudentUpdateViewProps> = ({ slug }) => {
  const [currentStudent, setCurrentStudent] = useState<StudentInterface | null>(null);

  const { students, onUpdateStudent } = useDatabaseStudent();

  useEffect(() => {
    const getCurrentStudent = () => {
      const filteredStudent = students?.find((student) => student.id === slug);

      if (filteredStudent) {
        setCurrentStudent(filteredStudent);
      }
    };

    getCurrentStudent();

    return () => {
      setCurrentStudent(null);
    };
  }, [students, slug]);

  return (
    <RoleBasedGuard>
      <section>
        <div>
          <Button component="RouterLink" href={paths.dashboard.student.root} variant="gost" className="flex flex-row items-center gap-1">
            <Icon icon="ic:round-arrow-back-ios" color="#000" />

            <span className="text-lg font-semibold text-black">Update Student</span>
          </Button>
        </div>

        <div className="mt-5">{currentStudent ? <UpdateForm currentStudent={currentStudent} onUpdateStudent={onUpdateStudent} /> : <LoadingScreen />}</div>
      </section>
    </RoleBasedGuard>
  );
};

export default StudentUpdateView;
