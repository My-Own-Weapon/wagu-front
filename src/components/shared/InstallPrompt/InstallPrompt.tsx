import { useEffect, useState } from 'react';

import {
  BoxButton,
  Flex,
  Spacing,
  Stack,
  Text,
  NextImageWithCover,
} from '@/components/ui';
import { colors } from '@/constants/theme';
import { localStorageApi } from '@/services/localStorageApi';
import { useModal } from '@/feature/_hooks';

import s from './InstallPrompt.module.scss';

declare global {
  export interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent>();
  const { open, close, Overlay } = useModal();

  useEffect(() => {
    const lastClosedDate = localStorageApi.getInstallPromptClosedAt();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    const shouldShowPrompt =
      !lastClosedDate || Date.now() - Number(lastClosedDate) > sevenDaysInMs;

    if (!shouldShowPrompt) {
      close();
      return undefined;
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
      open();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, [close, open]);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      close();
    }

    setInstallPrompt(undefined);
  };

  const handleClose = () => {
    localStorageApi.setInstallPromptClosedAt(String(Date.now()));
    close();
  };

  return (
    <Overlay>
      <div className={s.installPrompt} data-testid="install-prompt-modal">
        <NextImageWithCover
          src="/newDesign/logos/wagu_logo.svg"
          alt="install-prompt-icon"
          width={48}
          height={48}
          data-testid="install-prompt-logo"
        />
        <Spacing size={16} />
        <Stack style={{ width: '100%' }}>
          <Text fontWeight="semiBold" fontSize="big" color={colors.grayAsh900}>
            더 편리하게 이용하기
          </Text>
          <Spacing size={8} />
          <Text
            fontSize="medium"
            fontWeight="regular"
            color={colors.grayAsh800}
          >
            홈 화면에 앱을 설치하고 빠르게 접속하세요 !
          </Text>
        </Stack>
        <Spacing size={20} />
        <Flex gap={12} justifyContent="space-between" style={{ width: '100%' }}>
          <BoxButton
            onClick={handleInstallClick}
            styleType="fill"
            data-testid="install-prompt-install-button"
          >
            앱 설치하기
          </BoxButton>
          <BoxButton
            onClick={handleClose}
            styleType="outline"
            data-testid="install-prompt-close-button"
          >
            7일 동안 보지 않기
          </BoxButton>
        </Flex>
      </div>
    </Overlay>
  );
}
