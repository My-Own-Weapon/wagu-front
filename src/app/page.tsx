'use client';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import UserIcon from '@/components/UserIcon';

import { MouseEventHandler, useEffect, useState } from 'react';
import { apiService } from '@/services/apiService';
import { Post } from '@/components/Post';

import s from './page.module.scss';

interface Friend {
  memberId: number;
  username: string;
  each: boolean;
}

interface PostData {
  id: string;
  category: CategoryCodes;
  storeName: string;
  postMainMenu: string;
  postImage: string;
  postPrice: string;
  createDate: string;
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

type CategoryCodes = (typeof categoryMap)[Categories];

type Categories = keyof typeof categoryMap;

export default function Home() {
  const [allPosts, setAllPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [liveFriends, setLiveFriends] = useState<Friend[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categories>('전부');

  const handleCategoryClick: MouseEventHandler<HTMLUListElement> = (e) => {
    const target = e.target as HTMLElement;
    const li = target.closest('li');
    if (!li?.dataset) return;

    const category = li.dataset.category as Categories;
    setSelectedCategory(category);
  };

  async function fetchData() {
    try {
      const [postsData, liveFriendsData] = await Promise.all([
        apiService.fetchPosts(),
        apiService.fetchLiveFriends(),
      ]);

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
        <p>📺 방송중인 친구가 있어요옹오오 15:52</p>
        <ul className={s.friendsList}>
          {liveFriends.map(({ memberId, username }) => (
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
      <div className={s.categoryContainer}>
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
      </div>
      <div className={s.postsContainer}>
        <Post>
          <Post.Title title={`🔖${selectedCategory}  Posts`} />
          <Post.PostCards posts={filteredPosts} />
        </Post>
      </div>
    </main>
  );
}

function getCategories() {
  return [
    {
      id: 'category0',
      name: '전부',
    },
    {
      id: 'category1',
      name: '한식',
    },
    {
      id: 'category2',
      name: '중식',
    },
    {
      id: 'category3',
      name: '일식',
    },
    {
      id: 'category4',
      name: '양식',
    },
    {
      id: 'category5',
      name: '분식',
    },
    {
      id: 'category6',
      name: '카페',
    },
    {
      id: 'category7',
      name: '디저트',
    },
  ];
}
