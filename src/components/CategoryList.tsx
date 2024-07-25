import React, { MouseEventHandler } from 'react';

import { CategoriesWithAllEN } from '@/types';
import * as Icons from '@public/newDesign/categories/index';
import { categoryMapWithAll } from '@/constants/categoty';

import s from './CategoryList.module.scss';

interface Props {
  selectedCategory: CategoriesWithAllEN;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function CategoryList({ selectedCategory, onClick }: Props) {
  return (
    <div className={s.mainPageContainer}>
      <ul className={s.categoriesWrapper}>
        {getCategoryIcon().map(({ id, name, Icon }) => (
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
                {categoryMapWithAll[name as CategoriesWithAllEN]}
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
  name: CategoriesWithAllEN;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function getCategoryIcon(): Category[] {
  return [
    {
      id: 'category-0',
      name: 'ALL',
      Icon: Icons.FoodAllSVG,
    },
    {
      id: 'category-1',
      name: 'KOREAN',
      Icon: Icons.KoreanSVG,
    },
    {
      id: 'category-2',
      name: 'CHINESE',
      Icon: Icons.ChineseSVG,
    },
    {
      id: 'category-3',
      name: 'WESTERN',
      Icon: Icons.WesternSVG,
    },
    {
      id: 'category-4',
      name: 'JAPANESE',
      Icon: Icons.JapaneseSVG,
    },
    {
      id: 'category-5',
      name: 'FASTFOOD',
      Icon: Icons.FastFoodSVG,
    },
    {
      id: 'category-6',
      name: 'CAFE',
      Icon: Icons.CafeSVG,
    },
    {
      id: 'category-7',
      name: 'DESSERT',
      Icon: Icons.DessertSVG,
    },
  ];
}
