export interface AssessmentInterface {
  id: string;
  formId: string;
  studentName: string;
  name: string;
  email: string;
  role: RoleTypeAssessmentInterface;
  class: string;
  phoneNumber: string;
  questionPoints: QuestionPoinAssessmentInterface[];
  updatedAt: Date;
  createdAt: Date;
}

export interface PayloadCreateAssessmentInterface {
  formId: string;
  studentName: string;
  name: string;
  email: string;
  role: RoleTypeAssessmentInterface;
  class: string;
  phoneNumber: string;
  questionPoints: QuestionPoinAssessmentInterface[];
}

export interface PayloadUpdateAssessmentInterface {
  id: string;
  studentName?: string;
  name?: string;
  email?: string;
  role: RoleTypeAssessmentInterface;
  class?: string;
  phoneNumber?: string;
  questionPoints?: QuestionPoinAssessmentInterface[];
}

export interface QuestionPoinAssessmentInterface {
  group: {
    name: string;
    title: string;
  };
  accumulationPoints: number;
  questions: {
    uid: string;
    question: string;
    point: number;
  }[];
}

export type RoleTypeAssessmentInterface = 'teacher' | 'parent';
