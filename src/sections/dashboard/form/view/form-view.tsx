import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// context
import { useFormContext } from '/src/context/form';
// hooks
import { useDatabaseForm } from '/src/hooks/use-database-form';
import { useDatabaseUser } from '/src/hooks/use-database-user';
import { useDatabaseStudent } from '/src/hooks/use-database-student';
import { useDatabaseAssessment } from '/src/hooks/use-database-assessment';
// interfaces
import { FormInterface } from '/src/interfaces/form';
// routes
import { paths } from '/src/routes/paths';
// components
import { Button } from '/src/components/button';
//
import FormList from '../form-list';

// ----------------------------------------------------------------------

const FormView: React.FC = () => {
  const [parentForms, setParentForms] = useState<FormInterface[]>([]);

  const { forms, onDeleteForm } = useDatabaseForm();

  const { currentUser } = useDatabaseUser();

  const { assessments } = useDatabaseAssessment();

  const { students } = useDatabaseStudent();

  const { onReset } = useFormContext();

  // RESET CONTEXT
  useEffect(() => {
    onReset();
  }, [onReset]);

  // GET PARENT FORMS
  useEffect(() => {
    const getParentForms = () => {
      const filteredStudent = students?.find((std) => std.id === currentUser?.databaseUsers?.studentId);

      if (filteredStudent) {
        const filteredForms = forms?.filter((form) => form?.class?.includes(filteredStudent.class));
        setParentForms(filteredForms);
      }
    };

    getParentForms();

    return () => {
      setParentForms([]);
    };
  }, [students, forms, currentUser]);

  return (
    <section>
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Forms</p>
        </div>

        {currentUser?.databaseUsers?.role === 'teacher' && (
          <Button component="RouterLink" href={paths.dashboard.form.create} className="flex flex-row items-center justify-center gap-2">
            <Icon icon="mingcute:add-fill" />
            <span>Buat Formulir</span>
          </Button>
        )}
      </div>

      {currentUser?.databaseUsers && (
        <FormList forms={currentUser.databaseUsers.role === 'teacher' ? forms : parentForms} assessments={assessments} currentUser={currentUser} onDeleteForm={onDeleteForm} />
      )}
    </section>
  );
};

export default FormView;
