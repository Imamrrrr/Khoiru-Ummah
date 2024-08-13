import React, { useCallback, useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Controller, useForm } from 'react-hook-form';
// routes
import { paths } from '/src/routes/paths';
import { useRouter } from '/src/routes/hooks';
// interfaces
import { FormInterface } from '/src/interfaces/form';
import { StudentInterface } from '/src/interfaces/student';
import { CurrentUserInterface } from '/src/interfaces/user';
import { PayloadCreateAssessmentInterface, QuestionPoinAssessmentInterface, RoleTypeAssessmentInterface } from '/src/interfaces/assessment';
// utils
import { fTitleCase } from '/src/utils/format-string';
// components
import { Button } from '/src/components/button';
import { useSnackbar } from '/src/components/snackbar';
import { InputField, ErrorMessage } from '/src/components/form';

// ----------------------------------------------------------------------

interface OptionSelectInterface {
  label: string;
  value: string;
}

interface GroupedOptionSelectInterface {
  label: string;
  options: OptionSelectInterface[];
}

interface GroupInterface {
  name: string;
  title: string;
}

interface QuestionInterface {
  uid: string;
  question: string;
}

interface QuestionPoinInterface {
  group: {
    name: string;
    title: string;
  };
  questions: {
    uid: string;
    question: string;
    point: number;
  };
}

interface FormData {
  class: string;
  name: string;
  phoneNumber: string;
  email: string;
  role: RoleTypeAssessmentInterface;
  studentName: OptionSelectInterface | undefined;
}

interface InputFormProps {
  students: StudentInterface[];
  currentForm: FormInterface | null;
  currentUser: CurrentUserInterface;
  onCreateAssessment: (payload: PayloadCreateAssessmentInterface) => Promise<void>;
}

const customStyleSelect: StylesConfig<string | OptionSelectInterface | GroupedOptionSelectInterface, boolean, GroupedOptionSelectInterface> | undefined = {
  control: (provided, state) => ({
    ...provided,
    borderWidth: '1px',
    borderColor: state.isDisabled ? '#a3a3a3' : '#DEDEDE',
    backgroundColor: state.isDisabled ? '#d4d4d4' : '#FAFAFA',
    minWidth: '150px',
    width: '100%',
    fontSize: '14px',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    padding: '3px 0',
    borderRadius: '6px',
    transition: 'all 300ms',
    fontFamily: 'Poppins, "sans-serif"',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'black',
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 300ms',
    fontFamily: 'Poppins, "sans-serif"',
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? '#8A2BE2' : 'white',
    ':hover': { backgroundColor: '#8A2BE2', color: 'white' },
  }),
};

// ----------------------------------------------------------------------

