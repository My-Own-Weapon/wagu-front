import { useEffect, useRef } from 'react';

export const useTextareaAutoResize = (value?: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const $textarea = textareaRef.current;

      $textarea.style.height = 'auto';
      $textarea.style.height = `calc(${$textarea.scrollHeight}px - 48px)`;
    }
  }, [value]);

  return textareaRef;
};
