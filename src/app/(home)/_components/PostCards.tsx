import { PostOfStoreResponse } from '@/types';
import { PostCard } from '@/components';
import { Spacing, Stack } from '@/components/ui';
import { Fragment } from 'react';

export default function PostCards({ posts }: { posts: PostOfStoreResponse[] }) {
  return (
    <Stack as="ul" data-testid="post-cards">
      {posts.map((post: PostOfStoreResponse, idx) => (
        <Fragment key={post.postId}>
          <PostCard {...post} priority={idx <= 1} />
          {idx !== posts.length - 1 && <Spacing size={24} />}
        </Fragment>
      ))}
    </Stack>
  );
}
