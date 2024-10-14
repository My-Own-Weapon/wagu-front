import { ReviewFormValues } from '@/types';
import React from 'react';
import { UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';

interface Props {
  currentPageIdx: number;
  setCurrentPageIdx: React.Dispatch<React.SetStateAction<number>>;
  reviewFieldLength: number;
  append: UseFieldArrayAppend<ReviewFormValues>;
  remove: UseFieldArrayRemove;
}

const usePageIndexControl = ({
  currentPageIdx,
  setCurrentPageIdx,
  reviewFieldLength,
  append,
  remove,
}: Props) => {
  const handleNextPage = () => {
    setCurrentPageIdx((prev) => Math.min(prev + 1, reviewFieldLength - 1));
  };

  const handlePrevPage = () => {
    setCurrentPageIdx((prev) => Math.max(prev - 1, 0));
  };

  const handleAddReview = () => {
    append({
      menuName: '',
      menuPrice: '',
      menuContent: '',
      image: null,
    });
    setCurrentPageIdx(reviewFieldLength); // Move to the newly added menu
  };

  const handleDeleteReview = () => {
    if (reviewFieldLength > 1) {
      remove(currentPageIdx);
      setCurrentPageIdx((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  return {
    handleNextPage,
    handlePrevPage,
    handleAddReview,
    handleDeleteReview,
  };
};

export default usePageIndexControl;
