export interface FormInterface {
  id: string;
  title: string;
  desc: string;
  class: string[];
  notes: string;
  questions: QuestionAssessmentFormInterface[];
  updatedAt: Date;
  createdAt: Date;
}

export interface PayloadCreateFormInterface {
  title: string;
  desc: string;
  class: string[];
  notes: string;
  questions: QuestionAssessmentFormInterface[];
}

export interface PayloadUpdateFormInterface {
  id: string;
  title?: string;
  desc?: string;
  class?: string[];
  notes?: string;
  questions?: QuestionAssessmentFormInterface[];
}

export interface PayloadGeneralFormInterface {
  title: string;
  desc: string;
  class: string[];
}

export interface PayloadAssessmentFormInterface {
  notes: string;
  questions: QuestionAssessmentFormInterface[];
}

export interface QuestionAssessmentFormInterface {
  group: {
    name: string;
    title: string;
  };
  questions: {
    uid: string;
    question: string;
  }[];
}
