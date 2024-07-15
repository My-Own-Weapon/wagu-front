import Image from 'next/image';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

import s from './BackBtn.module.scss';

interface Props {
  className?: string;
  goto: string;
}

export default function BackBtn({ className = '', goto }: Props) {
  const router = useRouter();
  const classname = classNames(s.container, className);

  const handleBackClick = () => {
    if (goto === 'back') {
      router.back();
      return;
    }
    router.push(goto);
  };

  return (
    <button className={classname} type="button" onClick={handleBackClick}>
      <Image src="/back-btn.svg" alt="backBtn" width={28} height={28} />
    </button>
  );
}
