import React, { useEffect, useState } from 'react';
// hooks
import { useDatabaseUser } from '/src/hooks/use-database-user';
import { useDatabaseStudent } from '/src/hooks/use-database-student';
// interfaces
import { StudentInterface } from '/src/interfaces/student';
// components
import { Image } from '/src/components/image';
import { LoadingScreen } from '/src/components/loading-screen';
//
import ProfileForm from '../profile-form';
import ProfileAlert from '../profile-alert';

// ----------------------------------------------------------------------

const ProfileView: React.FC = () => {
  const [studentList, setStudentList] = useState<StudentInterface[]>([]);

  const { students } = useDatabaseStudent();

  const { currentUser, isLoadingUser } = useDatabaseUser();

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
    <section>
      <div className="">
        <p className="text-lg font-semibold">Profile</p>
      </div>

      {!isLoadingUser && !currentUser?.databaseUsers?.role && <ProfileAlert />}

      <div className="mt-5 flex flex-col items-center justify-center gap-5 lg:flex-row lg:gap-20 lg:px-10">
        <div className="flex flex-col items-center justify-center gap-3 lg:max-w-[170px]">
          <div className="h-[130px] w-[130px] overflow-hidden rounded-full border-2 border-neutral-500 lg:h-[170px] lg:w-[170px]">
            <Image src={currentUser?.photoURL || '/assets/images/image-7.png'} alt={currentUser?.displayName || 'user'} className="h-full w-full object-cover object-center" />
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-center text-3xl font-semibold leading-none">{currentUser?.displayName}</p>
            <p className="text-center text-base font-semibold text-[#ACACAC]">
              {(currentUser?.databaseUsers?.role === 'parent' && 'Orang Tua') || (currentUser?.databaseUsers?.role === 'teacher' && 'Guru')}
            </p>
          </div>
        </div>

        {!isLoadingUser && currentUser ? <ProfileForm studentList={studentList} currentUser={currentUser} /> : <LoadingScreen />}
      </div>
    </section>
  );
};

export default ProfileView;
