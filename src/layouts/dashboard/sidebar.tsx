import React, { useCallback, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { twMerge } from 'tailwind-merge';
// context
import { useUserContext } from '/src/context/user';
// hooks
import { useDatabaseUser } from '/src/hooks/use-database-user';
// routes
import { paths } from '/src/routes/paths';
import { usePathname } from '/src/routes/hooks';
// components
import { Image } from '/src/components/image';
import { Button } from '/src/components/button';
//
import { configNavigation, ConfigNavigationInterface } from './config-navigation';

// ----------------------------------------------------------------------

const Sidebar: React.FC = () => {
  const [menuBar, setMenuBar] = useState<ConfigNavigationInterface[]>([]);

  const pathname = usePathname();

  const { onLogout } = useUserContext();

  const { currentUser } = useDatabaseUser();

  // GET MENU BAR
  useEffect(() => {
    const getMenuBar = () => {
      if (currentUser?.databaseUsers?.role === 'parent') {
        const filteredCN = configNavigation?.filter((menu) => menu.title !== 'Students');

        setMenuBar(filteredCN);
      } else {
        setMenuBar(configNavigation);
      }
    };

    getMenuBar();
    return () => {
      setMenuBar([]);
    };
  }, [currentUser]);

  const handleClickHideSidebar = useCallback(() => {
    const sidebarMenu = document.getElementById('dashboard-navigation-sidebar');
    const topbarMenu = document.getElementById('dashboard-navigation-topbar');
    const dashboardLayoutChildren = document.getElementById('dashboard-layout-children');

    sidebarMenu?.classList.add('hidden');

    topbarMenu?.classList.remove('blur-sm');
    topbarMenu?.classList.remove('brightness-75');

    dashboardLayoutChildren?.classList.remove('blur-sm');
    dashboardLayoutChildren?.classList.remove('brightness-75');
  }, []);

  const searchBasePath = (fullPath: string) => {
    return `/${fullPath.split('/')?.[2]}`;
  };

  return (
    <nav
      id="dashboard-navigation-sidebar"
      className="fixed z-[1000] hidden h-screen w-full border-r-2 border-black/20 bg-white px-7 pb-6 pt-[104px] md:w-[80%] md:px-10 lg:z-[998] lg:block lg:w-[284px]"
    >
      <div className="">
        <Button component="RouterLink" href={paths.main.root} variant="gost" className="absolute left-[38px] top-[30px] flex items-center justify-center gap-3">
          <Image src="/favicon/logo_single.png" alt="khoiru-ummah" className="h-[32px] w-[32px]" />
        </Button>

        <Button id="buttonHideSidebar" onClick={handleClickHideSidebar} variant="gost" className="absolute right-[28px] top-[30px] block lg:hidden">
          <Icon icon="mdi:hamburger-open" width={32} className="text-neutral-700" />
        </Button>
      </div>

      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-5">
          {menuBar?.map((menu, i) => (
            <Button
              key={i}
              component="RouterLink"
              href={menu.path}
              variant="gost"
              className={twMerge(
                'flex flex-row items-center justify-center gap-2 text-[#ACACAC]',
                (pathname === menu.path || searchBasePath(pathname) === searchBasePath(menu.path)) && 'text-primary-1'
              )}
            >
              <Icon icon={menu.icon} width={20} />
              <span className="">{menu.title}</span>
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            component="RouterLink"
            href={paths.dashboard.profile.root}
            variant="outlined"
            className={twMerge(
              'flex w-full flex-row items-center justify-center gap-2 border-[#ACACAC] text-[#ACACAC]',
              pathname === paths.dashboard.profile.root && 'border-primary-1 text-primary-1'
            )}
          >
            <span className="">Profile</span>
            <Icon icon="mingcute:user-setting-fill" width={20} />
          </Button>

          <Button onClick={onLogout} className="flex w-full flex-row items-center justify-center gap-2 bg-[#FF002E] hover:bg-[#FF002E]/80">
            <span className="">Keluar</span>
            <Icon icon="uil:exit" width={20} />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
