import { apiService } from '@/services/apiService';

import { useMutation } from '@tanstack/react-query';
import type { CategoriesEN } from '@/types';

interface AiReviewResponse {
  menuContent: string;
}

interface MutateProps {
  category: CategoriesEN;
  menuName: string;
}

const useFetchAIAutoReview = () => {
  const {
    mutate: fetchAIAutoReview,
    data: autoReview,
    isPending,
  } = useMutation<AiReviewResponse, Error, MutateProps>({
    mutationFn: ({ category, menuName }) => {
      return apiService.fetchAIAutoReview({ category, menuName });
    },
  });

  return {
    fetchAIAutoReview,
    autoReview,
    isPending,
  };
};

export default useFetchAIAutoReview;
