import React from 'react';
import { Icon } from '@iconify/react';
// routes
import { paths } from '/src/routes/paths';
// interfaces
import { FormInterface } from '/src/interfaces/form';
import { CurrentUserInterface } from '/src/interfaces/user';
import { AssessmentInterface } from '/src/interfaces/assessment';
// components
import { Button } from '/src/components/button';
import { DialogConfirm } from '/src/components/dialog';
import { twMerge } from 'tailwind-merge';

// ----------------------------------------------------------------------

interface FormListProps {
  forms: FormInterface[];
  assessments: AssessmentInterface[];
  currentUser: CurrentUserInterface | null;
  onDeleteForm: (id: string) => Promise<void>;
}

// ----------------------------------------------------------------------

const FormList: React.FC<FormListProps> = ({ forms, assessments, currentUser, onDeleteForm }) => {
  const assessmentDetailForm = (form: FormInterface) => {
    const filteredForms = assessments?.filter((as) => as.formId === form.id);
    return filteredForms;
  };

  const checkAssessment = (formId: string): boolean => {
    const filteredAssessments = assessments?.find((as) => as.formId === formId && as.email === currentUser?.email);

    if (filteredAssessments) {
      return true;
    }

    return false;
  };

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
      {forms?.map((form, i) => (
        <div key={i} className="flex h-[210px] flex-col justify-between rounded-xl bg-[#EFEFEF] px-5 py-4 shadow-md drop-shadow-md">
          <div className="flex flex-col gap-1">
            <p className="line-clamp-2 text-lg font-semibold leading-tight">{form.title}</p>
            <p className="line-clamp-3 text-sm">{form.desc}</p>
          </div>

          <div className="flex w-full flex-col items-center justify-between gap-3 lg:flex-row lg:gap-5">
            <div className="flex w-full flex-row items-center justify-between gap-5">
              {currentUser?.databaseUsers?.role === 'teacher' && <p className="font-semibold">{assessmentDetailForm(form)?.length} Jawaban</p>}

              {currentUser?.databaseUsers?.role === 'parent' && (
                <div className="flex flex-row items-center justify-center gap-1">
                  <div className={twMerge('aspect-auto h-3 w-3 rounded-full bg-red-500', checkAssessment(form.id) && 'bg-green-500')} />

                  <p className="font-semibold">{checkAssessment(form.id) ? 'Sudah Dijawab' : 'Belum Dijawab'}</p>
                </div>
              )}

              {(currentUser?.databaseUsers?.role === 'teacher' || (currentUser?.databaseUsers?.role === 'parent' && !checkAssessment(form.id))) && (
                <Button component="RouterLink" href={paths.dashboard.form.input(form.id)} variant="gost" className="flex flex-row items-center justify-center gap-1 text-black">
                  <Icon icon="mdi:form" width={20} />
                  <span>Isi Formulir</span>
                </Button>
              )}
            </div>

            {currentUser?.databaseUsers?.role === 'teacher' && (
              <div className="flex w-full flex-1 flex-row-reverse items-center justify-between gap-5 lg:flex-row lg:justify-end">
                <Button component="RouterLink" href={paths.dashboard.form.update(form.id)} variant="gost" className="flex flex-row items-center justify-center gap-1 text-black">
                  <Icon icon="mdi:pencil" width={20} />
                  <span>Edit</span>
                </Button>

                <DialogConfirm
                  label={
                    <div className="flex flex-row items-center justify-center gap-1 text-red-500">
                      <Icon icon="mdi:trash" width={20} />
                      <span>Hapus</span>
                    </div>
                  }
                  title={`Konfirmasi penghapusan "${form.title}"`}
                  action={() => onDeleteForm(form.id)}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormList;
