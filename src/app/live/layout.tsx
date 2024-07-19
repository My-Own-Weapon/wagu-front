import { ReactNode } from 'react';

export default function LiveLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          padding: '0 24px',
          height: '60px',
          backgroundColor: 'lightblue',

          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>back</div>
      </header>
      {children}
    </div>
  );
}
