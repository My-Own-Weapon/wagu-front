import Image from 'next/image';

import s from './styles/SocialLoginArea.module.scss';

export default function SocialLoginArea() {
  return (
    <div className={s.socialLogin}>
      <div className={s.divider}>
        <span>간편한 로그인</span>
      </div>
      <div className={s.socialButtons}>
        <div className={s.socialButton}>
          <Image
            src="/GoogleLogo.png"
            alt="Google"
            width={24}
            height={24}
            fill={false}
          />
        </div>
        <div className={s.socialButton}>
          <Image
            src="/KakaoLogo.png"
            alt="Kakao"
            width={24}
            height={24}
            fill={false}
          />
        </div>
      </div>
    </div>
  );
}
