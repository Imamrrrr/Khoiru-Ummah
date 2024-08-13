import React from 'react';
// routes
import { paths } from '/src/routes/paths';
// components
import { Button } from '/src/components/button';
//
import LoginForm from '../login-form';

// ----------------------------------------------------------------------

const LoginView: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-10">
      <div className="flex w-full flex-col items-center gap-6 rounded-[21px] bg-white p-5 shadow-lg drop-shadow-md md:w-[425px] md:p-10">
        <p className="w-full text-center text-2xl font-semibold">Masuk ke akun</p>

        <LoginForm />
      </div>

      <div className="flex flex-row items-center justify-center gap-1">
        <p className="">Belum punya akun?</p>
        <Button component="RouterLink" href={paths.auth.register} variant="gost">
          Daftar Sekarang
        </Button>
      </div>
    </section>
  );
};

export default LoginView;
