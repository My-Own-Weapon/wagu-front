import { PropsWithNotUndefinedChildren } from '@/components/ui/_types';
import { zIndex } from '@/constants/theme';

interface OverlayProps {
  close?: () => void;
}

export default function Overlay({
  close,
  children,
}: PropsWithNotUndefinedChildren<OverlayProps>) {
  return (
    <div
      style={{ ...STYLE.OVERLAY }}
      onClick={close}
      onKeyDown={(e) => {
        e.stopPropagation();

        if (e.key === 'backspace') {
          close?.();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

const STYLE = {
  OVERLAY: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
    zIndex: zIndex.modal,
  },
} as const;
