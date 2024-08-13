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
//
import StudentTable from '../student-table';
import StudentFilter from '../student-filter';

// ----------------------------------------------------------------------

const StudentView: React.FC = () => {
  const [studentList, setStudentList] = useState<StudentInterface[]>([]);

  const [onDisplayStudents, setOnDisplayStudents] = useState<StudentInterface[]>([]);

  const [filterSearch, setFilterSearch] = useState<string>('');

  const { students, onDeleteStudent } = useDatabaseStudent();

  // GET STUDENT LIST
  useEffect(() => {
    const getStudentList = () => {
      students?.sort((a, b) => {
        const paramA = a.class.toUpperCase();
        const paramB = b.class.toUpperCase();
        if (paramA < paramB) {
          return -1;
        }
        if (paramA > paramB) {
          return 1;
        }

        return 0;
      });

      setStudentList(students);
    };

    getStudentList();

    return () => {
      setStudentList([]);
    };
  }, [students]);

  // UPDATE ON DISPLAY STUDENTS
  useEffect(() => {
    const getOnDisplayStudents = () => {
      if (filterSearch) {
        const result = students?.filter((student) => {
          return student.name.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 || student.nis.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1;
        });

        setOnDisplayStudents(result);
      } else {
        setOnDisplayStudents(students);
      }
    };

    getOnDisplayStudents();

    return () => {
      setOnDisplayStudents([]);
    };
  }, [filterSearch, studentList, students]);

  return (
    <RoleBasedGuard>
      <section>
        <div className="flex flex-row items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Students</p>
          </div>

          <Button component="RouterLink" href={paths.dashboard.student.create} className="flex flex-row items-center justify-center gap-2">
            <Icon icon="mingcute:add-fill" />
            <span>Tambah Siswa</span>
          </Button>
        </div>

        <StudentFilter setFilterSearch={setFilterSearch} />

        <StudentTable students={onDisplayStudents} onDeleteStudent={onDeleteStudent} />
      </section>
    </RoleBasedGuard>
  );
};

export default StudentView;
