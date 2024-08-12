'use client';

import { Post } from '@/components/Post';
import { apiService } from '@/services/apiService';
import { PostOfStoreResponse } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  params: { storeId: string };
}

export default function StorePage({ params }: Props) {
  const { storeId } = params;
  const [posts, setPosts] = useState<PostOfStoreResponse[]>([]);

  useEffect(() => {
    apiService
      .fetchPostsOfStore(Number(storeId))
      .then((postsData) => {
        setPosts(postsData);
      })
      .catch((e) => {
        alert(e.message);
      });
  }, []);

  return (
    <div>
      <Post.Wrapper>
        <Post.PostCards posts={posts} />
      </Post.Wrapper>
    </div>
  );
}
