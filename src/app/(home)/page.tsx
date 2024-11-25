'use client';

import { MouseEventHandler, useEffect, useState } from 'react';

import { CategoriesEN } from '@/types';
import {
  BoxButton,
  Flex,
  Heading,
  NextImageWithCover,
  Spacing,
  Stack,
  Text,
} from '@/components/ui';
import {
  useFetchPosts,
  useCategoryFilter,
  useFetchLiveFollowings,
} from '@/app/(home)/_hooks';
import {
  CategoryList,
  LiveFollowingsSection,
  PostsSection,
} from '@/app/(home)/_components';
import { colors } from '@/constants/theme';

import s from './page.module.scss';

export default function HomePage() {
  const { posts } = useFetchPosts();
  const { liveFollowings } = useFetchLiveFollowings();
  const { filteredPosts, selectedCategory, setSelectedCategory } =
    useCategoryFilter(posts);

  const handleCategoryClick: MouseEventHandler = (e) => {
    e.stopPropagation();

    const target = e.currentTarget as HTMLElement;
    const category = target.dataset.category as CategoriesEN;

    setSelectedCategory(category);
  };

  return (
    <main className={s.container}>
      <InstallPrompt />
      <div className={s.top}>
        <LiveFollowingsSection liveFollowings={liveFollowings} />
      </div>
      <div className={s.bottom}>
        <Heading as="h3" fontSize="20px" color="black" fontWeight="semiBold">
          My Post
        </Heading>
        <CategoryList
          selectedCategory={selectedCategory}
          handleClickCategory={handleCategoryClick}
        />
        <PostsSection
          filteredPosts={filteredPosts}
          selectedCategory={selectedCategory}
        />
      </div>
    </main>
  );
}

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

function InstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent>();
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const lastClosedDate = localStorage.getItem('installPromptClosedAt');
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    const shouldShowPrompt =
      !lastClosedDate || Date.now() - Number(lastClosedDate) > sevenDaysInMs;

    if (!shouldShowPrompt) {
      setShowInstallButton(false);
      return;
    }

    window.addEventListener(
      'beforeinstallprompt',
      (e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        setInstallPrompt(e);
        setShowInstallButton(true);
      },
    );
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }

    setInstallPrompt(undefined);
  };

  const handleClose = () => {
    localStorage.setItem('installPromptClosedAt', Date.now().toString());
    setShowInstallButton(false);
  };

  return (
    showInstallButton && (
      <div className={s.installPrompt}>
        <NextImageWithCover
          src="/newDesign/logos/wagu_logo.svg"
          alt="install-prompt-icon"
          width={48}
          height={48}
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
          <BoxButton onClick={handleInstallClick} styleType="fill">
            앱 설치하기
          </BoxButton>

          <BoxButton
            onClick={handleClose} // handleClose로 변경
            styleType="outline"
          >
            7일 동안 보지 않기
          </BoxButton>
        </Flex>
      </div>
    )
  );
}

/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-console */
console.log(`
  　(　 .∧_∧
  　 )　(｡・ω・)
  　旦 ι''o,,_）～ 너와 나의 맛집 공유 !
  `);
