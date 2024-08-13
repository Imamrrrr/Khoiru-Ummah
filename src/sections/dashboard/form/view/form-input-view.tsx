import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// hooks
import { useDatabaseUser } from '/src/hooks/use-database-user';
import { useDatabaseForm } from '/src/hooks/use-database-form';
import { useDatabaseStudent } from '/src/hooks/use-database-student';
import { useDatabaseAssessment } from '/src/hooks/use-database-assessment';
// routes
import { paths } from '/src/routes/paths';
// interfaces
import { FormInterface, PayloadAssessmentFormInterface, PayloadGeneralFormInterface } from '/src/interfaces/form';
// components
import { Button } from '/src/components/button';
//
import InputForm from '../input/input-form';

// ----------------------------------------------------------------------

export interface FormContextStateInterface {
  currentTab: 'general' | 'assessment';
  generalForm: PayloadGeneralFormInterface | null;
  assessmentForm: PayloadAssessmentFormInterface | null;
}

// ----------------------------------------------------------------------

interface FormInputViewProps {
  slug: string;
}

// ----------------------------------------------------------------------

const FormInputView: React.FC<FormInputViewProps> = ({ slug }) => {
  const [currentForm, setCurrentForm] = useState<FormInterface | null>(null);

  const { forms } = useDatabaseForm();

  const { currentUser } = useDatabaseUser();

  const { students } = useDatabaseStudent();

  const { onCreateAssessment } = useDatabaseAssessment();

  // GET CURRENT FORM
  useEffect(() => {
    const getCurrentForm = () => {
      const filteredForms = forms?.find((form) => form.id === slug);

      if (filteredForms) {
        setCurrentForm(filteredForms);
      }
    };

    getCurrentForm();

    return () => {
      setCurrentForm(null);
    };
  }, [forms, slug]);

  return (
    <section>
      <div>
        <Button component="RouterLink" href={paths.dashboard.form.root} variant="gost" className="flex flex-row items-center gap-1">
          <Icon icon="ic:round-arrow-back-ios" color="#000" />

          <span className="text-lg font-semibold text-black">Input Form</span>
        </Button>
      </div>

      {currentForm && currentUser && <InputForm currentForm={currentForm} currentUser={currentUser} students={students} onCreateAssessment={onCreateAssessment} />}
    </section>
  );
};

export default FormInputView;
