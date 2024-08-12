'use client';

import { useRouter } from 'next/navigation';
import { BtnBackSVG, DotDotDotSVG } from '@public/newDesign/nav';

import s from './PostHeader.module.scss';

export default function PostHeader({ modable }: { modable: boolean }) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <header className={s.container}>
      <div className={s.wrapper}>
        <button className={s.backBtn} type="button" onClick={handleBackClick}>
          <BtnBackSVG />
        </button>
        {modable && (
          <button className={s.modifyBtn} type="button">
            <DotDotDotSVG />
          </button>
        )}
      </div>
    </header>
  );
}
