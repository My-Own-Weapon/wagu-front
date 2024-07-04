// BackButton.tsx
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import s from './BackBtn.module.scss';

export default function BackBtn(): ReactElement {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <button className={s.container} type="button" onClick={handleBackClick}>
      <Image src="/BackIcon.svg" alt="backBtn" width={24} height={24} />
    </button>
  );
}
