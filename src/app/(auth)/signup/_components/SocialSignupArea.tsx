import Image from 'next/image';

import s from './styles/SocialSignupArea.module.scss';

export default function SocialSignupArea() {
  return (
    <div className={s.socialSignup}>
      <div className={s.divider}>
        <span>간편한 회원가입</span>
      </div>
      <div className={s.socialButtons}>
        <div className={s.socialButton}>
          <Image src="/GoogleLogo.png" alt="Google" width={24} height={24} />
        </div>
        <div className={s.socialButton}>
          <Image src="/KakaoLogo.png" alt="Kakao" width={24} height={24} />
        </div>
      </div>
    </div>
  );
}
