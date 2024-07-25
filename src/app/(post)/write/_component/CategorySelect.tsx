/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client';

import React, { MouseEventHandler, useState } from 'react';

import { categoryMap } from '@/constants/categoty';
import { CategoriesEN } from '@/types';
import { CaretDownSVG, XSVG } from '@public/newDesign';
import Heading from '@/components/ui/Heading';

import s from './CategorySelect.module.scss';

interface Props {
  selectedCategory: CategoriesEN | null;
  onSelectCategory: (category: CategoriesEN | null) => void;
}

export default function CategorySelect({
  selectedCategory,
  onSelectCategory,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (category: CategoriesEN) => {
    onSelectCategory(category);
    setIsModalOpen(false);
  };

  const handleSelectClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={s.selectContainer}>
      <button
        className={s.selectButton}
        onClick={handleSelectClick}
        type="button"
      >
        <p className={s.selectText}>
          {selectedCategory
            ? categoryMap[selectedCategory]
            : '카테고리를 선택해보세요 !'}
        </p>
        <CaretDownSVG />
      </button>
      {isModalOpen && (
        /* ✅ TODO: Heading 클릭시에도 모달이 닫힘 */
        <div className={s.modalOverlay} onClick={handleCloseModal}>
          <div className={s.modalContent}>
            <div className={s.modalTitleArea}>
              <Heading
                as="h3"
                fontSize="20px"
                fontWeight="medium"
                title="카테고리를 선택하세요"
              />
              <button
                className={s.modalCloseBtn}
                onClick={handleCloseModal}
                type="button"
              >
                <XSVG />
              </button>
            </div>
            {Object.entries(categoryMap).map(([categoryEN, categoryKR]) => (
              <div
                key={categoryEN}
                className={s.option}
                onClick={() => handleChange(categoryEN as CategoriesEN)}
              >
                {categoryKR}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
