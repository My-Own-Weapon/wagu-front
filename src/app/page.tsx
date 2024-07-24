'use client';

import { MouseEventHandler, useEffect, useState } from 'react';

import { consoleArt } from '@/utils';
import { apiService } from '@/services/apiService';
import { useCheckSession } from '@/hooks/useCheckSession';
import { PostCardProps } from '@/types';
import { Post } from '@/components/Post';
import LiveFriends, { Friend } from '@/components/LiveFriendsList';
import CategoryList from '@/components/CategoryList';
import Heading from '@/components/ui/Heading';

import s from './page.module.scss';

consoleArt();

interface PostReponse extends PostCardProps {
  memberUsername: string;
  category: string;
}

const categoryMap = {
  전체: 'ALL',
  한식: 'KOREAN',
  일식: 'JAPANESE',
  중식: 'CHINESE',
  분식: 'FASTFOOD',
  양식: 'WESTERN',
  카페: 'CAFE',
  디저트: 'DESSERT',
} as const;

export type CategoriesKR = keyof typeof categoryMap;
export type CategoriesEN = (typeof categoryMap)[CategoriesKR];

export default function Home() {
  const [allPosts, setAllPosts] = useState<PostReponse[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostReponse[]>([]);
  const [liveFriends, setLiveFriends] = useState<Friend[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesKR>('전체');
  useCheckSession();

  const handleCategoryClick: MouseEventHandler = (e) => {
    e.stopPropagation();

    const target = e.currentTarget as HTMLElement;
    const category = target.dataset.category as CategoriesKR;

    setSelectedCategory(category);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsData, liveFriendsData] = await Promise.all([
          apiService.fetchPosts(),
          apiService.fetchLiveFriends(),
        ]);

        setAllPosts(postsData);
        setFilteredPosts(postsData);
        setLiveFriends(liveFriendsData);
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message || '데이터를 불러오는데 에러가 발생했습니다');
        }
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === '전체') {
      setFilteredPosts(allPosts);
      return;
    }

    const formattedCategory = categoryMap[selectedCategory];
    setFilteredPosts(
      allPosts.filter(({ category }) => category === formattedCategory),
    );
  }, [allPosts, selectedCategory]);

  return (
    <main className={s.container}>
      <div className={s.top}>
        <LiveFriends liveFriends={liveFriends} />
      </div>
      <div className={s.bottom}>
        <Heading
          as="h3"
          fontSize="20px"
          fontWeight="semiBold"
          title="MY POST"
        />
        <CategoryList
          selectedCategory={selectedCategory}
          onClick={handleCategoryClick}
        />
        <Post>
          {filteredPosts.length > 0 && <Post.PostCards posts={filteredPosts} />}
        </Post>
      </div>
    </main>
  );
}
