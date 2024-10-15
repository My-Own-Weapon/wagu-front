'use client';

import { useState } from 'react';

import { Spacing } from '@/components/ui';
import { LoginForm, NotYetSignupText } from './_components/index';
import { ErrorMessage } from '../_components';

import s from './page.module.scss';

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <main className={s.container}>
      <LoginForm setErrorMsg={setErrorMsg} />
      {errorMsg && (
        <>
          <Spacing size={24} />
          <ErrorMessage align="center">{errorMsg}</ErrorMessage>
        </>
      )}
      <NotYetSignupText goto="signup" />
    </main>
  );
}
