import { useState, useEffect, useRef } from 'react';

export default function useDragScroll() {
  const ref = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const element = ref.current;

    const startDrag = (e: MouseEvent) => {
      e.stopPropagation();

      setIsDragging(true);
      setStartX(e.pageX - element!.offsetLeft);
      setScrollLeft(element!.scrollLeft);
    };

    const stopDrag = (e: MouseEvent) => {
      e.stopPropagation();

      setIsDragging(false);
    };

    const onDrag = (e: MouseEvent) => {
      e.stopPropagation();

      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - element!.offsetLeft;
      const walk = x - startX;
      element!.scrollLeft = scrollLeft - walk;
    };

    element?.addEventListener('mousedown', startDrag);
    element?.addEventListener('mouseleave', stopDrag);
    element?.addEventListener('mouseup', stopDrag);
    element?.addEventListener('mousemove', onDrag);

    return () => {
      element?.removeEventListener('mousedown', startDrag);
      element?.removeEventListener('mouseleave', stopDrag);
      element?.removeEventListener('mouseup', stopDrag);
      element?.removeEventListener('mousemove', onDrag);
    };
  }, [isDragging, startX, scrollLeft]);

  return ref;
}
