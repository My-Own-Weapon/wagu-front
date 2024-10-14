import { CSSProperties, ReactNode } from 'react';

export type JustifyContentOptions = Extract<
  CSSProperties['justifyContent'],
  'center' | 'space-between' | 'space-around' | 'flex-start' | 'flex-end'
>;

export type PropsWithNotUndefinedChildren<T = unknown> = T & {
  children: ReactNode;
};
