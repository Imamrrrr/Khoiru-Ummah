export interface StudentInterface {
  id: string;
  nis: string;
  name: string;
  class: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface PayloadCreateStudentInterface {
  nis: string;
  name: string;
  class: string;
}

export interface PayloadUpdateStudentInterface {
  id: string;
  nis?: string;
  name?: string;
  class?: string;
}
