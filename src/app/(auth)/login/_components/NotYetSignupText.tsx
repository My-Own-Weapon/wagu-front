import Link from 'next/link';

import s from './styles/NotYetSignupText.module.scss';

interface Props {
  goto: 'signup';
}

export default function NotYetSignupText({ goto }: Props) {
  return (
    <div className={s.footer}>
      계정이 아직 없나요?{' '}
      <Link href={`/${goto}`}>
        <span className={s.signupLink}>회원가입</span>
      </Link>
    </div>
  );
}
