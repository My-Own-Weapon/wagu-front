'use client';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable camelcase */ // for KAKAO API response

import React, {
  useState,
  useRef,
  useEffect,
  useReducer,
  PropsWithChildren,
} from 'react';
import Image from 'next/image';

import { apiService } from '@/services/apiService';
import { PropsWithNotUndefinedChildren } from '@/components/ui/_types';
import { AddressSearchDetails } from '@/types';

import s from './AddressInput.module.scss';

interface AddressInputProps {
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

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
}

function Overlay({
  open,
  onClose,
  onClick,
  children,
}: PropsWithChildren<OverlayProps>) {
  const STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
    zIndex: 9999,
  } as const;

  return open ? (
    <div
      style={{ ...STYLE }}
      onClick={onClick}
      onWheel={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  ) : null;
}

// function Overlay({ onClick }: { onClick: () => void }) {
//   return (
//     <div
//       className={s.overlay}
//       onClick={onClick}
//       onWheel={(e) => e.stopPropagation()}
//     />
//   );
// }

export default function AddressInput({ value, onSelect }: AddressInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<KAKAOSearchAddressResponse[]>([]);
  const [isOpen, toggleModal] = useReducer((isOpen) => !isOpen, false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        toggleModal();
      }
    };

    const preventDefault = (e: Event) => {
      if (isOpen) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.addEventListener('drag', preventDefault);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (isOpen) {
        document.removeEventListener('drag', preventDefault);
      }
    };
  }, [inputRef, isOpen]);

  const fetchKakaoAddress = async (
    query: string,
  ): Promise<KAKAOSearchAddressResponse[]> => {
    const res = await apiService.fetchKAKAOStoreInfo(query);

    return res.documents;
  };

  const handleSelect = (addressSearchDetails: AddressSearchDetails) => {
    onSelect(addressSearchDetails);
    setQuery(addressSearchDetails.address);
    toggleModal();
  };

  const handleSearchClick = async () => {
    if (!query) return;

    const fetchedResults = await fetchKakaoAddress(query);
    setResults(fetchedResults);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchClick();
  };

  return (
    <>
      <AdressSearchTrigger onClick={toggleModal}>
        주소를 검색하면 식당 정보가 자동으로 입력됩니다.
      </AdressSearchTrigger>
      {isOpen && (
        <div className={`${s.container} ${isOpen ? s.blur : ''}`}>
          <div ref={inputRef}>
            <div
              className={`${s.addressInputWrapper} ${isOpen ? s.expanded : ''}`}
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
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  readOnly={!isOpen}
                />
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
              {results.length > 0 && !!results ? (
                <ul
                  className={s.results}
                  data-testid="address-search-results"
                  onWheel={(e) => e.stopPropagation()}
                >
                  {/* Stack 사용해서 리팩토링 */}
                  {results.map(({ id, address_name, place_name, x, y }) => (
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
                  ))}
                </ul>
              ) : (
                <p className={s.resultText}>검색결과가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface AdressSearchTriggerProps {
  onClick: () => void;
}

function AdressSearchTrigger({
  onClick,
  children,
}: PropsWithNotUndefinedChildren<AdressSearchTriggerProps>) {
  const handleClick = () => {
    if (!onClick) return;

    onClick();
  };

  return (
    <button
      type="button"
      style={{
        width: '100%',
        height: '48px',
        padding: 0,

        fontWeight: 500,
        fontSize: '14px',
        textAlign: 'left',
        color: '#acaeb3',

        backgroundColor: '#fff',
        borderBottom: '1px solid #cdd0d8',
      }}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
