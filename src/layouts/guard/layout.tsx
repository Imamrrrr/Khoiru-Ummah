import React, { useEffect } from 'react';
// hooks
import { useDatabaseUser } from '/src/hooks/use-database-user';
// routes
import { paths } from '/src/routes/paths';
import { useRouter, usePathname } from '/src/routes/hooks';

// ----------------------------------------------------------------------

interface GuardLayoutProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

const GuardLayout: React.FC<GuardLayoutProps> = ({ children }) => {
  const router = useRouter();

  const pathname = usePathname();

  const { currentUser, isLoadingUser } = useDatabaseUser();

  const accessToken = sessionStorage.getItem('accessToken');

  // GUARD
  useEffect(() => {
    if (!isLoadingUser) {
      // LOGOUT
      if (!currentUser && pathname !== paths.auth.login && pathname !== paths.auth.register && accessToken) {
        router.replace(paths.auth.login);
      }

      // FIRST VISIT WEB
      if (!currentUser && pathname !== paths.auth.login && pathname !== paths.auth.register && !accessToken) {
        router.replace(paths.auth.login);
      }

      // TOKEN EXPIRED
      if (currentUser && pathname !== paths.auth.login && pathname !== paths.auth.register && !accessToken) {
        router.replace(paths.auth.login);
      }

      // LOGIN
      if (currentUser && pathname === paths.auth.login && accessToken) {
        router.replace(paths.dashboard.root);
      }
    }
  }, [currentUser, router, pathname, isLoadingUser, accessToken]);

  return <>{children}</>;
};

export default GuardLayout;
