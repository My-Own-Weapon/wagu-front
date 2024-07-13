'use client';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import UserIcon from '@/components/UserIcon';

import { MouseEventHandler, useEffect, useState } from 'react';
import { apiService } from '@/services/apiService';
import { Post, PostCardProps } from '@/components/Post';

import s from './page.module.scss';

interface PostReponse extends PostCardProps {
  memberUsername: string;
  category: string;
}

interface Friend {
  memberId: number;
  username: string;
  each: boolean;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCategoryClick: MouseEventHandler<HTMLUListElement> = (e) => {
    const target = e.target as HTMLElement;
    const li = target.closest('li');
    if (!li?.dataset) return;

    const category = li.dataset.category as CategoriesKR;
    setSelectedCategory(category);
  };

  async function fetchData() {
    try {
      const [postsData, liveFriendsData] = await Promise.all([
        apiService.fetchPosts(),
        apiService.fetchFollowings(),
      ]);

      console.log('live', liveFriendsData);
      console.log('posts', postsData);

      setAllPosts(postsData);
      setFilteredPosts(postsData);
      setLiveFriends(liveFriendsData);
    } catch (error) {
      alert('데이터를 불러오는데 실패했습니다.');
    }
  }

  useEffect(() => {
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
      <div className={s.liveFriendsContainer}>
        <p>
          {liveFriends.length > 0
            ? '📺 방송중인 친구가 있어요 !'
            : '😢 방송중인 친구가 없어요'}
        </p>
        <ul className={s.friendsList}>
          {!!liveFriends &&
            liveFriends.map(({ memberId, username }) => (
              <li key={memberId}>
                <UserIcon
                  imgSrc="/profile/profile-default-icon-female.svg"
                  name={username}
                  alt="profile-icon"
                  width={40}
                  height={40}
                  withText={false}
                />
              </li>
            ))}
        </ul>
      </div>
      {/* <div className={s.categoryContainer}>
        <p>📚 카테고리</p>
        <ul className={s.categoriesList} onClick={handleCategoryClick}>
          {getCategories().map(({ id, name }) => (
            <li key={id} data-category={name}>
              <button type="button">
                <span>📘</span>
                <p>{name}</p>
              </button>
            </li>
          ))}
        </ul>
      </div> */}
      <Post.Wrapper>
        <Post>
          {filteredPosts.length === 0 ? (
            <Post.Title
              title={`🔖${selectedCategory} 등록된 포스트가 없습니다`}
            />
          ) : (
            <Post.Title title={`🔖${selectedCategory}  Posts`} />
          )}
          {filteredPosts.length > 0 && <Post.PostCards posts={filteredPosts} />}
        </Post>
      </Post.Wrapper>
    </main>
  );
}
