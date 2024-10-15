import { ReactNode } from 'react';

interface Props {
  as?: 'div' | 'section' | 'article' | 'main';
  backgroundColor?: string;
  children: ReactNode;
}

export default function Container({
  as: Element = 'div',
  backgroundColor = '#ffffff',
  children,
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
      }}
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
