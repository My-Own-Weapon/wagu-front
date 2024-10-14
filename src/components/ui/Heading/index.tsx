import { COLORS, FONT_WEIGHTS } from '@/components/ui/_contants';
import { PropsWithNotUndefinedChildren } from '@/components/ui/_types';

import s from './index.module.scss';

interface Props {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontSize: string;
  fontWeight: keyof typeof FONT_WEIGHTS;
  color?: 'white' | 'black' | 'primary';
}

export default function Heading({
  as: Component,
  fontSize,
  fontWeight,
  color = 'black',
  children,
}: PropsWithNotUndefinedChildren<Props>) {
  return (
    <Component
      className={s.heading}
      style={{
        fontSize,
        fontWeight: FONT_WEIGHTS[fontWeight],
        lineHeight: '150%',
        letterSpacing: '-0.05em',
        color: COLORS.FONT[color],
      }}
    >
      {children}
    </Component>
  );
}
