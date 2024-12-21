import { Post } from '@/feature/post/domains/post';
import { CategoriesWithAllEN } from '@/types';

const filterPosts = (posts: Post[], category: CategoriesWithAllEN) => {
  return category !== 'ALL'
    ? posts.filter((post) => post.menu.category === category)
    : posts;
};

export default filterPosts;
