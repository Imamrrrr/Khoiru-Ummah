import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// context
import { useFormContext } from '/src/context/form';
// routes
import { paths } from '/src/routes/paths';
// interfaces
import { PayloadAssessmentFormInterface, PayloadGeneralFormInterface } from '/src/interfaces/form';
// layouts
import { RoleBasedGuard } from '/src/layouts/guard';
// utils
import { fDecrypt } from '/src/utils/format-encrypt';
// config-global
import { FORM_KEY } from '/src/config-global';
// components
import { Button } from '/src/components/button';
//
import CreateGeneralForm from '../create/create-general-form';
import CreateAssessmentForm from '../create/create-assessment-form';

// ----------------------------------------------------------------------

export interface FormContextStateInterface {
  currentTab: 'general' | 'assessment';
  generalForm: PayloadGeneralFormInterface | null;
  assessmentForm: PayloadAssessmentFormInterface | null;
}

// ----------------------------------------------------------------------

const FormCreateView: React.FC = () => {
  const [formContextState, setFormContextState] = useState<FormContextStateInterface>({
    currentTab: 'general',
    generalForm: null,
    assessmentForm: null,
  });

  const { currentTab, generalForm, assessmentForm, onUpdateCurrentTab, onUpdateGeneralForm, onReset } = useFormContext();

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

  return (
    <RoleBasedGuard>
      <section>
        <div>
          <Button component="RouterLink" href={paths.dashboard.form.root} variant="gost" className="flex flex-row items-center gap-1">
            <Icon icon="ic:round-arrow-back-ios" color="#000" />

            <span className="text-lg font-semibold text-black">Create Form</span>
          </Button>
        </div>

        {currentTab === 'general' && (
          <div className="mt-5 flex w-full flex-col justify-center gap-4 rounded-lg bg-white p-5 shadow-lg drop-shadow-md">
            <div className="flex flex-row items-center justify-between border-b-2 border-black/60 pb-2">
              <p className="text-lg font-semibold">Umum</p>
              <p className="font-inter text-lg font-medium">1/2</p>
            </div>

            <CreateGeneralForm formContextState={formContextState} onUpdateCurrentTab={onUpdateCurrentTab} onUpdateGeneralForm={onUpdateGeneralForm} onReset={onReset} />
          </div>
        )}

        {currentTab === 'assessment' && (
          <div className="mt-5 flex w-full flex-col justify-center gap-4 rounded-lg bg-white p-5 shadow-lg drop-shadow-md">
            <div className="flex flex-row items-center justify-between border-b-2 border-black/60 pb-2">
              <p className="text-lg font-semibold">Penilaian</p>
              <p className="font-inter text-lg font-medium">2/2</p>
            </div>

            <CreateAssessmentForm formContextState={formContextState} onUpdateCurrentTab={onUpdateCurrentTab} onReset={onReset} />
          </div>
        )}
      </section>
    </RoleBasedGuard>
  );
};

export default FormCreateView;
