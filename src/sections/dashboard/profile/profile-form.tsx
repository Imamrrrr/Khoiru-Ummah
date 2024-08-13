import React, { useCallback, useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { useForm, Controller, RegisterOptions } from 'react-hook-form';
// context
import { useUserContext } from '/src/context/user';
// routes
import { useRouter } from '/src/routes/hooks';
// inerfaces
import { StudentInterface } from '/src/interfaces/student';
import { CurrentUserInterface, RoleTypeUserInterface } from '/src/interfaces/user';
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

interface FormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  role: OptionSelectInterface | undefined;
  studentId: OptionSelectInterface | undefined;
}

interface ProfileFormProps {
  studentList: StudentInterface[];
  currentUser: CurrentUserInterface | null;
}

const customStyleSelect: StylesConfig<string | OptionSelectInterface | GroupedOptionSelectInterface, boolean, GroupedOptionSelectInterface> | undefined = {
  control: (provided) => ({
    ...provided,
    borderWidth: '1px',
    borderColor: '#DEDEDE',
    backgroundColor: '#FAFAFA',
    minWidth: '150px',
    width: '100%',
    fontSize: '14px',
    cursor: 'pointer',
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

const ProfileForm: React.FC<ProfileFormProps> = ({ studentList, currentUser }) => {
  const [studentOptions, setStudentOptions] = useState<GroupedOptionSelectInterface[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const { onUpdate } = useUserContext();

  const router = useRouter();

  const roleOptions: OptionSelectInterface[] = [
    { label: 'Guru', value: 'teacher' },
    { label: 'Orang Tua', value: 'parent' },
  ];

  // GET STUDENT OPTIONS
  useEffect(() => {
    const getStudentOptions = () => {
      const groupedStudents: GroupedOptionSelectInterface[] = studentList?.reduce((acc: any, student) => {
        const classKey = `Kelas ${student.class}`;

        if (!acc[classKey]) {
          acc[classKey] = {
            label: classKey,
            options: [],
          };
        }

        acc[classKey].options.push({
          label: fTitleCase(student.name),
          value: student.id,
        });

        return acc;
      }, {});

      const result = Object.values(groupedStudents);

      setStudentOptions(result);
    };

    getStudentOptions();

    return () => {
      setStudentOptions([]);
    };
  }, [studentList]);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    criteriaMode: 'all',
    defaultValues: {
      email: currentUser?.email || '',
      fullName: currentUser?.displayName || '',
      phoneNumber: currentUser?.databaseUsers?.phoneNumber || '',
      role: undefined,
      studentId: undefined,
    },
  });

  const values = watch();

  // ROLE TEACHER = RESET STUDENT ID
  useEffect(() => {
    if (values.role?.value === 'teacher') {
      setValue('studentId', undefined);
    }
  }, [setValue, values.role?.value]);

  const getStudentSelected = useCallback(
    (studentId?: string): OptionSelectInterface => {
      const options = studentOptions?.map((std) => std.options);
      const mergedOptions = options?.reduce((acc, curr) => acc.concat(curr), []);
      const result = mergedOptions?.find((opt) => opt.value === studentId);

      return result!;
    },
    [studentOptions]
  );

  const getRoleSelected = useCallback((role?: string): OptionSelectInterface => {
    const result = roleOptions.find((r) => r.value === role);
    return result!;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // OPTION SELECT DEFAULT VALUE
  useEffect(() => {
    setValue('studentId', getStudentSelected(currentUser?.databaseUsers?.studentId));
    setValue('role', getRoleSelected(currentUser?.databaseUsers?.role));

    return () => setValue('studentId', undefined);
  }, [currentUser?.databaseUsers?.studentId, currentUser?.databaseUsers?.role, getStudentSelected, getRoleSelected, setValue]);

  const handleClickSubmit = useCallback(
    async (data: FormData) => {
      try {
        const formData = {
          currentUser: currentUser!,
          email: data.email.trim(),
          fullName: data.fullName.trim(),
          phoneNumber: data.phoneNumber.trim(),
          role: data.role?.value as RoleTypeUserInterface,
          studentId: data.studentId?.value as string,
        };

        await onUpdate(formData);

        router.reload();

        enqueueSnackbar('Profile berhasil diperbarui');
      } catch (error: any) {
        if (error.message === 'FirebaseError: Firebase: Error (auth/email-already-in-use).') {
          enqueueSnackbar('Email telah terdaftar', { variant: 'error' });
        } else {
          enqueueSnackbar(error.message, { variant: 'error' });
        }

        console.error(error);
      }
    },
    [enqueueSnackbar, onUpdate, currentUser, router]
  );

  const renderFormatGroupLabel = (data: GroupedOptionSelectInterface) => (
    <div className="">
      <span>{data.label}</span>
    </div>
  );

  const controllers: { name: 'fullName' | 'studentId' | 'email' | 'phoneNumber' | 'role'; rules: RegisterOptions<FormData>; options?: OptionSelectInterface[] | GroupedOptionSelectInterface[] }[] = [
    {
      name: 'fullName',
      rules: { required: 'Harap isi bidang nama anda.' },
    },
    {
      name: 'role',
      rules: { required: 'Harap isi bidang peranan.' },
      options: roleOptions,
    },
    {
      name: 'email',
      rules: { required: 'Harap isi bidang email.' },
    },
    {
      name: 'phoneNumber',
      rules: {},
    },
    {
      name: 'studentId',
      rules: {},
      options: studentOptions,
    },
  ];

  return (
    <form onSubmit={handleSubmit(handleClickSubmit)} className="flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg bg-white p-5 shadow-lg drop-shadow-md md:p-10">
      <div className="grid w-full grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
        {controllers.map((controller, index) => (
          <Controller
            key={index}
            control={control}
            name={controller.name}
            rules={controller.rules}
            render={({ field: { onChange, value } }) => (
              <div className="md:last:col-span-2">
                {controller.name === 'fullName' && <InputField label="Nama Anda" onChange={onChange} value={value as string} name={controller.name} placeholder="Masukan nama" />}

                {controller.name === 'email' && <InputField disabled label="Email" onChange={onChange} type="email" value={value as string} name={controller.name} placeholder="Masukan email" />}

                {controller.name === 'role' && (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-[#404040]">Peranan</p>

                    <Select
                      placeholder="Pilih peranan"
                      options={controller.options}
                      onChange={onChange}
                      value={value}
                      styles={customStyleSelect}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </div>
                )}

                {controller.name === 'phoneNumber' && (
                  <InputField label="Nomor Telepon" onChange={onChange} type="number" value={value as string} name={controller.name} placeholder="Masukan nomor telepon" />
                )}

                {controller.name === 'studentId' && values.role?.value === 'parent' && (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-[#404040]">Nama Anak</p>

                    <Select
                      placeholder="Pilih nama anak"
                      options={controller.options}
                      onChange={onChange}
                      value={value}
                      styles={customStyleSelect}
                      formatGroupLabel={renderFormatGroupLabel}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </div>
                )}

                <ErrorMessage errors={errors} name={controller.name} />
              </div>
            )}
          />
        ))}
      </div>

      <Button type="submit" disabled={isSubmitting} fullWidth className="px-10 py-3">
        Simpan Perubahan
      </Button>
    </form>
  );
};

export default ProfileForm;
