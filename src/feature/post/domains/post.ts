import { CategoriesWithAllEN } from '@/types';

export interface Post {
  postId: number;
  store: {
    name: string;
  };
  menu: {
    name: string;
    price: number;
    image: {
      id: number;
      url: string;
    };
    category: CategoriesWithAllEN;
  };
  date: {
    createdAt: string;
    updatedAt?: string;
  };
}
