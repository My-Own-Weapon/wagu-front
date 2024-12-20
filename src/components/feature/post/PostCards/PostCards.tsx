'use client';

import { PostCard } from '@/components';
import { Spacing, Stack, Text } from '@/components/ui';
import React, { Dispatch, Fragment, SetStateAction } from 'react';
import useGetMyPost from '@/feature/post/applications/hooks/useGetMyPost';
import { useIntersectionObserver } from '@/feature/_hooks';
import { isLastIndex } from '@/utils';
import { CategoriesWithAllEN } from '@/types';

interface PostCardsProps {
  category: CategoriesWithAllEN;
  setHasPosts: Dispatch<SetStateAction<boolean>>;
}

export default function PostCards({ category, setHasPosts }: PostCardsProps) {
  const { posts, fetchNextPage, hasNextPage, isFetching } = useGetMyPost();
  const { ref } = useIntersectionObserver({
    onIntersect: (entry) =>
      handleIntersect({
        entry,
        fetchNextPage,
        hasNextPage,
        isFetching,
      }),
  });
  const filteredPosts = filterPosts(posts, category);

  setHasPosts(filteredPosts.length > 0);

  return (
    <Stack as="ul" data-testid="post-cards">
      {filteredPosts.map((post, idx) => {
        return (
          <Fragment key={post.postId}>
            <PostCard {...post} priority={idx <= 1} />
            {idx !== posts.length - 1 && <Spacing size={24} />}
            {isLastIndex(filteredPosts, idx) && (
              <div ref={ref} key={post.postId} style={{ height: '1px' }} />
            )}
          </Fragment>
        );
      })}
    </Stack>
  );
}

const handleIntersect = ({
  entry,
  fetchNextPage,
  hasNextPage,
  isFetching,
}: {
  entry: IntersectionObserverEntry;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
}) => {
  if (entry?.isIntersecting && hasNextPage && !isFetching) {
    fetchNextPage?.();
  }
};

const filterPosts = (
  posts: ReturnType<typeof useGetMyPost>['posts'],
  category: CategoriesWithAllEN,
) => {
  return category !== 'ALL'
    ? posts.filter((post) => post.category === category)
    : posts;
};
