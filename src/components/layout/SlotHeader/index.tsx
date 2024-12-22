import { ReactNode } from 'react';

import s from './index.module.scss';

interface Props {
  children: ReactNode;
}

/**
 * @example 
  <SlotHeader>
    <SlotHeader.Left>
      <button>Back</button>
    </SlotHeader.Left>
    <SlotHeader.Center>
      <h1>Center</h1>
    </SlotHeader.Center>
    <SlotHeader.Right>
      <button>Right</button>
    </SlotHeader.Right>
  </SlotHeader>
 */
export default function SlotHeader({ children }: Props) {
  return <header className={s.container}>{children}</header>;
}

SlotHeader.Left = function SlotHeader__Left({ children }: Props) {
  if (!children) return null;

  return <div className={s.left}>{children}</div>;
};

SlotHeader.Center = function SlotHeader__center({ children }: Props) {
  if (!children) return null;

  return <div className={s.center}>{children}</div>;
};

SlotHeader.Right = function SlotHeader__Right({ children }: Props) {
  if (!children) return null;

  return <div className={s.right}>{children}</div>;
};
