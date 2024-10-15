import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import convertReviewToFormData from '@/app/(post)/write/_lib/convertReviewToFormData';
import { apiService } from '@/services/apiService';
import { AddressSearchDetails, CategoriesEN, ReviewFormValues } from '@/types';
import { Result } from '@/utils';

const useWritePageFormControl = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
    setValue,
  } = useForm<ReviewFormValues>({
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

  const menuReviews = watch('menuReviews');

  useEffect(() => {
    const [form] = document.forms;

    const ignoreFormSubmit = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    };

    form.addEventListener('keydown', ignoreFormSubmit);

    return () => {
      form.removeEventListener('keydown', ignoreFormSubmit);
    };
  }, []);

  const onReviewSubmit = async ({
    data,
    selectedCategory,
    addressSearchResult,
    // eslint-disable-next-line no-shadow
    menuReviews,
    router,
  }: {
    data: ReviewFormValues;
    selectedCategory: CategoriesEN | null;
    addressSearchResult: AddressSearchDetails;
    menuReviews: ReviewFormValues['menuReviews'];
    router: AppRouterInstance;
  }) => {
    console.log('실행');

    if (!selectedCategory) {
      alert('카테고리를 선택해주세요 !');
      return;
    }

    if (!menuReviews.every(({ menuName }) => !!menuName)) {
      alert('메뉴 정보를 모두 입력해주세요 !');
      return;
    }

    const formData = convertReviewToFormData({
      selectedCategory,
      addressSearchResult,
      data,
      menuReviews,
    });
    if (formData instanceof Error) {
      alert(formData.message);
      return;
    }

    Result(
      async () => {
        await apiService.addPost(formData);
        alert('포스트 작성 완료 !');
        router.push('/');
      },
      (e) => {
        alert(e.message);
      },
    );
  };

  return {
    control,
    handleSubmit,
    watch,
    isSubmitting,
    isValid,
    setValue,
    fields,
    append,
    remove,
    onReviewSubmit,
    menuReviews,
  };
};

export default useWritePageFormControl;
