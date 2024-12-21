import { Post } from '@/feature/post/domains/post';

export interface MyPostsPort {
  posts: Post[];
  getPosts: () => Promise<void>;
}
