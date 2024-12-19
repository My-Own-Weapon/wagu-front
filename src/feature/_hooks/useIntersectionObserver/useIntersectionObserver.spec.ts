import { describe, it, beforeEach, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useIntersectionObserver from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  const mockDisconnect = vi.fn();
  const mockObserve = vi.fn();
  const mockUnobserve = vi.fn();

  beforeEach(() => {
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      disconnect: mockDisconnect,
      observe: mockObserve,
      unobserve: mockUnobserve,
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: () => [],
    }));

    vi.clearAllMocks();
  });

  it('IntersectionObserver API callback과 options가 올바르게 전달되어야 한다.', () => {
    // given
    const onIntersect = vi.fn();
    const options = {
      root: document.createElement('div'),
      rootMargin: '10px',
      threshold: 0.5,
    };

    // when
    renderHook(() => {
      return useIntersectionObserver({
        onIntersect,
        ...options,
      });
    });

    // then
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      // callback
      expect.any(Function),
      // options
      expect.objectContaining({
        root: options.root,
        rootMargin: options.rootMargin,
        threshold: options.threshold,
      }),
    );
  });

  it('초기 렌더링 시 ref와 observer를 반환해야 함', () => {
    // given
    // when
    const onIntersect = vi.fn();
    const { result } = renderHook(() => {
      return useIntersectionObserver({ onIntersect });
    });
    const { ref: refCallback, observer } = result.current;

    // then
    expect(refCallback).toBeDefined();
    expect(typeof refCallback).toBe('function');
    expect(observer).not.toBeNull();
    expect(observer).toEqual(
      expect.objectContaining({
        disconnect: expect.any(Function),
        observe: expect.any(Function),
        unobserve: expect.any(Function),
      }),
    );
  });

  it('ref에 요소가 할당될 때 observer가 생성되고 observe가 호출되어야 함', () => {
    // given
    const onIntersect = vi.fn();
    const mockElement = document.createElement('div');
    const { result } = renderHook(() => {
      return useIntersectionObserver({ onIntersect });
    });
    const { ref: refCallback } = result.current;

    // when
    refCallback(mockElement);

    // then
    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it('ref에 null이 전달될 때 unobserve가 호출되어야 함', () => {
    // given
    const onIntersect = vi.fn();
    const mockElement = document.createElement('div');

    const { result } = renderHook(() => {
      return useIntersectionObserver({ onIntersect });
    });
    const { ref: refCallback } = result.current;

    // when
    refCallback(mockElement);
    refCallback(null);

    // then
    expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
  });

  it('컴포넌트 언마운트 시 observer가 disconnect 되어야 함', () => {
    // given
    const onIntersect = vi.fn();
    const { unmount } = renderHook(() => {
      return useIntersectionObserver({ onIntersect });
    });

    // when
    unmount();

    // then
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('intersection 발생 시 onIntersect 콜백이 호출되어야 함', () => {
    // given
    const onIntersect = vi.fn();
    renderHook(() => useIntersectionObserver({ onIntersect }));
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    } as unknown as IntersectionObserverEntry;
    const observerCallback =
      // vitest의 Mock과 MockInstance로 타입 추론이 안되기에 jest.Mock으로 타입 추론
      (global.IntersectionObserver as unknown as jest.Mock).mock
        .calls[0][0] as (entries: IntersectionObserverEntry[]) => void;

    // when
    observerCallback([mockEntry]);

    // then
    expect(onIntersect).toHaveBeenCalledWith(mockEntry);
  });
});
