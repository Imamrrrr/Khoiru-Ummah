export const paths = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  main: {
    root: '/',
  },
  dashboard: {
    root: '/dashboard',
    form: {
      root: '/dashboard/form',
      create: '/dashboard/form/create',
      input: (slug: string) => `/dashboard/form/${slug}/input`,
      update: (slug: string) => `/dashboard/form/${slug}/update`,
    },
    student: {
      root: '/dashboard/student',
      create: '/dashboard/student/create',
      update: (slug: string) => `/dashboard/student/${slug}/update`,
    },
    profile: {
      root: '/dashboard/profile',
    },
  },
} as const;
