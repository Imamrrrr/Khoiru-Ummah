import React from 'react';
import { Icon } from '@iconify/react';
// routes
import { paths } from '/src/routes/paths';
// hooks
import { useDatabaseUser } from '/src/hooks/use-database-user';
// components
import { Button } from '/src/components/button';
import { LoadingScreen } from '/src/components/loading-screen';

// ----------------------------------------------------------------------

interface RoleBasedGuardProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

const RoleBasedGuard: React.FC<RoleBasedGuardProps> = ({ children }) => {
  const { currentUser, isLoadingUser } = useDatabaseUser();

  if (!isLoadingUser) {
    if (currentUser?.databaseUsers?.role !== 'teacher') {
      return (
        <section className="flex min-h-[75vh] flex-col items-center justify-center gap-4">
          <Icon icon="solar:lock-keyhole-broken" width={40} color="#000" />

          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-center">Maaf, halaman ini tidak bisa anda akses.</p>
            <Button component="RouterLink" href={paths.auth.login} className="px-12">
              Kembali
            </Button>
          </div>
        </section>
      );
    }

    return <>{children}</>;
  } else {
    return <LoadingScreen />;
  }
};

export default RoleBasedGuard;
