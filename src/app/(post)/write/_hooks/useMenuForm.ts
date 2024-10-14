import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

interface FormValues {
  menuReviews: {
    menuName: string;
    menuPrice: string;
    menuContent: string;
    image?: File | null;
  }[];
}

const useMenuForm = () => {
  const { control, handleSubmit, watch, formState, setValue } =
    useForm<FormValues>({
      mode: 'onChange',
      defaultValues: {
        menuReviews: [
          {
            menuName: '',
            menuPrice: '',
            menuContent: '',
            image: null,
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'menuReviews',
  });

  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);

  const menuReviews = watch('menuReviews');

  const handleAddReview = () => {
    append({
      menuName: '',
      menuPrice: '',
      menuContent: '',
      image: null,
    });
    setCurrentPageIdx(fields.length); // Move to the newly added menu
  };

  const handleDeleteAdditionalMenu = () => {
    if (fields.length > 1) {
      remove(currentPageIdx);
      setCurrentPageIdx((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleNextPage = () => {
    setCurrentPageIdx((prev) => Math.min(prev + 1, fields.length - 1));
  };

  const handlePrevPage = () => {
    setCurrentPageIdx((prev) => Math.max(prev - 1, 0));
  };

  return {
    control,
    handleSubmit,
    formState,
    setValue,
    menuReviews,
    currentPageIdx,
    handleAddReview,
    handleDeleteAdditionalMenu,
    handleNextPage,
    handlePrevPage,
  };
};

export default useMenuForm;
