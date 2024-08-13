import React, { useEffect, useState } from 'react';
// interfaces
import { FormInterface } from '/src/interfaces/form';
import { StudentInterface } from '/src/interfaces/student';
import { CurrentUserInterface } from '/src/interfaces/user';
import { AssessmentInterface } from '/src/interfaces/assessment';
// components
import { Image } from '/src/components/image';
//
import HomeChartAssessment from './home-chart-assessment';

// ----------------------------------------------------------------------

interface GroupedAssessmentsInterface {
  [formId: string]: AssessmentInterface[];
}

interface HomeDashboardParentProps {
  forms: FormInterface[];
  students: StudentInterface[];
  assessments: AssessmentInterface[];
  currentUser: CurrentUserInterface | null;
}

// ----------------------------------------------------------------------

const HomeDashboardParent: React.FC<HomeDashboardParentProps> = ({ currentUser, assessments, forms, students }) => {
  const [studentAssessments, setStudentAssessments] = useState<AssessmentInterface[]>([]);

  const [formIdAssessments, setFormIdAssessments] = useState<AssessmentInterface[][]>([]);

  const [currentStudent, setCurentStudent] = useState<StudentInterface | undefined>(undefined);

  // GET STUDENT ASSESSMENTS
  useEffect(() => {
    const getStudentAssessments = () => {
      const currentStudent = students?.find((std) => std.id === currentUser?.databaseUsers?.studentId);

      const filteredAssessments = assessments?.filter((as) => as.studentName === currentStudent?.name);

      setStudentAssessments(filteredAssessments);
    };

    getStudentAssessments();

    return () => {
      setStudentAssessments([]);
    };
  }, [students, assessments, currentUser]);

  // GET FORM ID ASSESSMENTS
  useEffect(() => {
    const getFormIdAssessments = () => {
      const groupedByFormId = studentAssessments.reduce((acc: GroupedAssessmentsInterface, current) => {
        const { formId } = current;

        if (!acc[formId]) {
          acc[formId] = [];
        }

        acc[formId].push(current);

        return acc;
      }, {});

      const result = Object.values(groupedByFormId);

      setFormIdAssessments(result);
    };

    getFormIdAssessments();

    return () => {
      setFormIdAssessments([]);
    };
  }, [studentAssessments]);

  // GET CURRENT STUDENT
  useEffect(() => {
    const getCurrentStudent = () => {
      const filteredStudent = students?.find((std) => std.id === currentUser?.databaseUsers?.studentId);

      if (filteredStudent) {
        setCurentStudent(filteredStudent);
      }
    };

    getCurrentStudent();

    return () => {
      setCurentStudent(undefined);
    };
  }, [students, currentUser]);

  return (
    <div className="mt-20">
      <div className="flex w-full flex-col items-center justify-center gap-5 rounded-xl bg-white p-5 shadow-lg drop-shadow-lg lg:w-1/3">
        <p className="text-center text-xl font-semibold text-primary-1">Profil Siswa</p>

        <div className="flex h-[140px] w-[140px] items-center justify-center overflow-hidden rounded-full border border-neutral-500">
          <Image src="/assets/images/image-7.png" alt="student" />
        </div>

        <div className="mt-5 flex w-full flex-col gap-2">
          <div className="flex flex-row items-center">
            <p className="w-[35%] text-[#515151]">Nama</p>
            <p className="flex-1 truncate font-semibold text-black">{currentStudent?.name}</p>
          </div>

          <div className="flex flex-row items-center">
            <p className="w-[35%] text-[#515151]">Kelas</p>
            <p className="flex-1 truncate font-semibold text-black">{currentStudent?.class}</p>
          </div>

          <div className="flex flex-row items-center">
            <p className="w-[35%] text-[#515151]">Orang Tua</p>
            <p className="flex-1 truncate font-semibold text-black">{currentUser?.displayName}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-10">{formIdAssessments?.length && formIdAssessments?.map((as, i) => <HomeChartAssessment key={i} assessments={as} forms={forms} />)}</div>
    </div>
  );
};

export default HomeDashboardParent;
