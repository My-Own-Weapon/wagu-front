import { MouseEventHandler } from 'react';
import useDragScroll from '@/hooks/useDragScroll';
import s from './CategoryList.module.scss';

type CategoriesKR = keyof typeof categoryMap;
// type CategoriesEN = (typeof categoryMap)[CategoriesKR];

const categoryMap = {
  전부: 'ALL',
  한식: 'KOREAN',
  일식: 'JAPANESE',
  중식: 'CHINESE',
  분식: 'FASTFOOD',
  양식: 'WESTERN',
  카페: 'CAFE',
  디저트: 'DESSERT',
} as const;

interface Props {
  heading: string;
  selectedCategory: CategoriesKR;
  onClick: MouseEventHandler<HTMLButtonElement | HTMLLIElement>;
}

export default function CategoryList({
  heading,
  selectedCategory,
  onClick,
}: Props) {
  const ref = useDragScroll();

  return (
    <div className={s.container}>
      <p>{heading}</p>
      <ul className={s.categoriesWrapper} ref={ref}>
        {getCategories().map(({ id, name }) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <li
            key={id}
            name="postCategory"
            data-category={name}
            onClick={onClick}
            className={name === selectedCategory ? s.active : ''}
          >
            <div className={s.textArea}>
              <span>📘</span>
              <p className={s.categoryText}>{name}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getCategories() {
  return [
    {
      id: 'category1',
      name: '한식',
    },
    {
      id: 'category2',
      name: '중식',
    },
    {
      id: 'category3',
      name: '일식',
    },
    {
      id: 'category4',
      name: '양식',
    },
    {
      id: 'category5',
      name: '분식',
    },
    {
      id: 'category6',
      name: '카페',
    },
    {
      id: 'category7',
      name: '디저트',
    },
  ];
}
