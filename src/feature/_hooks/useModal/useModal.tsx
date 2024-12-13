'use client';

import { zIndex } from '@/constants/theme';
import { useModalContext } from '@/feature/_hooks/useModal/provider';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DefaultOverlayProps
  extends React.ComponentProps<'div'>,
    React.PropsWithChildren {
  onBackgroundClick?: () => void;
  overlayStyle?: React.CSSProperties;
}

interface UseModalProps<T> {
  CustomOverlay?: React.FC<T>;
}
export default function useModal<T extends object>({
  CustomOverlay = undefined,
}: UseModalProps<T> = {}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, close]);

  function DefaultOverlay({
    onBackgroundClick = () => {},
    overlayStyle = {},
    className = '',
    children,
  }: DefaultOverlayProps) {
    const { $modalPortalRef } = useModalContext();
    const $modalPortal = $modalPortalRef.current;

    if (!isOpen || !$modalPortal) return null;

    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        data-testid="modal-default-overlay"
        className={className}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: '0 auto',
          width: '100%',
          height: '100%',
          maxWidth: '410px',
          zIndex: zIndex.modal,
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            if (onBackgroundClick && e.target === e.currentTarget) {
              onBackgroundClick();
            }
          }}
          onKeyDown={(e) => {
            if (onBackgroundClick && e.key === 'Escape') {
              onBackgroundClick();
            }
          }}
          style={{ ...STYLE.overlayDefault, ...overlayStyle }}
        >
          {children}
        </div>
      </div>,
      $modalPortal,
    );
  }

  const Overlay = CustomOverlay || DefaultOverlay;

  return { open, isOpen, close, Overlay };
}

const STYLE = {
  overlayDefault: {
    width: '100%',
    height: '100%',
    maxWidth: '410px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
} as const;
