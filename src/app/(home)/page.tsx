'use client';

import { Suspense, useState } from 'react';

import { CategoriesWithAllEN } from '@/types';
import { Heading, Spacing, Text } from '@/components/ui';
import { useFetchLiveFollowings } from '@/app/(home)/_hooks';
import { CategoryList, LiveFollowingsSection } from '@/app/(home)/_components';
import { InstallPrompt } from '@/components/common';
import { PostCards } from '@/components/feature/post';

import { useIntersectionObserver } from '@/feature/_hooks';
import { PostCardSkeleton } from '@/components/PostCard';
import { useFilteredMyPosts } from '@/feature/post/applications/hooks';

import s from './page.module.scss';

export default function HomePage() {
  const { liveFollowings } = useFetchLiveFollowings();

  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesWithAllEN>('ALL');

  return (
    <>
      <main className={s.container}>
        <div className={s.top}>
          <LiveFollowingsSection liveFollowings={liveFollowings} />
        </div>
        <div className={s.bottom}>
          <Heading as="h3" fontSize="20px" color="black" fontWeight="semiBold">
            My Post
          </Heading>
          <CategoryList
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <Suspense
            fallback={Array.from({ length: 10 }).map((_, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <PostCardSkeleton key={idx} />
            ))}
          >
            <PostCardsSection category={selectedCategory} />
          </Suspense>
        </div>
      </main>
      <InstallPrompt />
    </>
  );
}

interface PostCardsSectionProps {
  category: CategoriesWithAllEN;
}
export function PostCardsSection({ category }: PostCardsSectionProps) {
  const { posts, fetchNextPage, hasNextPage, isFetching } =
    useFilteredMyPosts(category);
  const { ref } = useIntersectionObserver({
    onIntersect: (entry) => {
      handleIntersect({
        entry,
        fetchNextPage,
        hasNextPage,
        isFetching,
      });
    },
    threshold: 0.5,
  });

  return posts.length > 0 ? (
    <PostCards posts={posts} refElement={ref} />
  ) : (
    <>
      <Spacing size={16} />
      <Text as="p" fontSize="large" fontWeight="medium" color="#2e2e2e">
        {category} 카테고리에 해당하는 포스트가 없어요!
      </Text>
    </>
  );
}

const handleIntersect = ({
  entry,
  fetchNextPage,
  hasNextPage,
  isFetching,
}: {
  entry: IntersectionObserverEntry;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
}) => {
  if (entry?.isIntersecting && hasNextPage && !isFetching) {
    fetchNextPage?.();
  }
};

/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-console */
console.log(`
  　(　 .∧_∧
  　 )　(｡・ω・)
  　旦 ι''o,,_）～ 너와 나의 맛집 공유 !
  `);