const InputForm: React.FC<InputFormProps> = ({ students, currentForm, currentUser, onCreateAssessment }) => {
  const [classOptions, setClassOptions] = useState<OptionSelectInterface[]>([]);

  const [studentOptions, setStudentOptions] = useState<GroupedOptionSelectInterface[]>([]);

  const [questionPoints, setQuestionPoints] = useState<QuestionPoinInterface[]>([]);

  const [finalQuestionPoints, setFinalQuestionPoints] = useState<QuestionPoinAssessmentInterface[]>([]);

  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const assessmentPointList = [
    { label: '4', value: 4 },
    { label: '3', value: 3 },
    { label: '2', value: 2 },
    { label: '1', value: 1 },
  ];

  // GET CLASS OPTIONS
  useEffect(() => {
    const getClassOptions = () => {
      currentForm?.class?.sort();
      const result = currentForm?.class?.map((cl) => ({ label: `Kelas ${cl}`, value: cl }));

      setClassOptions(result!);
    };

    getClassOptions();

    return () => {
      setClassOptions([]);
    };
  }, [currentForm?.class]);

  // GET FINAL QUESTION POINTS
  useEffect(() => {
    const getFinalQuestionPoints = () => {
      const questionGrouping = questionPoints?.reduce<QuestionPoinAssessmentInterface[]>((acc, curr) => {
        const groupIndex = acc.findIndex((item) => item.group.name === curr.group.name);

        if (groupIndex > -1) {
          acc[groupIndex].questions.push(curr.questions);
        } else {
          acc.push({
            group: curr.group,
            questions: [curr.questions],
            accumulationPoints: 0,
          });
        }

        return acc;
      }, []);

      // ACCUMULATION FORMULA`
      const accumulationValue = (values: number[]) => {
        const sumValues = values?.reduce((acc, cur) => acc + cur, 0);

        const result = (sumValues / values.length) * 25;

        return result;
      };

      const result = questionGrouping?.reduce<QuestionPoinAssessmentInterface[]>((acc, curr) => {
        const res = curr.questions.map((que) => que.point);

        const accumulationPoint = accumulationValue(res);

        acc.push({
          group: curr.group,
          questions: curr.questions,
          accumulationPoints: accumulationPoint,
        });

        return acc;
      }, []);

      setFinalQuestionPoints(result);
    };

    getFinalQuestionPoints();

    return () => {
      setFinalQuestionPoints([]);
    };
  }, [questionPoints]);

  // GET TOTAL QUESTION
  useEffect(() => {
    const getTotalQuestion = () => {
      const result = currentForm?.questions?.reduce<number>((acc, curr) => {
        acc += curr.questions.length;

        return acc;
      }, 0);

      setTotalQuestions(result!);
    };

    getTotalQuestion();

    return () => {
      setTotalQuestions(0);
    };
  }, [currentForm?.questions]);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    criteriaMode: 'all',
    defaultValues: {
      studentName: undefined,
      class: '',
      name: currentUser?.displayName || '',
      phoneNumber: currentUser?.databaseUsers?.phoneNumber || '',
      email: currentUser?.email || '',
    },
  });

  const values = watch();

  // DEFAULT VALUE STUDENT NAME, CLASS
  useEffect(() => {
    const filteredStudent = students?.find((std) => std.id === currentUser?.databaseUsers?.studentId);

    if (filteredStudent) {
      setValue('studentName', { label: fTitleCase(filteredStudent.name), value: filteredStudent.name });
      setValue('class', filteredStudent.class);
    }
  }, [currentUser, students, setValue]);

  // GET STUDENT OPTIONS, FILTER STUDENT OPTIONS BY CLASS
  useEffect(() => {
    const getStudentOptions = () => {
      const matchedStudentClass = students?.filter((st) => currentForm?.class.includes(st.class));

      matchedStudentClass?.sort((a, b) => {
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

      const groupedStudents: GroupedOptionSelectInterface[] = matchedStudentClass?.reduce((acc: any, student) => {
        const classKey = `Kelas ${student.class}`;

        if (!acc[classKey]) {
          acc[classKey] = {
            label: classKey,
            options: [],
          };
        }

        acc[classKey].options.push({
          label: fTitleCase(student.name),
          value: student.name,
        });

        return acc;
      }, {});

      const result = Object.values(groupedStudents);

      if (values.class && currentUser.databaseUsers?.role === 'teacher') {
        setValue('studentName', undefined);

        const filteredStudentOptions = result?.filter((std) => std.label === `Kelas ${values.class}`);

        setStudentOptions(filteredStudentOptions);
      } else {
        setStudentOptions(result);
      }
    };

    getStudentOptions();

    return () => {
      setStudentOptions([]);
    };
  }, [currentForm?.class, students, values.class, setValue, currentUser]);

  const handleChangeAssessmentPoint = useCallback(
    (group: GroupInterface, question: QuestionInterface, point: number) => {
      const result = {
        group: {
          name: group.name,
          title: group.title,
        },
        questions: {
          uid: question.uid,
          question: question.question,
          point,
        },
      };

      const newValue = [...questionPoints, result];

      const temp: { [key: string]: QuestionPoinInterface } = {};

      newValue?.forEach((item) => {
        const key = `${item.group.name}-${item.questions.uid}-${item.questions.question}`;
        temp[key] = item;
      });

      const finalResult: QuestionPoinInterface[] = Object.values(temp);

      setQuestionPoints(finalResult);
    },
    [questionPoints]
  );

  const handleClickSubmit = useCallback(
    async (data: FormData) => {
      try {
        const formData = {
          formId: currentForm?.id!,
          studentName: data.studentName?.value as string,
          name: data.name.trim(),
          email: data.email.trim(),
          class: data.class.trim(),
          role: currentUser?.databaseUsers?.role!,
          phoneNumber: data.phoneNumber.trim(),
          questionPoints: finalQuestionPoints,
        };

        if (totalQuestions !== questionPoints?.length) {
          enqueueSnackbar('Mohon pilih poin untuk semua pertanyaan', { variant: 'error' });
        } else {
          await onCreateAssessment(formData);

          enqueueSnackbar('Jawaban berhasil dikirim');

          router.push(paths.dashboard.form.root);
        }
      } catch (error: any) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    },
    [currentForm, enqueueSnackbar, onCreateAssessment, router, finalQuestionPoints, questionPoints, totalQuestions, currentUser]
  );

  const findCurrentPoint = useCallback(
    (groupName: string, questionUid: string, checkedPoin: number): boolean => {
      const findFQP = finalQuestionPoints?.find((question) => question.group.name === groupName);

      const result = findFQP?.questions?.find((question) => question.uid === questionUid);

      if (result) {
        return result.point === checkedPoin;
      }

      return false;
    },
    [finalQuestionPoints]
  );

  const renderFormatGroupLabel = (data: GroupedOptionSelectInterface) => (
    <div>
      <span>{data.label}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(handleClickSubmit)} className="relative mt-5 w-full rounded-lg bg-white p-5 shadow-lg drop-shadow-md">
      <div className="absolute left-0 top-0 h-5 w-full rounded-t-lg bg-[#1F9E38]" />

      <div className="mt-6 flex flex-col gap-3">
        <p className="text-3xl font-semibold">{currentForm?.title}</p>

        {currentForm?.desc && (
          <div className="rounded-lg bg-[#F3EAFC] px-4 py-2">
            <p className="font-semibold">Deskripsi :</p>
            <p className="text-sm">{currentForm.desc}</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg bg-[#1F9E38] px-6 py-2">
        <p className="text-xl font-semibold text-white">Informasi Data Siswa dan Orang Tua/Wali</p>
      </div>

      {/* CLASS */}
      {currentUser?.databaseUsers?.role === 'teacher' && (
        <div className="form-control mt-6 w-full gap-2">
          <span className="text-sm font-semibold text-[#404040]">Kelas</span>

          <div className="grid w-full grid-cols-2 gap-y-4 md:grid-cols-3 lg:grid-cols-6">
            {classOptions?.map((clo, i) => <InputField key={i} {...register('class', { required: 'Harap isi bidang kelas.' })} type="radio" name="class" radioLabel={clo.label} value={clo.value} />)}
          </div>
          <ErrorMessage errors={errors} name="class" />
        </div>
      )}

      {/* STUDENT NAME */}
      <div className="mt-6 flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#404040]">Nama Siswa</p>

        <Controller
          name="studentName"
          control={control}
          rules={{ required: 'Harap isi bidang nama siswa.' }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Pilih siswa"
              options={studentOptions}
              styles={customStyleSelect}
              isDisabled={currentUser.databaseUsers?.role === 'parent'}
              formatGroupLabel={renderFormatGroupLabel}
              components={{ IndicatorSeparator: () => null }}
            />
          )}
        />

        <ErrorMessage errors={errors} name="studentName" />
      </div>

      {/* PARENT NAME */}
      <div className="mt-6">
        <InputField {...register('name', { required: 'Harap isi bidang nama anda.' })} disabled label="Nama Pengirim" placeholder="Masukan nama anda" labelClassname="font-semibold" />
        <ErrorMessage errors={errors} name="name" />
      </div>

      {/* PHONE NUMBER */}
      <div className="mt-6">
        <InputField
          {...register('phoneNumber', { required: 'Harap isi bidang nomor telepon.' })}
          disabled
          type="number"
          label="Nomor Telepon Pengirim"
          placeholder="Masukan nomor telepon anda"
          labelClassname="font-semibold"
        />
        <ErrorMessage errors={errors} name="phoneNumber" />
      </div>

      {/* EMAIL */}
      <div className="mt-6">
        <InputField {...register('email', { required: 'Harap isi bidang email.' })} disabled type="email" label="Email Pengirim" placeholder="Masukan email anda" labelClassname="font-semibold" />
        <ErrorMessage errors={errors} name="email" />
      </div>

      <div className="mt-6 rounded-lg bg-[#1F9E38] px-6 py-2">
        <p className="text-xl font-semibold text-white">Penilaian Siswa</p>
      </div>

      {currentForm?.notes && (
        <div className="mt-3 rounded-lg bg-[#F3EAFC] px-4 py-2">
          <p className="font-semibold">Catatan :</p>
          <p className="text-sm">{currentForm.notes}</p>
        </div>
      )}

      {/* QUESTION POINTS */}
      {currentForm?.questions?.map((question, qi) => (
        <div key={qi} className="mt-6">
          <div className="border-b border-[#404040]">
            <p className="text-lg font-semibold text-[#404040]">
              {question.group.name.toUpperCase()}. {question.group.title}
            </p>
          </div>

          {question.questions?.map((list, li) => (
            <div key={li} className="form-control mt-6 w-full gap-2">
              <span className="text-sm font-semibold text-[#404040]">
                {li + 1}. {list.question}
              </span>

              <div className="flex w-full flex-col gap-3">
                {assessmentPointList?.map((poin, pi) => (
                  <InputField
                    key={pi}
                    type="radio"
                    name={`question.${question.group.name}.${list.uid}`}
                    radioLabel={poin.label}
                    checked={findCurrentPoint(question.group.name, list.uid, poin.value)}
                    value={poin.value}
                    onChange={() => handleChangeAssessmentPoint(question.group, list, poin.value)}
                  />
                ))}
              </div>

              <ErrorMessage errors={errors} name={`questionPoints.${qi}.point`} />
            </div>
          ))}
        </div>
      ))}

      <div className="mt-10">
        <Button type="submit" disabled={isSubmitting} className="flex w-full flex-row items-center justify-center gap-2">
          Kirim Formulir
        </Button>
      </div>
    </form>
  );
};

export default InputForm;
