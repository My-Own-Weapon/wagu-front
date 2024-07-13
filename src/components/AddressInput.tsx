import React, {
  useState,
  ChangeEvent,
  useRef,
  useEffect,
  FormEvent,
} from 'react';

import { apiService } from '@/services/apiService';
import Button from '@/components/ui/Button';

import { AddressSearchDetails } from '@/app/(post)/write/page';

import s from './AddressInput.module.scss';

interface AddressInputProps {
  value: string;
  onSelect: (addressSearchResult: AddressSearchDetails) => void;
}

export default function AddressInput({ value, onSelect }: AddressInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<string[]>([]);
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

      // if (e.key === 'Enter') {
      //   e.preventDefault();
      // }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('drag', preventDefault, { passive: false });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown, {
        passive: false,
      });
      document.removeEventListener('drag', preventDefault, { passive: false });
    };
  }, [inputRef, isFocused]);

  const handleBlurBackgroundClick = () => {
    setIsFocused(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fetchedResults = await fetchKakaoAddress(query);
    setResults(fetchedResults);
  };

  const fetchKakaoAddress = async (query: string): Promise<string[]> => {
    const response = await apiService.fetchKAKAOStoreInfo(query);
    console.log(response);
    // Assuming `data` is defined and contains the necessary information
    return response.documents;
  };

  const handleSelect = (addressSearchDetails: AddressSearchDetails) => {
    onSelect(addressSearchDetails);
    setQuery(addressSearchDetails.address);
    setIsFocused(false);
  };

  const handleButtonClick = async () => {
    const fetchedResults = await fetchKakaoAddress(query);

    console.log(fetchedResults);
    setResults(fetchedResults);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <div className={`${s.container} ${isFocused ? s.blur : ''}`}>
      {isFocused && (
        <div
          className={s.blurBackground}
          onClick={handleBlurBackgroundClick}
          ref={inputRef}
        >
          <div
            className={`${s.addressInputWrapper} ${isFocused ? s.expanded : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.searchArea}>
              <input
                id="address"
                name="address"
                type="text"
                value={query}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                readOnly={!isFocused}
              />
              <Button text="검색" type="button" onClick={handleButtonClick} />
            </div>
            <ul className={s.results} onWheel={(e) => e.stopPropagation()}>
              {results.map(
                ({ id, address_name, place_name, x, y, place_url }) => (
                  <li
                    key={id}
                    onClick={() =>
                      handleSelect({
                        address: address_name,
                        storeName: place_name,
                        posx: x,
                        posy: y,
                      })
                    }
                  >
                    <p>{address_name}</p>
                    <p>{place_name}</p>
                    <p>{x}</p>
                    <p>{y}</p>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}
      {!isFocused && (
        <input
          id="address"
          name="address"
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          readOnly={!isFocused}
        />
      )}
    </div>
  );
}
