import React, { useEffect } from 'react';

import { CategoriesEN, ReviewFormValues } from '@/types';
import { UseFormSetValue } from 'react-hook-form';
import useFetchAIAutoReview from '@/app/(post)/write/_hooks/useFetchAiReview';

const useReviewInputsSection = ({
  selectedCategory,
  menuReviews,
  currentPageIdx,
  setValue,
  setIsLoading,
}: {
  selectedCategory: CategoriesEN | null;
  menuReviews: ReviewFormValues['menuReviews'];
  currentPageIdx: number;
  setValue: UseFormSetValue<ReviewFormValues>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { fetchAIAutoReview, autoReview, isPending } = useFetchAIAutoReview();

  const handleFetchAIAutoReview = () => {
    if (!selectedCategory) {
      alert('AI 자동완성을 위해 카테고리를 선택해주세요 !');
      return;
    }

    if (!menuReviews[currentPageIdx]?.menuName) {
      alert('AI 자동완성을 위해 메뉴 이름을 입력해주세요 !');
      return;
    }

    fetchAIAutoReview({
      category: selectedCategory,
      menuName: menuReviews[currentPageIdx]?.menuName,
    });
  };

  useEffect(() => {
    if (autoReview?.menuContent) {
      setValue(
        `menuReviews.${currentPageIdx}.menuContent`,
        autoReview.menuContent,
      );
    }
  }, [autoReview, currentPageIdx, setValue]);

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  return { handleFetchAIAutoReview };
};

export default useReviewInputsSection;
