import React, { useCallback } from 'react';
import { useForm, Controller, RegisterOptions } from 'react-hook-form';
// interfaces
import { PayloadUpdateStudentInterface, StudentInterface } from '/src/interfaces/student';
// routes
import { paths } from '/src/routes/paths';
import { useRouter } from '/src/routes/hooks';
// components
import { Button } from '/src/components/button';
import { useSnackbar } from '/src/components/snackbar';
import { InputField, ErrorMessage } from '/src/components/form';

// ----------------------------------------------------------------------

interface FormData {
  nis: string;
  name: string;
  class: string;
}

interface UpdateFormProps {
  currentStudent: StudentInterface | null;
  onUpdateStudent: (payload: PayloadUpdateStudentInterface) => Promise<void>;
}

// ----------------------------------------------------------------------

const UpdateForm: React.FC<UpdateFormProps> = ({ currentStudent, onUpdateStudent }) => {
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    criteriaMode: 'all',
    defaultValues: {
      nis: currentStudent?.nis || '',
      name: currentStudent?.name || '',
      class: currentStudent?.class || '',
    },
  });

  const handleClickSubmit = useCallback(
    async (data: FormData) => {
      try {
        const formData = {
          id: currentStudent?.id!,
          nis: data.nis.trim(),
          name: data.name.trim(),
          class: data.class.trim(),
        };

        await onUpdateStudent(formData);

        enqueueSnackbar('Siswa berhasil diperbarui');
        reset();
        router.push(paths.dashboard.student.root);
      } catch (error: any) {
        enqueueSnackbar(error.message, { variant: 'error' });
        console.error(error);
      }
    },
    [enqueueSnackbar, reset, router, onUpdateStudent, currentStudent]
  );

  const controllers: {
    name: 'nis' | 'name' | 'class';
    rules: RegisterOptions<FormData>;
  }[] = [
    {
      name: 'nis',
      rules: { required: 'Harap isi bidang NIS.' },
    },
    {
      name: 'name',
      rules: { required: 'Harap isi bidang nama lengkap.' },
    },
    {
      name: 'class',
      rules: { required: 'Harap isi bidang kelas.' },
    },
  ];

  return (
    <form onSubmit={handleSubmit(handleClickSubmit)} className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-5 shadow-lg drop-shadow-md">
      <div className="grid w-full grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
        {controllers.map((controller, index) => (
          <Controller
            key={index}
            control={control}
            name={controller.name}
            rules={controller.rules}
            render={({ field: { onChange, value } }) => (
              <div>
                {controller.name === 'nis' && <InputField label="NIS (Nomor Induk Siswa)" onChange={onChange} value={value as string} name={controller.name} placeholder="Masukan NIS" />}

                {controller.name === 'name' && <InputField label="Nama Lengkap" onChange={onChange} value={value as string} name={controller.name} placeholder="Masukan nama lengkap" />}

                {controller.name === 'class' && <InputField label="Kelas" onChange={onChange} value={value as string} name={controller.name} placeholder="Masukan kelas" />}

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

export default UpdateForm;
