'use client';

import UserIcon from '@/components/UserIcon';

import { useEffect, useState } from 'react';
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
  storeName: string;
  postMainMenu: string;
  postImage: string;
  postPrice: string;
  createDate: string;
}

export default function Home() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [liveFriends, setLiveFriends] = useState<Friend[]>([]);

  async function fetchData() {
    try {
      const [postsData, liveFriendsData] = await Promise.all([
        apiService.fetchPosts(),
        apiService.fetchLiveFriends(),
      ]);

      console.log(postsData, liveFriendsData);

      setPosts(postsData);
      setLiveFriends(liveFriendsData);
    } catch (error) {
      console.error('Fetching data failed:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className={s.container}>
      <div className={s.liveFriendsContainer}>
        <p>📺 방송중인 친구가 있어요</p>
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
        <ul className={s.categoriesList}>
          {getCategories().map(({ id, name }) => (
            <li key={id}>
              <span>📘</span>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.postsContainer}>
        <Post>
          <Post.Title title="🔖 한식 Posts" />
          <Post.PostCards posts={posts} />
        </Post>
      </div>
    </main>
  );
}

function getCategories() {
  return [
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
