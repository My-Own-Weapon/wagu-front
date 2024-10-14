import React from 'react';
import {
  Controller,
  Control,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';

import {
  Heading,
  InputBox,
  Spacing,
  Stack,
  TextareaBox,
} from '@/components/ui';
import { CategoriesEN, ReviewFormValues } from '@/types';
import { StarAISVG } from '@public/newDesign';
import { useReviewInputsSection } from '@/app/(post)/write/_hooks';

import s from './ReviewInputsSection.module.scss';

interface Props {
  control: Control<ReviewFormValues>;
  watch: UseFormWatch<ReviewFormValues>;
  setValue: UseFormSetValue<ReviewFormValues>;
  currentPageIdx: number;
  selectedCategory: CategoriesEN | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const INPUTBOX_WRAPPER_STYLE = {
  position: 'relative',
  padding: '16px',
  backgroundColor: '#fff',
  borderRadius: '16px',
};

export default function ReviewInputsSection({
  control,
  watch,
  setValue,
  currentPageIdx,
  selectedCategory,
  setIsLoading,
}: Props) {
  const menuReviews = watch('menuReviews');
  const { handleFetchAIAutoReview } = useReviewInputsSection({
    selectedCategory,
    menuReviews,
    currentPageIdx,
    setValue,
    setIsLoading,
  });

  return (
    <Stack as="div" style={INPUTBOX_WRAPPER_STYLE}>
      <Heading as="h3" fontWeight="semiBold" fontSize="16px">
        메뉴 {currentPageIdx + 1}
      </Heading>
      <Spacing size={16} />
      <Stack as="div">
        <Controller
          control={control}
          name={`menuReviews.${currentPageIdx}.menuName`}
          rules={{ required: true }}
          render={({ field }) => (
            <InputBox>
              <InputBox.Label>메뉴 이름</InputBox.Label>
              <InputBox.Input
                width="100%"
                placeholder="메뉴명을 입력해주세요. ex) 아메리카노"
                height={48}
                type="text"
                {...field}
              />
            </InputBox>
          )}
        />
        <Spacing size={40} />
        <Controller
          control={control}
          name={`menuReviews.${currentPageIdx}.menuPrice`}
          rules={{ required: true }}
          render={({ field }) => (
            <InputBox>
              <InputBox.Label>가격</InputBox.Label>
              <InputBox.Input
                height={48}
                placeholder="메뉴 가격을 입력해주세요"
                type="number"
                {...field}
              />
            </InputBox>
          )}
        />
        <Spacing size={40} />
        <button
          className={s.AIBtn}
          type="button"
          onClick={handleFetchAIAutoReview}
        >
          <StarAISVG />
        </button>
        <Controller
          control={control}
          name={`menuReviews.${currentPageIdx}.menuContent`}
          rules={{ required: true }}
          render={({ field }) => (
            <TextareaBox>
              {(id) => (
                <>
                  <TextareaBox.Label htmlFor={id}>리뷰</TextareaBox.Label>
                  <Spacing size={8} />
                  <TextareaBox.Textarea
                    id={id}
                    required
                    placeholder="리뷰를 입력해주세요 !"
                    {...field}
                  />
                </>
              )}
            </TextareaBox>
          )}
        />
      </Stack>
    </Stack>
  );
}
