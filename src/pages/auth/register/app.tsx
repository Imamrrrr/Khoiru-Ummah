import React from 'react';
import { Helmet } from 'react-helmet-async';
// sections
import { RegisterView } from '/src/sections/auth/register/view';

// ----------------------------------------------------------------------

const RegisterPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> Daftar - Khoiru Ummah</title>
        <meta name="description" content="Daftar - Khoiru Ummah" />
        <meta name="keywords" content="web,application,auth,khoiruummah,register" />
      </Helmet>

      <RegisterView />
    </>
  );
};

export default RegisterPage;
