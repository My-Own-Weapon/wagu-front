import { useEffect, useRef, useCallback, useState } from 'react';

interface UseIntersectionObserverParams extends IntersectionObserverInit {
  /** target 요소가 threshold 이상 노출 시 호출될 콜백 함수 */
  onIntersect: (entry: IntersectionObserverEntry) => void;
  /** intersection observer에 사용할 루트 요소, 기본값 null(브라우저 뷰포트) */
  root?: Element | Document | null;
  /** root와 target 사이 margin, 기본값 '0px' */
  rootMargin?: string;
  /** 관찰 기준 threshold, 기본값 0 */
  threshold?: number | number[];
}

interface UseIntersectionObserverReturn {
  ref: (el: HTMLElement | null) => void;
  observer: IntersectionObserver | null;
}

/**
 * @description
 * useIntersectionObserver 훅은 callback ref를 반환하여 ref에 요소가 할당될 때마다
 * (즉, ref가 변경될 때마다) IntersectionObserver를 재설정 및 재observe 합니다.
 *
 * @param onIntersect - target 요소가 threshold 이상 노출 시 호출될 콜백 함수
 * @param root - intersection observer에 사용할 루트 요소, 기본값 null(브라우저 뷰포트)
 * @param rootMargin - root와 target 사이 margin, 기본값 '0px'
 * @param threshold - 관찰 기준 threshold, 기본값 0
 *
 * @returns { ref, observer } - callback ref와 observer 인스턴스
 */
export default function useIntersectionObserver({
  onIntersect,
  root = null,
  rootMargin = '0px',
  threshold = 0,
}: UseIntersectionObserverParams): UseIntersectionObserverReturn {
  const savedOnIntersect =
    useRef<UseIntersectionObserverParams['onIntersect']>(onIntersect);
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        savedOnIntersect.current?.(entry);
      });
    },
    [savedOnIntersect],
  );
  const [observer] = useState(() => {
    return new IntersectionObserver(observerCallback, {
      root,
      rootMargin,
      threshold,
    });
  });
  const $targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    savedOnIntersect.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const $target = $targetRef.current;
    if ($target) observer.observe($target);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, observerCallback, observer]);

  const ref = (el: HTMLElement | null) => {
    // $target umount
    if (!el && $targetRef.current) {
      observer.unobserve($targetRef.current);
      $targetRef.current = null;
      return;
    }

    const isRegistered = $targetRef.current === el;
    if (isRegistered) return;

    const $prevTarget = $targetRef.current;
    $targetRef.current = el;

    if (observer) {
      if ($prevTarget) observer.unobserve($prevTarget);
      if (el) observer.observe(el);
    }
  };

  return {
    ref,
    observer,
  };
}
