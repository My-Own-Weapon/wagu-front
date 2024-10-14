import React, { ComponentProps, ElementType } from 'react';

import { PropsWithNotUndefinedChildren } from '@/components/ui/_types';

interface StackProps<T extends ElementType> {
  as?: T;
  className?: string;
  padding?: '0 16px' | '0 20px' | '0 24px';
  children: React.ReactNode;
}

export default function Stack<T extends ElementType = 'div'>({
  as: Element = 'div',
  className = undefined,
  padding = undefined,
  children,
  ...restProps
}: PropsWithNotUndefinedChildren<StackProps<T>> & ComponentProps<T>) {
  return (
    <Element
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding,
      }}
      {...restProps}
    >
      {children}
    </Element>
  );
}
