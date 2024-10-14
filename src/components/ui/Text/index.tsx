import { ComponentProps, ElementType } from 'react';

import { FONT_SIZE, FONT_WEIGHTS } from '@/components/ui/_contants';
import { PropsWithNotUndefinedChildren } from '@/components/ui/_types';

export interface Props extends ComponentProps<'p'> {
  as: ElementType;
  fontSize: keyof typeof FONT_SIZE;
  fontWeight: keyof typeof FONT_WEIGHTS;
  color: string;
  role?: 'alert' | 'status';
}

export default function Text({
  as: Component,
  fontSize,
  fontWeight,
  color,
  role = undefined,
  children,
  ...rest
}: PropsWithNotUndefinedChildren<Props>) {
  return (
    <Component
      style={{
        fontSize: FONT_SIZE[fontSize],
        fontWeight: FONT_WEIGHTS[fontWeight],
        color,
      }}
      role={role}
      {...rest}
    >
      {children}
    </Component>
  );
}