import { CurrentUserInterface } from './user';

// ----------------------------------------------------------------------

export interface PayloadLoginEmailAuthInterface {
  email: string;
  password: string;
}

export interface PayloadRegisterAuthInterface {
  fullName: string;
  email: string;
  password: string;
  studentId: string;
  phoneNumber: string;
  role: RoleTypeAuthInterface;
}

export interface PayloadUpdateAuthInterface {
  currentUser: CurrentUserInterface;
  fullName: string;
  studentId?: string;
  phoneNumber?: string;
  role?: RoleTypeAuthInterface;
}

export type RoleTypeAuthInterface = 'teacher' | 'parent';
