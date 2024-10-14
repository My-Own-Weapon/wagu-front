'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { PostOfStoreResponse } from '@/types';

export default function useFetchPosts() {
  const [posts, setPosts] = useState<PostOfStoreResponse[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsData = await apiService.fetchPosts({
          page: 0,
          count: 10,
        });
        setPosts(postsData);
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message || '포스트 데이터를 불러오는데 에러가 발생했습니다');
        }
      }
    }

    fetchPosts();
  }, []);

  return { posts };
}
