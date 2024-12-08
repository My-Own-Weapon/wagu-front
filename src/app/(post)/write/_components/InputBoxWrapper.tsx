import { ComponentProps, PropsWithChildren } from 'react';

interface InputBoxWrapperProps
  extends ComponentProps<'div'>,
    PropsWithChildren {
  gap: string;
  style?: React.CSSProperties;
}

export default function InputBoxWrapper({
  gap,
  children,
  style = {},
  ...rest
}: InputBoxWrapperProps) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
