import React, { ReactNode } from 'react';
// _common
import Topbar from '../_common/topbar';
import Footer from '../_common/footer';

// ----------------------------------------------------------------------

interface AuthLayoutProps {
  children: ReactNode;
}

// ----------------------------------------------------------------------

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }: AuthLayoutProps) => {
  return (
    <main className="relative 2xl:container">
      <Topbar />

      <section id="auth-layout-children" className="min-h-screen px-7 pb-[50px] pt-[120px] md:px-10">
        {children}
      </section>

      <Footer />
    </main>
  );
};

export default AuthLayout;
