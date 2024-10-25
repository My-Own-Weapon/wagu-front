import { CSSProperties, HTMLProps } from 'react';

import {
  JustifyContentOptions,
  PropsWithNotUndefinedChildren,
} from '@/components/ui/_types';

interface Props extends HTMLProps<HTMLDivElement> {
  justifyContent: JustifyContentOptions;
  alignItems?: CSSProperties['alignItems'];
  gap?: CSSProperties['gap'];
}

export default function Flex({
  justifyContent,
  gap = undefined,
  alignItems = undefined,
  children,
}: PropsWithNotUndefinedChildren<Props>) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent,
        alignItems,
        gap,
      }}
    >
      {children}
    </div>
  );
}
