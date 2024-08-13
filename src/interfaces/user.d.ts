import { User } from 'firebase/auth';

// ----------------------------------------------------------------------

export interface CurrentUserInterface extends User {
  databaseUsers?: UserInterface;
}

export interface UserInterface {
  id: string;
  userId: string;
  studentId: string;
  phoneNumber: string;
  role: RoleTypeUserInterface;
  updatedAt: Date;
  createdAt: Date;
}

export interface PayloadCreateUserInterface {
  userId: string;
  studentId: string;
  phoneNumber: string;
}

export type RoleTypeUserInterface = 'teacher' | 'parent';
