import React, { MouseEventHandler } from 'react';

import * as Icons from '@public/newDesign/categories/index';

import s from './CategoryList.module.scss';

type CategoriesKR = keyof typeof categoryMap;

interface Props {
  selectedCategory: CategoriesKR | null;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function CategoryList({ selectedCategory, onClick }: Props) {
  return (
    <div className={s.mainPageContainer}>
      <ul className={s.categoriesWrapper}>
        {getCategories().map(({ id, name, Icon }) => (
          <li key={id} className={s.category}>
            <button
              type="button"
              className={s.categoryBtn}
              data-category={name}
              name="postCategory"
              onClick={onClick}
            >
              <Icon fill={name === selectedCategory ? '#000' : '#b0b2b8'} />
              <p
                className={`${s.categoryText} ${name === selectedCategory ? s.active : ''}`}
              >
                {name}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Category {
  id: string;
  name: CategoriesKR;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const categoryMap = {
  전체: 'ALL',
  한식: 'KOREAN',
  일식: 'JAPANESE',
  중식: 'CHINESE',
  분식: 'FASTFOOD',
  양식: 'WESTERN',
  카페: 'CAFE',
  디저트: 'DESSERT',
} as const;

function getCategories(): Category[] {
  return [
    {
      id: 'category-0',
      name: '전체',
      Icon: Icons.FoodAllSVG,
    },
    {
      id: 'category-1',
      name: '한식',
      Icon: Icons.KoreanSVG,
    },
    {
      id: 'category-2',
      name: '중식',
      Icon: Icons.ChineseSVG,
    },
    {
      id: 'category-3',
      name: '양식',
      Icon: Icons.WesternSVG,
    },
    {
      id: 'category-4',
      name: '일식',
      Icon: Icons.JapaneseSVG,
    },
    {
      id: 'category-5',
      name: '분식',
      Icon: Icons.FastFoodSVG,
    },
    {
      id: 'category-6',
      name: '카페',
      Icon: Icons.CafeSVG,
    },
    {
      id: 'category-7',
      name: '디저트',
      Icon: Icons.DessertSVG,
    },
  ];
}
