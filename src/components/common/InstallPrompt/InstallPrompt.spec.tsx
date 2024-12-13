import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';

import { $testId, $testIdQuery, $testIdWaitFor } from '@/utils/testUtils';
import { localStorageApi } from '@/services/localStorageApi';
import { ModalPortalProvider } from '@/feature/_hooks/useModal';
import InstallPrompt, { BeforeInstallPromptEvent } from './InstallPrompt';

describe('InstallPrompt', () => {
  let beforeInstallPromptEvent: BeforeInstallPromptEvent;
  let I: UserEvent;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorageApi.setInstallPromptClosedAt('');
    I = userEvent.setup();

    beforeInstallPromptEvent = getBeforeInstallPromptEvent('accepted');
  });

  it('이벤트 발생 전에는 모달이 표시되지 않는다.', () => {
    // given
    render(<App />);

    // when
    // then
    const modal = screen.queryByTestId('install-prompt-modal');
    expect(modal).not.toBeInTheDocument();
  });

  it('beforeinstallprompt 이벤트 발생 시 모달이 표시된다.', async () => {
    // given
    render(<App />);

    // when
    window.dispatchEvent(beforeInstallPromptEvent);

    // then
    const $modal = await $testIdWaitFor('install-prompt-modal', 0);
    expect($modal).toBeInTheDocument();
  });

  it('7일 이내에 "7일 동안 보지 않기" 눌렀다면 모달이 표시되지 않는다.', async () => {
    // given
    const ONE_DAY_AGO_DISMISS = Date.now() - 24 * 60 * 60 * 1000;
    localStorageApi.setInstallPromptClosedAt(String(ONE_DAY_AGO_DISMISS));
    render(<App />);

    // when
    window.dispatchEvent(beforeInstallPromptEvent);

    // then
    expect(async () => {
      return $testIdWaitFor('install-prompt-modal', 0);
    }).rejects.toThrow();
  });

  it('앱 설치하기 버튼 클릭 시 prompt 메서드가 호출되고 outcome이 accepted면 모달이 닫힌다.', async () => {
    // given
    render(<App />);
    window.dispatchEvent(beforeInstallPromptEvent);

    // when
    const $installButton = await $testIdWaitFor(
      'install-prompt-install-button',
    );
    await I.click($installButton);
    expect(beforeInstallPromptEvent.prompt).toHaveBeenCalled();

    // then
    const $modal = screen.queryByTestId('install-prompt-modal');
    expect($modal).not.toBeInTheDocument();
  });

  it('7일 동안 보지 않기 버튼 클릭 시 localStorage에 시간 저장 후 모달이 닫힌다.', async () => {
    // given
    render(<App />);
    window.dispatchEvent(beforeInstallPromptEvent);

    // when
    let $modal = await $testIdWaitFor('install-prompt-modal');
    const $closeButton = $testId('install-prompt-close-button');

    expect($modal).toBeInTheDocument();
    await I.click($closeButton);

    // then
    const closedAt = localStorageApi.getInstallPromptClosedAt();

    expect(closedAt).toBeTruthy();
    expect(Date.now() - Number(closedAt)).toBeGreaterThan(-1);
    $modal = $testIdQuery('install-prompt-modal') as HTMLElement;
    expect($modal).not.toBeInTheDocument();
  });

  it('outcome이 dismissed일 경우, 모달이 닫히지 않는다.', async () => {
    // given
    beforeInstallPromptEvent = getBeforeInstallPromptEvent('dismissed');
    render(<App />);
    window.dispatchEvent(beforeInstallPromptEvent);

    // when
    const $installButton = await $testIdWaitFor(
      'install-prompt-install-button',
    );
    await I.click($installButton);

    // then
    expect(beforeInstallPromptEvent.prompt).toHaveBeenCalled();
    expect((await beforeInstallPromptEvent.userChoice).outcome).toBe(
      'dismissed',
    );
    const $modal = $testId('install-prompt-modal');
    expect($modal).toBeInTheDocument();
  });
});

function App() {
  return (
    <ModalPortalProvider>
      <InstallPrompt />
    </ModalPortalProvider>
  );
}

const getBeforeInstallPromptEvent = (outcome: 'accepted' | 'dismissed') => {
  const beforeInstallPromptEvent = new Event(
    'beforeinstallprompt',
  ) as BeforeInstallPromptEvent;

  Object.defineProperties(beforeInstallPromptEvent, {
    prompt: { value: vi.fn() },
    userChoice: {
      value: Promise.resolve({ outcome, platform: 'web' }),
    },
  });

  return beforeInstallPromptEvent;
};
