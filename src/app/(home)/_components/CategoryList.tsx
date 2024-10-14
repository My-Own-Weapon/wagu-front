import React, { MouseEventHandler } from 'react';

import * as Icons from '@public/newDesign/categories/index';
import { CategoriesWithAllEN, Category } from '@/types';
import { categoryMapWithAll } from '@/constants/categoty';
import { Container, Flex, Text } from '@/components/ui';
import { Button } from '@/components/headless';

import s from './styles/CategoryList.module.scss';

interface Props {
  selectedCategory: CategoriesWithAllEN;
  handleClickCategory: MouseEventHandler<HTMLButtonElement>;
}

export default function CategoryList({
  selectedCategory,
  handleClickCategory,
}: Props) {
  return (
    <Container>
      <ul className={s.categoriesWrapper} data-testid="category-list">
        {categoryIconInfo.map(({ id, name, IconSVG }) => (
          <li key={id}>
            <Flex justifyContent="center">
              <CategoryButton
                id={id}
                name={name}
                IconSVG={IconSVG}
                handleClickCategory={handleClickCategory}
                selectedCategory={selectedCategory}
              />
            </Flex>
          </li>
        ))}
      </ul>
    </Container>
  );
}

interface CategoryProps extends Category {
  selectedCategory: CategoriesWithAllEN;
  handleClickCategory: MouseEventHandler<HTMLButtonElement>;
}

function CategoryButton({
  name,
  IconSVG,
  selectedCategory,
  handleClickCategory,
}: CategoryProps) {
  const isSelected = name === selectedCategory;

  return (
    <Button
      className={s.categoryBtn}
      data-category={name}
      name="postCategory"
      onClick={handleClickCategory}
      aria-pressed={isSelected}
      aria-label={`Select ${categoryMapWithAll[name]} category`}
    >
      <IconSVG fill={isSelected ? '#000' : '#b0b2b8'} />
      <Text
        as="p"
        fontSize="small"
        fontWeight="semiBold"
        color={isSelected ? '#2e2e2e' : '#b0b2b8'}
        aria-hidden="true"
      >
        {categoryMapWithAll[name]}
      </Text>
    </Button>
  );
}

const categoryIconInfo = [
  {
    id: 'category-0',
    name: 'ALL',
    IconSVG: Icons.FoodAllSVG,
  },
  {
    id: 'category-1',
    name: 'KOREAN',
    IconSVG: Icons.KoreanSVG,
  },
  {
    id: 'category-2',
    name: 'CHINESE',
    IconSVG: Icons.ChineseSVG,
  },
  {
    id: 'category-3',
    name: 'WESTERN',
    IconSVG: Icons.WesternSVG,
  },
  {
    id: 'category-4',
    name: 'JAPANESE',
    IconSVG: Icons.JapaneseSVG,
  },
  {
    id: 'category-5',
    name: 'FASTFOOD',
    IconSVG: Icons.FastFoodSVG,
  },
  {
    id: 'category-6',
    name: 'CAFE',
    IconSVG: Icons.CafeSVG,
  },
  {
    id: 'category-7',
    name: 'DESSERT',
    IconSVG: Icons.DessertSVG,
  },
] satisfies Category[];
