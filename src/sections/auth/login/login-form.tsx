import React, { useCallback, useState } from 'react';
import { Icon } from '@iconify/react';
import { useForm, Controller, RegisterOptions } from 'react-hook-form';
// context
import { useUserContext } from '/src/context/user';
// components
import { Button } from '/src/components/button';
import { useSnackbar } from '/src/components/snackbar';
import { InputField, ErrorMessage } from '/src/components/form';

// ----------------------------------------------------------------------

interface FormData {
  email: string;
  password: string;
}

// ----------------------------------------------------------------------

const LoginForm: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const { onLoginEmail, onLoginGoogle } = useUserContext();

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  });

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
        };

        await onLoginEmail(formData);
        reset();
      } catch (error: any) {
        if (error.message === 'FirebaseError: Firebase: Error (auth/invalid-credential).') {
          enqueueSnackbar('Email atau kata sandi salah', { variant: 'error' });
        } else {
          enqueueSnackbar(error.message, { variant: 'error' });
        }

        console.error(error);
      }
    },
    [onLoginEmail, enqueueSnackbar, reset]
  );

  const controllers: { name: 'email' | 'password'; rules: RegisterOptions<FormData> }[] = [
    {
      name: 'email',
      rules: { required: 'Harap isi bidang email.' },
    },
    {
      name: 'password',
      rules: {
        required: 'Harap isi bidang kata sandi.',
        validate: {
          notEmpty: (value) => value.trim() !== '' || 'Kata sandi tidak valid.',
          minLength: (value) => value.length >= 6 || 'Kata sandi harus minimal 6 karakter.',
        },
      },
    },
  ];

  return (
    <form onSubmit={handleSubmit(handleClickSubmit)} className="flex w-full flex-col justify-center gap-4">
      {controllers.map((controller, index) => (
        <Controller
          key={index}
          control={control}
          name={controller.name}
          rules={controller.rules}
          render={({ field: { onChange, value } }) => (
            <div>
              {controller.name === 'email' && <InputField label="Email" onChange={onChange} type="email" value={value as string} name={controller.name} placeholder="Masukan email" />}

              {controller.name === 'password' && (
                <div className="relative">
                  <InputField label="Kata Sandi" onChange={onChange} type="password" value={value as string} name={controller.name} placeholder="Masukan kata sandi" inputClassname="pr-10" />

                  <Button onClick={handleClickViewHidePassword} variant="gost" className="absolute right-2 top-[69%] -translate-y-[50%] bg-transparent p-0 md:top-[68%] md:p-0 lg:top-[67%] lg:p-0">
                    <Icon icon={!isPasswordVisible ? 'heroicons:eye-20-solid' : 'heroicons:eye-slash-20-solid'} width={20} color="#9E9E9E" />
                  </Button>
                </div>
              )}

              <ErrorMessage errors={errors} name={controller.name} />
            </div>
          )}
        />
      ))}

      <div className="flex w-full justify-end">
        <Button variant="gost" className="text-right font-inter text-sm font-normal text-[#757575]">
          Lupa password?
        </Button>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3">
        <Button type="submit" disabled={isSubmitting} fullWidth className="py-3">
          Masuk
        </Button>

        <p className="text-sm font-semibold">atau</p>

        <Button onClick={onLoginGoogle} fullWidth variant="outlined" className="flex flex-row items-center justify-center gap-2 py-3">
          <Icon icon="flat-color-icons:google" width={20} color="#9E9E9E" />

          <span>Masuk dengan Google</span>
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
