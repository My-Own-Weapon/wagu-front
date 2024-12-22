import { ComponentProps, ReactNode } from 'react';

interface Props extends ComponentProps<'div'> {
  as?: 'div' | 'section' | 'article' | 'main';
  backgroundColor?: string;
  children: ReactNode;
}

export default function Container({
  as: Element = 'div',
  backgroundColor = '#ffffff',
  children,
  style,
  ...rest
}: Props) {
  return (
    <Element
      style={{
        backgroundColor,
        maxWidth: '100%',
        width: '100%',
        margin: 0,
        padding: 0,
        height: 'auto',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          backgroundColor,
        }}
      >
        {children}
      </div>
    </Element>
  );
}
