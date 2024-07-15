import { MouseEventHandler } from 'react';
import useDragScroll from '@/hooks/useDragScroll';
import s from './CategoryList.module.scss';
import Image from 'next/image';
import classNames from 'classnames';

type CategoriesKR = keyof typeof categoryMap | null;
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
  path: string;
  heading: string;
  selectedCategory: CategoriesKR;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function CategoryList({
  path,
  heading,
  selectedCategory,
  onClick,
}: Props) {
  const ref = useDragScroll();
  const categoryBookSize = path === '/write' ? 24 : 40;
  const containerClassName = classNames({
    [s.mainPageContainer]: path === '/',
    [s.writePageContainer]: path === '/write',
  });

  return (
    <div className={containerClassName}>
      <div className={s.titleArea}>
        <Image
          src="/images/books/books.svg"
          width={20}
          height={20}
          alt="books-icon"
        />
        <p className={s.title}>{heading}</p>
      </div>
      <ul className={s.categoriesWrapper} ref={ref}>
        {getCategories(path).map(({ id, name, imgUrl }) => (
          <li key={id} className={name === selectedCategory ? s.active : ''}>
            <button
              type="button"
              className={s.categoryBtn}
              data-category={name}
              name="postCategory"
              onClick={onClick}
            >
              <Image
                width={categoryBookSize}
                height={categoryBookSize}
                src={imgUrl}
                alt="category"
              />
              <p
                className={s.categoryText}
              >{`${path === '/write' ? '#' : ''}${name}`}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getCategories(path: string) {
  const initialCategories = [
    {
      id: 'category1',
      name: '한식',
      imgUrl: 'images/books/red-book.svg',
    },
    {
      id: 'category2',
      name: '중식',
      imgUrl: 'images/books/purple-book.svg',
    },
    {
      id: 'category3',
      name: '일식',
      imgUrl: 'images/books/mint-book.svg',
    },
    {
      id: 'category4',
      name: '양식',
      imgUrl: 'images/books/yellow-book.svg',
    },
    {
      id: 'category5',
      name: '분식',
      imgUrl: 'images/books/lilac-book.svg',
    },
    {
      id: 'category6',
      name: '카페',
      imgUrl: 'images/books/gray-book.svg',
    },
    {
      id: 'category7',
      name: '디저트',
      imgUrl: 'images/books/coral-book.svg',
    },
  ];

  return path === '/'
    ? [
        {
          id: 'category0',
          name: '전부',
          imgUrl: 'images/books/orange-book.svg',
        },
        ...initialCategories,
      ]
    : initialCategories;
}
