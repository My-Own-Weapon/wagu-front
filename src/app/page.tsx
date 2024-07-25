'use client';

import { MouseEventHandler, useEffect, useState } from 'react';

import { consoleArt } from '@/utils';
import { apiService } from '@/services/apiService';
import { useCheckSession } from '@/hooks/useCheckSession';
import { CategoriesEN, CategoriesWithAllEN, PostCardProps } from '@/types';
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

export default function Home() {
  const [allPosts, setAllPosts] = useState<PostReponse[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostReponse[]>([]);
  const [liveFriends, setLiveFriends] = useState<Friend[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesWithAllEN>('ALL');
  useCheckSession();

  const handleCategoryClick: MouseEventHandler = (e) => {
    e.stopPropagation();

    const target = e.currentTarget as HTMLElement;
    const category = target.dataset.category as CategoriesEN;

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
    if (selectedCategory === 'ALL') {
      setFilteredPosts(allPosts);
      return;
    }

    setFilteredPosts(
      allPosts.filter(({ category }) => category === selectedCategory),
    );
  }, [allPosts, selectedCategory]);

  return (
    <main className={s.container}>
      <div className={s.top}>
        <div className={s.streamerWrapper}>
          <Heading
            as="h3"
            title={
              liveFriends.length > 0
                ? '방송중인 친구가 있어요 !'
                : '방송중인 친구가 없어요...'
            }
            color="white"
            fontSize="20px"
            fontWeight="semiBold"
          />
          <LiveFriends liveFriends={liveFriends} />
        </div>
      </div>
      <div className={s.bottom}>
        <Heading
          as="h3"
          fontSize="20px"
          color="black"
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
