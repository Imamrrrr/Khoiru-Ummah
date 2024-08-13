import React, { ReactNode, useEffect } from 'react';
// routes
import { paths } from '/src/routes/paths';
import { usePathname, useRouter } from '/src/routes/hooks';
// hooks
import { useDatabaseUser } from '/src/hooks/use-database-user';
//
import Topbar from './topbar';
import Footer from './footer';
import Sidebar from './sidebar';

// ----------------------------------------------------------------------

interface DashboardLayoutProps {
  children: ReactNode;
}

// ----------------------------------------------------------------------

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();

  const pathname = usePathname();

  const { currentUser, isLoadingUser } = useDatabaseUser();

  const accessToken = sessionStorage.getItem('accessToken');

  // REDIRECT PROFILE PAGE IF ROLE UNDEFINED
  useEffect(() => {
    if (!isLoadingUser) {
      if (accessToken && !currentUser?.databaseUsers?.role && pathname !== paths.dashboard.profile.root) {
        router.replace(paths.dashboard.profile.root);
      }
    }
  }, [accessToken, currentUser?.databaseUsers?.role, router, isLoadingUser, pathname]);

  return (
    <main className="relative 2xl:container">
      <Topbar />
      <Sidebar />

      <section id="dashboard-layout-children" className="min-h-screen px-7 pb-[50px] pt-[100px] md:px-10 lg:ml-[284px]">
        {children}
      </section>

      <Footer />
    </main>
  );
};

export default DashboardLayout;
