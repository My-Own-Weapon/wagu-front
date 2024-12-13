import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

import { useModal } from '@/feature/_hooks';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ModalPortalProvider } from '@/feature/_hooks/useModal/provider';

describe('useModal render test', () => {
  let I: UserEvent;

  beforeEach(() => {
    I = userEvent.setup();
    cleanup();
  });

  it('open 버튼 클릭시 Overlay가 렌더링된다.', async () => {
    // given
    render(<App />);

    // when
    const $openButton = screen.getByTestId('open-button');
    await I.click($openButton);

    // then
    const $overlay = screen.getByTestId('modal-default-overlay');
    expect($overlay).toBeInTheDocument();
  });

  it('open 버튼을 클릭하지 않고 close 버튼을 클릭하면 Overlay가 렌더링되지 않는다.', async () => {
    // given
    render(<App />);

    // when
    const $closeButton = screen.getByTestId('close-button');
    await I.click($closeButton);

    // then
    expect(
      screen.queryByTestId('modal-default-overlay'),
    ).not.toBeInTheDocument();
  });

  it('modal이 열려있는 상태에서 close 버튼을 클릭하면 modal이 닫힌다.', async () => {
    // given
    render(<App />);

    const $openButton = screen.getByTestId('open-button');
    await I.click($openButton);

    // when
    const $closeButton = screen.getByTestId('close-button');
    await I.click($closeButton);

    // then
    expect(
      screen.queryByTestId('modal-default-overlay'),
    ).not.toBeInTheDocument();
  });
});

describe('useModal logical test', () => {
  beforeEach(() => {
    cleanup();
  });

  it('open 함수 실행시 isOpen 상태가 true가 된다.', () => {
    const { result } = renderHook(() => useModal());
    let { open, isOpen } = result.current;

    // initial state
    expect(isOpen).toBe(false);

    // when
    act(() => {
      open();
    });
    ({ open, isOpen } = result.current);

    // then
    expect(isOpen).toBe(true);
  });

  it('close 함수 실행시 isOpen 상태가 false가 된다.', () => {
    const { result } = renderHook(() => useModal());
    let { open, close, isOpen } = result.current;

    // when
    act(() => {
      open();
      close();
    });
    ({ open, close, isOpen } = result.current);

    // then
    expect(isOpen).toBe(false);
  });
});

function App() {
  return (
    <ModalPortalProvider>
      <UseModalTest />
    </ModalPortalProvider>
  );
}

function UseModalTest() {
  const { open, close, Overlay } = useModal();

  return (
    <>
      <button onClick={open} data-testid="open-button" type="button">
        open
      </button>
      <button onClick={close} data-testid="close-button" type="button">
        close
      </button>
      <Overlay />
    </>
  );
}
