import { PropsWithChildren, ReactNode, useCallback, useReducer } from 'react';
import { createPortal } from 'react-dom';

interface ModalWrapper {
  content: ReactNode;
}

export default function useModal() {
  const [isOpen, toggleIsOpen] = useReducer((isOpen) => !isOpen, false);

  const open = useCallback(() => toggleIsOpen(), []);
  const close = useCallback(() => toggleIsOpen(), []);

  function ModalCompnent({ content }: ModalWrapper) {
    return (
      isOpen &&
      createPortal(<Overlay close={close}>{content}</Overlay>, document.body)
    );
  }

  return { open, close, ModalCompnent };
}

const STYLE = {
  OVERLAY: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
    zIndex: 9999,
  },
} as const;

interface OverlayProps {
  close: () => void;
  children: ReactNode;
}

function Overlay({ close, children }: PropsWithChildren<OverlayProps>) {
  return (
    <div
      style={{ ...STYLE.OVERLAY }}
      onClick={close}
      onKeyDown={(e) => {
        e.stopPropagation();

        if (e.key === 'backspace') {
          close();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
