'use client';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */ // for KAKAO API response

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

import { apiService } from '@/services/apiService';
import InputBox from '@/components/ui/InputBox';

import { AddressSearchDetails } from '@/app/(post)/write/page';

import s from './AddressInput.module.scss';

interface AddressInputProps {
  title: string;
  value: string;
  onSelect: (addressSearchResult: AddressSearchDetails) => void;
}

interface KAKAOSearchAddressResponse {
  id: string;
  address_name: string;
  place_name: string;
  x: string;
  y: string;
  place_url: string;
}

export default function AddressInput({
  title,
  value,
  onSelect,
}: AddressInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<KAKAOSearchAddressResponse[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    const preventDefault = (e: Event) => {
      if (isFocused) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    if (isFocused) {
      document.addEventListener('drag', preventDefault);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (isFocused) {
        document.removeEventListener('drag', preventDefault);
      }
    };
  }, [inputRef, isFocused]);

  const fetchKakaoAddress = async (
    query: string,
  ): Promise<KAKAOSearchAddressResponse[]> => {
    const res = await apiService.fetchKAKAOStoreInfo(query);

    return res.documents;
  };

  const handleSelect = (addressSearchDetails: AddressSearchDetails) => {
    onSelect(addressSearchDetails);
    setQuery(addressSearchDetails.address);
    setIsFocused(false);
  };

  const handleSearchClick = async () => {
    const fetchedResults = await fetchKakaoAddress(query);

    setResults(fetchedResults);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchClick();
  };

  return (
    <div className={`${s.container} ${isFocused ? s.blur : ''}`}>
      {isFocused && (
        <div ref={inputRef}>
          <div
            className={`${s.addressInputWrapper} ${isFocused ? s.expanded : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.searchArea}>
              <input
                className={s.addressInput}
                id="address"
                name="address"
                placeholder="ex) 스타벅스, 이디야"
                type="text"
                value={query}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                readOnly={!isFocused}
              />
              {/* <Button text="검색" type="button" onClick={handleButtonClick} /> */}
              <button
                className={s.searchBtn}
                type="button"
                onClick={handleSearchClick}
              >
                <Image
                  src="/images/search-glass.svg"
                  alt="검색"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            <ul className={s.results} onWheel={(e) => e.stopPropagation()}>
              {results.map(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ({ id, address_name, place_name, x, y }) => (
                  <li
                    key={id}
                    onClick={() => {
                      handleSelect({
                        address: address_name,
                        storeName: place_name,
                        posx: x,
                        posy: y,
                      });
                    }}
                  >
                    <div className={s.searchResult}>
                      <p className={s.storeName}>{place_name}</p>
                      <div className={s.loadNameArea}>
                        <span className={s.badge}>도로명</span>
                        <p className={s.loadName}>{address_name}</p>
                      </div>
                    </div>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}
      {!isFocused && (
        <div>
          <InputBox
            height="30px"
            label={title}
            placeholder="가게 이름을 입력하면 주소가 자동완성됩니다."
            name="address"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            readOnly={!isFocused}
          />
        </div>
      )}
    </div>
  );
}
