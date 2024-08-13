import React, { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Icon } from '@iconify/react';
import { useForm, Controller } from 'react-hook-form';
import { v4 } from 'uuid';
// routes
import { paths } from '/src/routes/paths';
import { useRouter } from '/src/routes/hooks';
// interfaces
import { FormInterface, PayloadUpdateFormInterface, QuestionAssessmentFormInterface } from '/src/interfaces/form';
// components
import { Button } from '/src/components/button';
import { useSnackbar } from '/src/components/snackbar';
import { InputField, TextareaField } from '/src/components/form';
//
import { FormContextStateInterface } from '../view/form-update-view';

// ----------------------------------------------------------------------

interface OptionSelectInterface {
  label: string;
  value: string;
}

interface FormData {
  notes: string;
  titleGroup: string;
  questionQuestions: string;
  groupQuestions: OptionSelectInterface | undefined;
  questions: QuestionAssessmentFormInterface[];
}

interface GroupInterface {
  name: string;
  title: string;
}

interface QuestionInterface {
  uid: string;
  groupName: string;
  question: string;
}

interface UpdateAssessmentFormProps {
  formContextState: FormContextStateInterface;
  currentForm: FormInterface | null;
  onReset: () => void;
  onUpdateCurrentTab: (value: 'general' | 'assessment') => void;
  onUpdateForm: (payload: PayloadUpdateFormInterface) => Promise<void>;
}

