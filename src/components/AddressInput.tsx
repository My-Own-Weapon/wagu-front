/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */ // for KAKAO API response

'use client';

import React, {
  useState,
  ComponentPropsWithoutRef,
  ReactNode,
  MouseEventHandler,
  KeyboardEventHandler,
} from 'react';

import { apiService } from '@/services/apiService';
import { AddressSearchDetails } from '@/types';
import Select, { useSelectContext } from '@/components/headless/Select/Select';
import {
  Flex,
  InputBox,
  NextImageWithCover,
  Overlay,
  Spacing,
  Stack,
  Text,
} from '@/components/ui';
import { colors } from '@/constants/theme';

import s from './AddressInput.module.scss';

interface AddressInputProps {
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

export default function AddressInput({ onSelect }: AddressInputProps) {
  const handleSelect = (addressSearchDetails: AddressSearchDetails) => {
    onSelect(addressSearchDetails);
  };

  return (
    <Select onChange={handleSelect}>
      <Select.Trigger
        style={STYLE.TRIGGER}
        data-testid="address-search-trigger"
      >
        주소를 검색하면 식당 정보가 자동으로 입력됩니다.
      </Select.Trigger>
      <Select.Content>
        <SearchModal />
      </Select.Content>
    </Select>
  );
}

function SearchModal() {
  const { setIsOpen } = useSelectContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KAKAOSearchAddressResponse[]>([]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();

    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const fetchKakaoAddress = async (
    query: string,
  ): Promise<KAKAOSearchAddressResponse[]> => {
    const res = await apiService.fetchKAKAOStoreInfo(query);
    return res.documents;
  };

  const handleSearchClick = async () => {
    const fetchedResults = await fetchKakaoAddress(query);
    setResults(fetchedResults);
  };

  return (
    <Overlay close={() => setIsOpen(false)}>
      <div
        className={`${s.addressInputWrapper} ${results.length > 0 ? s.expanded : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex justifyContent="center" alignItems="center" gap={8}>
          <InputBox style={{ flexGrow: 1 }}>
            <InputBox.Input
              width="100%"
              height={48}
              name="address"
              placeholder="ex) 스타벅스, 이디야"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </InputBox>
          <ImageButton
            src="/images/search-glass.svg"
            alt="검색"
            width={20}
            height={20}
            onClick={handleSearchClick}
          />
        </Flex>
        {results.length > 0 ? (
          <Select.Group
            className={s.results}
            data-testid="address-search-results"
            label="검색결과"
          >
            {results.map(({ id, address_name, place_name, x, y }) => (
              <Select.Item
                key={id}
                value={{
                  address: address_name,
                  storeName: place_name,
                  posx: x,
                  posy: y,
                }}
              >
                <Stack>
                  <Text
                    as="p"
                    fontSize="medium"
                    fontWeight="medium"
                    color={colors.grayAsh900}
                  >
                    {place_name}
                  </Text>
                  <Spacing size={8} />
                  <Flex justifyContent="flex-start" alignItems="center" gap={4}>
                    <span className={s.badge}>도로명</span>
                    <Text
                      as="p"
                      fontSize="small"
                      fontWeight="regular"
                      color={colors.grayAsh700}
                      style={{
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {address_name}
                    </Text>
                  </Flex>
                </Stack>
              </Select.Item>
            ))}
          </Select.Group>
        ) : (
          <>
            <Spacing size={16} />
            <Text
              as="p"
              fontSize="medium"
              fontWeight="regular"
              color={colors.grayBlue700}
            >
              검색결과가 없습니다.
            </Text>
          </>
        )}
      </div>
    </Overlay>
  );
}

const STYLE = {
  TRIGGER: {
    width: '100%',
    height: '48px',
    padding: 0,
    fontWeight: 500,
    fontSize: '14px',
    textAlign: 'left',
    color: '#acaeb3',
    backgroundColor: '#fff',
    borderBottom: '1px solid #cdd0d8',
  },
} as const;

interface ImageButtonProps extends ComponentPropsWithoutRef<'button'> {
  width?: number;
  height?: number;
  src: string;
  alt: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  svgComponent?: ReactNode;
}

function ImageButton({
  src,
  alt,
  width = undefined,
  height = undefined,
  onClick = undefined,
  svgComponent = undefined,
  ...rest
}: ImageButtonProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <button
      type="button"
      style={{
        padding: 0,
        backgroundColor: 'transparent',
      }}
      onClick={handleClick}
      {...rest}
    >
      {svgComponent || (
        <NextImageWithCover src={src} alt={alt} width={width} height={height} />
      )}
    </button>
  );
}
