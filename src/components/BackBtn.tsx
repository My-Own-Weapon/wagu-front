import Image from 'next/image';
import { useRouter } from 'next/navigation';
import s from './BackBtn.module.scss';

interface Props {
  goto: string;
}

export default function BackBtn({ goto }: Props) {
  const router = useRouter();

  const handleBackClick = () => {
    router.push(goto);
  };

  return (
    <button className={s.container} type="button" onClick={handleBackClick}>
      <Image src="/BackIcon.svg" alt="backBtn" width={24} height={24} />
    </button>
  );
}
