import React, { useCallback } from 'react';
import { Icon } from '@iconify/react';
// routes
import { paths } from '/src/routes/paths';
// hooks
import { useResponsive } from '/src/hooks/use-responsive';
import { useDatabaseUser } from '/src/hooks/use-database-user';
// components
import { Image } from '/src/components/image';
import { Button } from '/src/components/button';

// ----------------------------------------------------------------------

const Topbar: React.FC = () => {
  const { mdUp } = useResponsive();

  const { currentUser, isLoadingUser } = useDatabaseUser();

  const accessToken = sessionStorage.getItem('accessToken');

  const handleClickOpenSidebar = useCallback(() => {
    const sidebarMenu = document.getElementById('dashboard-navigation-sidebar');
    const topbarMenu = document.getElementById('dashboard-navigation-topbar');
    const dashboardLayoutChildren = document.getElementById('dashboard-layout-children');

    sidebarMenu?.classList.remove('hidden');

    topbarMenu?.classList.add('blur-sm');
    topbarMenu?.classList.add('brightness-75');

    dashboardLayoutChildren?.classList.add('blur-sm');
    dashboardLayoutChildren?.classList.add('brightness-75');
  }, []);

  return (
    <nav
      id="dashboard-navigation-topbar"
      className="fixed z-[999] flex h-[80px] w-full flex-row items-center justify-between border-b-2 border-black/20 bg-white px-7 transition-all duration-300 2xl:container md:px-10"
    >
      <div className="flex flex-row items-center justify-center gap-3">
        <Button id="buttonOpenSidebar" onClick={handleClickOpenSidebar} variant="gost" className="lg:hidden">
          <Icon icon="mdi:hamburger-menu" width={32} className="text-neutral-700" />
        </Button>

        <Button component="RouterLink" href={paths.main.root} variant="gost" className="flex items-center justify-center gap-3">
          <Image src={mdUp ? '/favicon/logo_full.png' : '/favicon/logo_single.png'} alt="khoiru-ummah" className="h-[40px] w-[40px] object-cover md:h-[50px] md:w-[200px]" />
        </Button>
      </div>

      {!isLoadingUser &&
        (currentUser && accessToken ? (
          <Button component="RouterLink" href={paths.dashboard.root} variant="gost" className="flex max-w-[150px] flex-row items-center justify-center gap-3 md:max-w-[250px] lg:max-w-[300px]">
            <div className="flex h-10 min-h-10 w-10 min-w-10 items-center justify-center overflow-hidden rounded-full border border-neutral-500 bg-white">
              <Image src={currentUser.photoURL || '/assets/images/image-7.png'} alt="me" className="h-full w-full" />
            </div>

            <div className="flex flex-col items-start truncate">
              <p className="w-full truncate text-left font-semibold text-black">{currentUser.displayName}</p>
              <p className="text-sm text-[#ACACAC]">{(currentUser.databaseUsers?.role === 'parent' && 'Orang Tua') || (currentUser.databaseUsers?.role === 'teacher' && 'Guru')}</p>
            </div>
          </Button>
        ) : (
          <div className="flex flex-row items-center justify-center gap-7">
            <Button component="RouterLink" href={paths.auth.login} variant="gost" className="text-[#474747]">
              Masuk
            </Button>

            <Button component="RouterLink" href={paths.auth.register} variant="outlined" className="hidden rounded-none md:block">
              Daftar
            </Button>
          </div>
        ))}
    </nav>
  );
};

export default Topbar;
