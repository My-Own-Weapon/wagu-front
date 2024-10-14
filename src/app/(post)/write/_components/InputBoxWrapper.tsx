import { ReactNode } from 'react';

export default function InputBoxWrapper({
  gap,
  children,
}: {
  gap: string;
  children: ReactNode;
}) {
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
      }}
    >
      {children}
    </div>
  );
}
