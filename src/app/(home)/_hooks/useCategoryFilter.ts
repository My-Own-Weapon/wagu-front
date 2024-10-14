'use client';

import { useState, useMemo } from 'react';
import { PostOfStoreResponse, CategoriesWithAllEN } from '@/types';

export default function useCategoryFilter(posts: PostOfStoreResponse[]) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesWithAllEN>('ALL');

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return posts;
    }

    return posts.filter(({ category }) => category === selectedCategory);
  }, [posts, selectedCategory]);

  return { selectedCategory, setSelectedCategory, filteredPosts };
}
