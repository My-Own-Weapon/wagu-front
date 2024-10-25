'use client';

import { useState, useEffect, useRef } from 'react';

export default function useDragScroll() {
  const ref = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const prevPageX = useRef(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const startDrag = (e: MouseEvent) => {
      setIsDragging(true);
      prevPageX.current = e.pageX;
      setScrollLeft(element.scrollLeft);
    };

    const stopDrag = () => {
      setIsDragging(false);
    };

    const onDrag = (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      const walk = e.pageX - prevPageX.current;
      prevPageX.current = e.pageX;

      element.scrollLeft -= walk;
    };

    const handleClick = (e: MouseEvent) => {
      if (isDragging) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    element.addEventListener('mousedown', startDrag);
    element.addEventListener('mousemove', onDrag);
    element.addEventListener('click', handleClick);
    document.addEventListener('mouseup', stopDrag);

    // eslint-disable-next-line consistent-return
    return () => {
      element.removeEventListener('mousedown', startDrag);
      element.removeEventListener('mousemove', onDrag);
      element.removeEventListener('click', handleClick);
      document.removeEventListener('mouseup', stopDrag);
    };
  }, [isDragging, scrollLeft]);

  return ref;
}
