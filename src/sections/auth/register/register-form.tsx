import React, { useCallback, useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Icon } from '@iconify/react';
import { useForm, Controller, RegisterOptions } from 'react-hook-form';
// context
import { useUserContext } from '/src/context/user';
// routes
import { paths } from '/src/routes/paths';
import { useRouter } from '/src/routes/hooks';
// inerfaces
import { StudentInterface } from '/src/interfaces/student';
import { RoleTypeAuthInterface } from '/src/interfaces/authentication';
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
  password: string;
  phoneNumber: string;
  role: OptionSelectInterface | undefined;
  studentId: OptionSelectInterface | undefined;
}

interface RegisterFormProps {
  studentList: StudentInterface[];
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

const RegisterForm: React.FC<RegisterFormProps> = ({ studentList }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [studentOptions, setStudentOptions] = useState<GroupedOptionSelectInterface[]>([]);

  const { onRegister, onLoginGoogle } = useUserContext();

  const { enqueueSnackbar } = useSnackbar();

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
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      phoneNumber: '',
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

  const handleClickViewHidePassword = useCallback(() => {
    const passwordInput = document.getElementsByName('password')?.[0] as HTMLInputElement;

    if (passwordInput) {
      passwordInput.type === 'password' ? (passwordInput.type = 'text') : (passwordInput.type = 'password');
    }

    setIsPasswordVisible((prev) => !prev);
  }, []);

  const handleClickSubmit = useCallback(
    async (data: FormData) => {
      try {
        const formData = {
          email: data.email.trim(),
          password: data.password.trim(),
          fullName: data.fullName.trim(),
          phoneNumber: data.phoneNumber.trim(),
          role: data.role?.value as RoleTypeAuthInterface,
          studentId: data.studentId?.value as string,
        };

        await onRegister(formData);

        enqueueSnackbar('Akun berhasil didaftrakan');

        reset();
        router.push(paths.auth.login);
      } catch (error: any) {
        if (error.message === 'FirebaseError: Firebase: Error (auth/email-already-in-use).') {
          enqueueSnackbar('Email telah terdaftar', { variant: 'error' });
        } else {
          enqueueSnackbar(error.message, { variant: 'error' });
        }

        console.error(error);
      }
    },
    [onRegister, enqueueSnackbar, reset, router]
  );

  const renderFormatGroupLabel = (data: GroupedOptionSelectInterface) => (
    <div className="">
      <span>{data.label}</span>
    </div>
  );

  const controllers: {
    name: 'fullName' | 'studentId' | 'email' | 'password' | 'role' | 'phoneNumber';
    rules: RegisterOptions<FormData>;
    options?: OptionSelectInterface[] | GroupedOptionSelectInterface[];
  }[] = [
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
      name: 'password',
      rules: {
        required: 'Harap isi bidang kata sandi.',
        validate: {
          notEmpty: (value) => {
            if (typeof value === 'string') {
              return value.trim() !== '' || 'Kata sandi tidak valid.';
            }
            return 'Kata sandi tidak valid.';
          },
          minLength: (value) => {
            if (typeof value === 'string') {
              return value.length >= 6 || 'Kata sandi harus minimal 6 karakter.';
            }
            return 'Kata sandi harus minimal 6 karakter.';
          },
        },
      },
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
    <form onSubmit={handleSubmit(handleClickSubmit)} className="flex w-full flex-col items-center justify-center gap-4">
      <div className="grid w-full grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:gap-x-20">
        {controllers.map((controller, index) => (
          <Controller
            key={index}
            control={control}
            name={controller.name}
            rules={controller.rules}
            render={({ field: { onChange, value } }) => (
              <div>
                {controller.name === 'fullName' && <InputField label="Nama Anda" onChange={onChange} value={value as string} name={controller.name} placeholder="Masukan nama" />}

                {controller.name === 'email' && <InputField label="Email" onChange={onChange} type="email" value={value as string} name={controller.name} placeholder="Masukan email" />}

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

                {controller.name === 'password' && (
                  <div className="relative">
                    <InputField label="Kata Sandi" onChange={onChange} type="password" value={value as string} name={controller.name} placeholder="Masukan kata sandi" inputClassname="pr-10" />

                    <Button onClick={handleClickViewHidePassword} variant="gost" className="absolute right-2 top-[69%] -translate-y-[50%] bg-transparent p-0 md:top-[68%] md:p-0 lg:top-[67%] lg:p-0">
                      <Icon icon={!isPasswordVisible ? 'heroicons:eye-20-solid' : 'heroicons:eye-slash-20-solid'} width={20} color="#9E9E9E" />
                    </Button>
                  </div>
                )}

                {controller.name === 'phoneNumber' && (
                  <InputField label="Nomor Telepon" onChange={onChange} type="number" value={value as string} name={controller.name} placeholder="Masukan nomor telepon" />
                )}

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

                <ErrorMessage errors={errors} name={controller.name} />
              </div>
            )}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3">
        <Button type="submit" disabled={isSubmitting} fullWidth className="px-10 py-3">
          Daftar
        </Button>

        <p className="text-sm font-semibold">atau</p>

        <Button onClick={onLoginGoogle} fullWidth variant="outlined" className="flex flex-row items-center justify-center gap-2 px-10 py-3">
          <Icon icon="flat-color-icons:google" width={20} color="#9E9E9E" />

          <span>Daftar dengan Google</span>
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
