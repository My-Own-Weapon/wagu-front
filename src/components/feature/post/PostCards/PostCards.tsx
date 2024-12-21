'use client';

import { PostCard } from '@/components';
import { Spacing, Stack } from '@/components/ui';
import React, { Fragment } from 'react';
import { isLastIndex } from '@/utils';
import { Post } from '@/feature/post/domains/post';

interface PostCardsProps {
  posts: Post[];
  /* For infinite scroll */
  refElement?: React.RefCallback<HTMLElement>;
}

export default function PostCards({
  posts,
  refElement = undefined,
}: PostCardsProps) {
  return (
    <Stack as="ul" data-testid="post-cards">
      {posts.map((post, idx) => {
        return isLastIndex(posts, idx) ? (
          <IntersectionWrapper key={post.postId} refElement={refElement}>
            <PostCard {...post} priority={idx <= 1} />
            <Spacing size={24} />
          </IntersectionWrapper>
        ) : (
          <Fragment key={post.postId}>
            <PostCard {...post} priority={idx <= 1} />
          </Fragment>
        );
      })}
    </Stack>
  );
}

function IntersectionWrapper({
  children,
  refElement = undefined,
}: {
  children: React.ReactNode;
  refElement?: React.RefCallback<HTMLElement>;
}) {
  return <div ref={refElement}>{children}</div>;
}
