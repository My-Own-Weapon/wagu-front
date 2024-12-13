'use client';

import { createContext, useContext, useMemo, useRef } from 'react';

interface ModalContextType {
  $modalPortalRef: React.RefObject<HTMLDivElement>;
}

const context = createContext<ModalContextType | undefined>(undefined);

export function ModalPortalProvider({ children }: React.PropsWithChildren) {
  const $modalPortalRef = useRef<HTMLDivElement>(null);
  const value = useMemo(() => ({ $modalPortalRef }), [$modalPortalRef]);

  return (
    <>
      <div ref={$modalPortalRef} />
      <context.Provider value={value}>{children}</context.Provider>
    </>
  );
}

export const useModalContext = () => {
  const modalContext = useContext(context);
  if (!modalContext) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return modalContext;
};
