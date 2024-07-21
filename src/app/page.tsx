'use client';

import { MouseEventHandler, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { consoleArt } from '@/utils';
import { apiService } from '@/services/apiService';
import { Post } from '@/components/Post';
import CategoryList from '@/components/CategoryList';
import LiveFriends, { Friend } from '@/components/LiveFriendsList';
import { useCheckSession } from '@/hooks/useCheckSession';
import { PostCardProps } from '@/types';

import s from './page.module.scss';

consoleArt();

interface PostReponse extends PostCardProps {
  memberUsername: string;
  category: string;
}

const categoryMap = {
  전부: 'ALL',
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
    useState<CategoriesKR>('전부');
  useCheckSession();
  const path = usePathname();

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
    if (selectedCategory === '전부') {
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
      <LiveFriends liveFriends={liveFriends} />
      <CategoryList
        heading="카테고리"
        path={path}
        selectedCategory={selectedCategory}
        onClick={handleCategoryClick}
      />
      <Post.Wrapper>
        <Post>
          {filteredPosts.length === 0 ? (
            <Post.Title
              title={`${selectedCategory} 카테고리에 등록된 포스트가 없습니다`}
            />
          ) : (
            <Post.Title title={`${selectedCategory}  Posts`} />
          )}
          {filteredPosts.length > 0 && <Post.PostCards posts={filteredPosts} />}
        </Post>
      </Post.Wrapper>
    </main>
  );
}
