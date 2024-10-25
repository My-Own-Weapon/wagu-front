import { ReactNode, useCallback, useReducer } from 'react';
import { createPortal } from 'react-dom';

interface ModalWrapper {
  content: ReactNode;
}

export default function useModal() {
  const [isOpen, toggleIsOpen] = useReducer((isOpen) => !isOpen, false);

  const open = useCallback(() => toggleIsOpen(), []);
  const close = useCallback(() => toggleIsOpen(), []);

  function ModalCompnent({ content }: ModalWrapper) {
    return isOpen && createPortal(content, document.body);
  }

  return { open, isOpen, close, ModalCompnent };
}
