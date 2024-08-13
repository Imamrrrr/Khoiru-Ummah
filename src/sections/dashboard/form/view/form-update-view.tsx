import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// context
import { useFormContext } from '/src/context/form';
// hooks
import { useDatabaseForm } from '/src/hooks/use-database-form';
// routes
import { paths } from '/src/routes/paths';
// layouts
import { RoleBasedGuard } from '/src/layouts/guard';
// interfaces
import { FormInterface, PayloadAssessmentFormInterface, PayloadGeneralFormInterface } from '/src/interfaces/form';
// utils
import { fDecrypt } from '/src/utils/format-encrypt';
// config-global
import { FORM_KEY } from '/src/config-global';
// components
import { Button } from '/src/components/button';
//
import UpdateGeneralForm from '../update/update-general-form';
import UpdateAssessmentForm from '../update/update-assessment-form';

// ----------------------------------------------------------------------

export interface FormContextStateInterface {
  currentTab: 'general' | 'assessment';
  generalForm: PayloadGeneralFormInterface | null;
  assessmentForm: PayloadAssessmentFormInterface | null;
}

// ----------------------------------------------------------------------

interface FormUpdateViewProps {
  slug: string;
}

// ----------------------------------------------------------------------

const FormUpdateView: React.FC<FormUpdateViewProps> = ({ slug }) => {
  const [formContextState, setFormContextState] = useState<FormContextStateInterface>({
    currentTab: 'general',
    generalForm: null,
    assessmentForm: null,
  });

  const [currentForm, setCurrentForm] = useState<FormInterface | null>(null);

  const { currentTab, generalForm, assessmentForm, onUpdateCurrentTab, onUpdateGeneralForm, onUpdateAssessmentForm, onReset } = useFormContext();

  const { forms, onUpdateForm } = useDatabaseForm();

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

  // GET FORM CONTEXT STATE
  useEffect(() => {
    const getFormContextState = () => {
      if (currentTab) {
        setFormContextState((prev) => ({ ...prev, currentTab }));
      }

      if (generalForm) {
        const generalFormDecrypted: PayloadGeneralFormInterface = fDecrypt(generalForm, FORM_KEY);
        setFormContextState((prev) => ({ ...prev, generalForm: generalFormDecrypted }));
      }

      if (assessmentForm) {
        const assessmentFormDecrypted: PayloadAssessmentFormInterface = fDecrypt(assessmentForm, FORM_KEY);
        setFormContextState((prev) => ({ ...prev, assessmentForm: assessmentFormDecrypted }));
      }
    };

    getFormContextState();

    return () => {
      setFormContextState({ currentTab: 'general', generalForm: null, assessmentForm: null });
    };
  }, [currentTab, generalForm, assessmentForm]);

  // UPDATE GENERAL FORM AND ASSESSMENT FORM
  useEffect(() => {
    const updateAllForm = () => {
      if (currentForm) {
        const generalFormResult = {
          title: currentForm.title,
          desc: currentForm.desc,
          class: currentForm.class,
        };

        const assessmentFormResult = {
          notes: currentForm.notes,
          questions: currentForm.questions,
        };

        onUpdateGeneralForm(generalFormResult);
        onUpdateAssessmentForm(assessmentFormResult);
      }
    };

    updateAllForm();
  }, [currentForm, onUpdateAssessmentForm, onUpdateGeneralForm]);

  return (
    <RoleBasedGuard>
      <section>
        <div>
          <Button component="RouterLink" href={paths.dashboard.form.root} variant="gost" className="flex flex-row items-center gap-1">
            <Icon icon="ic:round-arrow-back-ios" color="#000" />

            <span className="text-lg font-semibold text-black">Update Form</span>
          </Button>
        </div>

        {currentForm && currentTab === 'general' && (
          <div className="mt-5 flex w-full flex-col justify-center gap-4 rounded-lg bg-white p-5 shadow-lg drop-shadow-md">
            <div className="flex flex-row items-center justify-between border-b-2 border-black/60 pb-2">
              <p className="text-lg font-semibold">Umum</p>
              <p className="font-inter text-lg font-medium">1/2</p>
            </div>

            <UpdateGeneralForm formContextState={formContextState} onUpdateCurrentTab={onUpdateCurrentTab} onUpdateGeneralForm={onUpdateGeneralForm} />
          </div>
        )}

        {currentForm && currentTab === 'assessment' && (
          <div className="mt-5 flex w-full flex-col justify-center gap-4 rounded-lg bg-white p-5 shadow-lg drop-shadow-md">
            <div className="flex flex-row items-center justify-between border-b-2 border-black/60 pb-2">
              <p className="text-lg font-semibold">Penilaian</p>
              <p className="font-inter text-lg font-medium">2/2</p>
            </div>

            <UpdateAssessmentForm formContextState={formContextState} currentForm={currentForm} onUpdateForm={onUpdateForm} onUpdateCurrentTab={onUpdateCurrentTab} onReset={onReset} />
          </div>
        )}
      </section>
    </RoleBasedGuard>
  );
};

export default FormUpdateView;
