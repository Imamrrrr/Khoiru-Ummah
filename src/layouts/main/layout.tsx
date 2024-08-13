import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { twMerge } from 'tailwind-merge';
// components
import { Button } from '/src/components/button';
//
import Topbar from '../_common/topbar';
import Footer from '../_common/footer';

// ----------------------------------------------------------------------

interface MainLayoutProps {
  children: ReactNode;
}

// ----------------------------------------------------------------------

const MainLayout: React.FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
  const [yOffset, setYOffset] = useState<number>(0);

  // ON SCROLL
  useEffect(() => {
    const handleScroll = () => {
      setYOffset(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setYOffset]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative 2xl:container">
      <Topbar />

      <section
        id="main-layout-children"
        style={{ backgroundImage: "url('/assets/background/bg-3.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        className="min-h-screen px-7 pb-[50px] pt-[120px] md:px-10"
      >
        {children}
      </section>

      <Button
        onClick={handleScrollToTop}
        className={twMerge('fixed bottom-5 right-5 z-50 cursor-default rounded-full p-3 opacity-0 drop-shadow-md delay-100', yOffset && 'cursor-pointer opacity-100')}
      >
        <Icon icon="icon-park-outline:to-top" color="#fff" width={24} />
      </Button>

      <Footer />
    </main>
  );
};

export default MainLayout;