const customStyleSelect: StylesConfig<string | OptionSelectInterface, boolean> | undefined = {
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

const UpdateAssessmentForm: React.FC<UpdateAssessmentFormProps> = ({ formContextState, currentForm, onUpdateForm, onUpdateCurrentTab, onReset }) => {
  const [groups, setGroups] = useState<GroupInterface[]>([]);

  const [questions, setQuestions] = useState<QuestionInterface[]>([]);

  const [finalQuestions, setFinalQuestions] = useState<QuestionAssessmentFormInterface[]>([]);

  const [groupQuestionOptions, setGroupQuestionOptions] = useState<OptionSelectInterface[]>([]);

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // GET GROUP QUESTION OPTIONS
  useEffect(() => {
    const getGroupQuestionOptions = () => {
      const result = groups?.map((group) => ({ label: `${group.name.toUpperCase()}. ${group.title}`, value: group.name }));

      setGroupQuestionOptions(result);
    };

    getGroupQuestionOptions();

    return () => {
      setGroupQuestionOptions([]);
    };
  }, [groups]);

  // GET FINAL QUESTIONS
  useEffect(() => {
    const getFinalQuestions = () => {
      const result = groups?.reduce((acc: QuestionAssessmentFormInterface[], group) => {
        const filteredQuestions = questions?.filter((question) => question.groupName === group.name)?.map((question) => ({ question: question.question, uid: question.uid }));

        if (filteredQuestions.length > 0) {
          acc.push({
            group: group,
            questions: filteredQuestions,
          });
        }

        return acc;
      }, []);

      setFinalQuestions(result);
    };

    getFinalQuestions();

    return () => {
      setFinalQuestions([]);
    };
  }, [groups, questions]);

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    criteriaMode: 'all',
    defaultValues: {
      notes: '',
      titleGroup: '',
      groupQuestions: undefined,
      questionQuestions: '',
    },
  });

  const values = watch();

  // FORM DEFAULT VALUES
  useEffect(() => {
    if (formContextState?.assessmentForm?.notes) {
      setValue('notes', formContextState.assessmentForm.notes);
    }

    if (formContextState?.assessmentForm?.questions?.length) {
      setFinalQuestions(formContextState.assessmentForm.questions);

      const groups = formContextState.assessmentForm.questions.map((item) => item.group);

      const questions = formContextState.assessmentForm.questions.flatMap((item) =>
        item.questions.map((question) => ({
          ...question,
          groupName: item.group.name,
        }))
      );

      setGroups(groups);

      setQuestions(questions);
    }
  }, [formContextState.assessmentForm, setValue]);

  const handleClickAddGroup = useCallback(() => {
    const alphabet = Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 97));
    const nameGroup = alphabet[groups?.length];

    const result = {
      name: nameGroup,
      title: values.titleGroup,
    };

    setGroups((prev) => [...prev, result]);

    enqueueSnackbar(`Berhasil menambahkan grup ${values.titleGroup}`);

    setValue('titleGroup', '');
  }, [values, groups, setValue, enqueueSnackbar]);

  const handleClickAddQuestion = useCallback(() => {
    const result = {
      uid: v4(),
      question: values.questionQuestions,
      groupName: values.groupQuestions?.value!,
    };

    setQuestions((prev) => [...prev, result]);

    enqueueSnackbar('Berhasil menambahkan pertanyaan');

    setValue('questionQuestions', '');
  }, [values, setValue, enqueueSnackbar]);

  const handleDeleteQuestion = useCallback(
    (uid: string) => {
      const result = questions?.filter((q) => q.uid !== uid);
      setQuestions(result);
    },
    [questions]
  );

  const handleKeyDownEnter = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      return null;
    }
  }, []);

  const handleClickSubmit = useCallback(
    async (data: FormData) => {
      try {
        const formData = {
          id: currentForm?.id!,
          title: formContextState?.generalForm?.title!,
          desc: formContextState?.generalForm?.desc || '',
          class: formContextState?.generalForm?.class!,
          notes: data.notes,
          questions: finalQuestions,
        };

        await onUpdateForm(formData);

        onReset();

        enqueueSnackbar('Formulir berhasil dibuat');

        router.push(paths.dashboard.form.root);
      } catch (error: any) {
        enqueueSnackbar(error.message, { variant: 'error' });
        console.error(error);
      }
    },
    [onUpdateForm, enqueueSnackbar, onReset, router, finalQuestions, currentForm, formContextState?.generalForm]
  );

  return (
    <form onSubmit={handleSubmit(handleClickSubmit)}>
      {/* NOTES */}
      <TextareaField label="Catatan" rows={4} placeholder="Masukan catatan (opsional)" {...register('notes')} />

      {/* GROUP */}
      <div className="mt-4 flex flex-col gap-3">
        <InputField {...register('titleGroup')} onKeyDown={handleKeyDownEnter} label="Grup" placeholder="Masukan judul grup" />

        <Button onClick={handleClickAddGroup} fullWidth disabled={isSubmitting || !values.titleGroup} className="flex flex-row items-center justify-center gap-2">
          <Icon icon="mingcute:add-fill" color="#FFF" />
          <span>Tambah Grup</span>
        </Button>
      </div>

      {/* QUESTIONS */}
      <div className="mt-4 flex flex-col gap-3">
        <InputField {...register('questionQuestions')} onKeyDown={handleKeyDownEnter} label="Pertanyaan" placeholder="Masukan pertanyaan" />

        <div className="flex flex-col gap-1">
          <p className="text-sm text-[#404040]">Grup Pertanyaan</p>

          <Controller
            control={control}
            name="groupQuestions"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Pilih grup pertanyaan"
                options={groupQuestionOptions}
                onChange={onChange}
                onKeyDown={handleKeyDownEnter}
                value={value}
                styles={customStyleSelect}
                components={{
                  IndicatorSeparator: () => null,
                }}
              />
            )}
          />
        </div>

        <Button onClick={handleClickAddQuestion} fullWidth disabled={isSubmitting || !values.questionQuestions || !values.groupQuestions} className="flex flex-row items-center justify-center gap-2">
          <Icon icon="mingcute:add-fill" color="#FFF" />
          <span>Tambah Pertanyaan</span>
        </Button>
      </div>

      {/* LIST QUESTIONS */}
      <div className="mt-4 flex flex-col gap-4 border-y-2 border-dashed border-neutral-400 py-4">
        <p className="text-lg font-semibold">Daftar Pertanyaan</p>

        {finalQuestions?.length ? (
          finalQuestions.map((q, i) => (
            <div key={i} className="flex flex-col gap-2">
              <p className="text-lg font-semibold">
                {q.group.name.toUpperCase()}. {q.group.title}
              </p>

              <div className="flex flex-col gap-1">
                {q.questions?.map((qs, i) => (
                  <div key={i} className="flex flex-row items-center gap-1">
                    <p>
                      {i + 1}. {qs.question}
                    </p>

                    <Button onClick={() => handleDeleteQuestion(qs.uid)} disabled={isSubmitting} variant="gost">
                      <Icon icon="mdi:trash" width={20} className="text-red-500 hover:text-red-500/80" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>Belum ada pertanyaan yang ditambahkan.</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 md:flex-row">
        <Button onClick={() => onUpdateCurrentTab('general')} disabled={isSubmitting} className="flex w-full flex-row items-center justify-center gap-2 md:w-fit">
          <Icon icon="ic:round-arrow-back-ios" color="#FFF" />
          <span>Kembali</span>
        </Button>

        <div className="flex w-full flex-col-reverse items-center justify-end gap-3 md:flex-row">
          <Button
            onClick={() => {
              reset();
              onReset();
            }}
            disabled={isSubmitting}
            className="w-full bg-neutral-500 hover:bg-neutral-500/80 md:w-fit"
          >
            Reset
          </Button>

          <Button type="submit" disabled={isSubmitting || !finalQuestions?.length} className="flex w-full flex-row items-center justify-center gap-2 md:w-fit">
            <span>Simpan Perubahan</span>
            <Icon icon="ic:round-arrow-forward-ios" color="#FFF" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateAssessmentForm;
