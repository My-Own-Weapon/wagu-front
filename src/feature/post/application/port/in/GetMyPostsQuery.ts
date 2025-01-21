import { Post } from '@/feature/post/domain/Post';

export interface GetMyPostsQuery {
  fetchMyPosts: ({
    page,
    size,
  }: {
    page: number;
    size: number;
  }) => Promise<Post[]>;
}
