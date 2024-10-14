'use client';

import { MouseEventHandler } from 'react';

import { useCheckSession } from '@/hooks/useCheckSession';
import { CategoriesEN } from '@/types';
import { Heading } from '@/components/ui';
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

import s from './page.module.scss';

export default function HomePage() {
  const { posts } = useFetchPosts();
  const { liveFollowings } = useFetchLiveFollowings();
  const { filteredPosts, selectedCategory, setSelectedCategory } =
    useCategoryFilter(posts);

  useCheckSession();

  const handleCategoryClick: MouseEventHandler = (e) => {
    e.stopPropagation();

    const target = e.currentTarget as HTMLElement;
    const category = target.dataset.category as CategoriesEN;

    setSelectedCategory(category);
  };

  return (
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

/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-console */
console.log(`
  　(　 .∧_∧
  　 )　(｡・ω・)
  　旦 ι''o,,_）～ 너와 나의 맛집 공유 !
  `);
