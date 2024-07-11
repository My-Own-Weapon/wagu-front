'use client';

import { ChangeEvent, FormEventHandler, useEffect, useState } from 'react';
import { apiService } from '@services/apiService';
import s from './page.module.scss';

interface PageState {
  category?: string;
  address?: string;
  name?: string;
  menu: string;
  price: string;
  review: string;
}

type PageStates = Record<number, PageState>;

export default function BoardPage() {
  const initialPageState: PageState = {
    menu: '',
    price: '',
    review: '',
  };

  const initialFirstPageState: PageState = {
    category: '',
    address: '',
    name: '',
    menu: '',
    price: '',
    review: '',
  };

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageStates, setPageStates] = useState<PageStates>({
    1: initialFirstPageState,
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleNextPage = () => {
    setPageNumber((prev) => {
      const newPageNumber = prev + 1;
      if (!pageStates[newPageNumber]) {
        setPageStates((prevStates) => ({
          ...prevStates,
          [newPageNumber]: initialPageState,
        }));
      }
      return newPageNumber;
    });
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setPageStates((prevStates) => ({
      ...prevStates,
      [pageNumber]: {
        ...prevStates[pageNumber],
        [id]: value,
      },
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    console.log(pageStates);

    const formData = new FormData();
    const currentState = pageStates[pageNumber];

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in currentState) {
      formData.append(key, currentState[key as keyof PageState] as string);
    }

    console.log(selectedFiles);

    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append('images', file);
      });
      console.log(formData.get('images'));
    }

    console.log(formData);

    const res = await apiService.addPost();
    console.log(res);
  };

  useEffect(() => {
    console.log(`페이지 전환, 현재 페이지 no. ${pageNumber}`);
  }, [pageNumber]);

  const currentState = pageStates[pageNumber];

  return (
    <main className={s.container}>
      <div className={s.wrapper}>
        <h1>게시판</h1>
        <p>현재 페이지 : {pageNumber}</p>
        <form className={s.inputWrapper} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="image">이미지 추가</label>
            <input
              id="image"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>
          {pageNumber === 1 && (
            <>
              <div>
                <label htmlFor="category">카테고리</label>
                <input
                  id="category"
                  type="text"
                  value={currentState.category || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="address">식당 주소</label>
                <input
                  id="address"
                  type="text"
                  value={currentState.address || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="name">식당 이름</label>
                <input
                  id="name"
                  type="text"
                  value={currentState.name || ''}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="menu">메뉴</label>
            <input
              id="menu"
              type="text"
              value={currentState.menu}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="price">가격</label>
            <input
              id="price"
              type="text"
              value={currentState.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="review">리뷰</label>
            <textarea
              id="review"
              value={currentState.review}
              onChange={handleChange}
            />
          </div>
          <button type="submit">제출</button>
        </form>
        <div className={s.btnArea}>
          <button type="button" onClick={handlePrevPage}>
            이전 페이지
          </button>
          <button type="button" onClick={handleNextPage}>
            다음 페이지
          </button>
        </div>
      </div>
    </main>
  );
}
