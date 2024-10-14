import { Control, Controller } from 'react-hook-form';

import InputBoxWrapper from '@/app/(post)/write/_components/InputBoxWrapper';
import { Flex, Heading, ImageInput, NextImageWithCover } from '@/components/ui';
import { ReviewFormValues } from '@/types';

interface Props {
  control: Control<ReviewFormValues>;
  currentPageIdx: number;
  menuReviews: ReviewFormValues['menuReviews'];
}

export default function ImageInputSection({
  control,
  currentPageIdx,
  menuReviews,
}: Props) {
  return (
    <InputBoxWrapper gap="16px">
      <Heading as="h3" fontWeight="semiBold" fontSize="16px">
        이미지
      </Heading>
      {/*  */}
      <Flex justifyContent="center" gap="8px">
        {menuReviews[currentPageIdx]?.image && (
          <NextImageWithCover
            width="80px"
            height="80px"
            src={URL.createObjectURL(menuReviews[currentPageIdx].image!)}
            alt="preview"
            borderRadius="8px"
          />
        )}
        <Controller
          control={control}
          name={`menuReviews.${currentPageIdx}.image`}
          rules={{ required: true }}
          render={({ field }) => (
            <ImageInput
              width="80px"
              height="80px"
              label="이미지 추가"
              name={`menuReviews.${currentPageIdx}.image`}
              placeholder="+"
              accept="image/*"
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                field.onChange(file);
              }}
            />
          )}
        />
      </Flex>
    </InputBoxWrapper>
  );
}
