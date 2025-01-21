import { Post } from '@/feature/post/domain/Post';

export interface FetchMyPostPort {
  fetchMyPosts: ({
    page,
    size,
  }: {
    page: number;
    size: number;
  }) => Promise<Post[]>;
}
