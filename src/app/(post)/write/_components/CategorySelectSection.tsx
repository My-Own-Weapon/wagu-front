import type { CategoriesEN } from '@/types';

import CategorySelect from '@/app/(post)/write/_components/CategorySelect';
import InputBoxWrapper from '@/app/(post)/write/_components/InputBoxWrapper';
import { Heading } from '@/components/ui';
import React from 'react';

interface Props {
  selectedCategory: CategoriesEN | null;
  onSelectCategory: React.Dispatch<React.SetStateAction<CategoriesEN | null>>;
}

export default function CategorySelectSection({
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <InputBoxWrapper gap="16px">
      <Heading as="h3" color="black" fontWeight="semiBold" fontSize="16px">
        카테고리 선택
      </Heading>
      <CategorySelect
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
    </InputBoxWrapper>
  );
}
