import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import { AuthLayout } from '/src/layouts/auth';
import { GuardLayout } from '/src/layouts/guard';
// components
import { LoadingScreen } from '/src/components/loading-screen';
// pages
const LoginPage = lazy(() => import('/src/pages/auth/login/app'));
const RegisterPage = lazy(() => import('/src/pages/auth/register/app'));

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <GuardLayout>
        <AuthLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </AuthLayout>
      </GuardLayout>
    ),
    children: [
      {
        path: 'login',
        children: [{ element: <LoginPage />, index: true }],
      },
      {
        path: 'register',
        children: [{ element: <RegisterPage />, index: true }],
      },
    ],
  },
];
