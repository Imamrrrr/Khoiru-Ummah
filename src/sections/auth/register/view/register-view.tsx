import React, { useEffect, useState } from 'react';
// routes
import { paths } from '/src/routes/paths';
// inerfaces
import { StudentInterface } from '/src/interfaces/student';
// hooks
import { useDatabaseStudent } from '/src/hooks/use-database-student';
// components
import { Button } from '/src/components/button';
//
import RegisterForm from '../register-form';

// ----------------------------------------------------------------------

const RegisterView: React.FC = () => {
  const [studentList, setStudentList] = useState<StudentInterface[]>([]);

  const { students } = useDatabaseStudent();

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

  return (
    <section className="flex flex-col items-center justify-center gap-10">
      <div className="flex w-full flex-col items-center gap-6 rounded-[21px] bg-white p-5 shadow-lg drop-shadow-md md:p-10 lg:w-[958px]">
        <p className="w-full text-center text-2xl font-semibold">Daftar akun</p>

        <RegisterForm studentList={studentList} />
      </div>

      <div className="flex flex-row items-center justify-center gap-1">
        <p className="">Sudah punya akun?</p>
        <Button component="RouterLink" href={paths.auth.login} variant="gost">
          Masuk Sekarang
        </Button>
      </div>
    </section>
  );
};

export default RegisterView;
