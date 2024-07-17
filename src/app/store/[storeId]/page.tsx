'use client';

import { Post } from '@/components/Post';
import { apiService } from '@/services/apiService';
import { PostCardProps } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  params: { storeId: string };
}

export default function StorePage({ params }: Props) {
  const { storeId } = params;
  const [posts, setPosts] = useState<PostCardProps[]>([]);

  useEffect(() => {
    apiService
      .fetchPostsOfStore(Number(storeId))
      .then((postsData) => {
        setPosts(postsData);
      })
      .catch((e) => {
        alert(e.message);
      });
  });

  return (
    <div>
      <Post.Wrapper>
        <Post.PostCards posts={posts} />
      </Post.Wrapper>
    </div>
  );
}
