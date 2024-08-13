import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import { GuardLayout } from '/src/layouts/guard';
import { DashboardLayout } from '/src/layouts/dashboard';
// components
import { LoadingScreen } from '/src/components/loading-screen';
// pages
const DashboardHomePage = lazy(() => import('/src/pages/dashboard/home/app'));
const DashboardProfilePage = lazy(() => import('/src/pages/dashboard/profile/app'));
const DashboardStudentPage = lazy(() => import('/src/pages/dashboard/student/app'));
const DashboardCreateStudentPage = lazy(() => import('/src/pages/dashboard/student/create'));
const DashboardUpdateStudentPage = lazy(() => import('/src/pages/dashboard/student/update'));
const DashboardFormPage = lazy(() => import('/src/pages/dashboard/form/app'));
const DashboardInputFormPage = lazy(() => import('/src/pages/dashboard/form/input'));
const DashboardCreateFormPage = lazy(() => import('/src/pages/dashboard/form/create'));
const DashboardUpdateFormPage = lazy(() => import('/src/pages/dashboard/form/update'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <GuardLayout>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </GuardLayout>
    ),
    children: [
      { element: <DashboardHomePage />, index: true },
      {
        path: 'form',
        children: [
          { element: <DashboardFormPage />, index: true },
          { path: 'create', element: <DashboardCreateFormPage /> },
          { path: ':slug/input', element: <DashboardInputFormPage /> },
          { path: ':slug/update', element: <DashboardUpdateFormPage /> },
        ],
      },
      {
        path: 'student',
        children: [
          { element: <DashboardStudentPage />, index: true },
          { path: 'create', element: <DashboardCreateStudentPage /> },
          { path: ':slug/update', element: <DashboardUpdateStudentPage /> },
        ],
      },
      {
        path: 'profile',
        children: [{ element: <DashboardProfilePage />, index: true }],
      },
    ],
  },
];
