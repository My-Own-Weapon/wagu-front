import React from 'react';

import type { AddressSearchDetails } from '@/types';

import InputBoxWrapper from '@/app/(post)/write/_components/InputBoxWrapper';
import { Heading, Text } from '@/components/ui';
import { AddressInput } from '@/components';

interface Props {
  addressSearchResult: AddressSearchDetails;
  onAddressSelect: (addressInfo: AddressSearchDetails) => void;
}

export default function AddressSearchSection({
  addressSearchResult,
  onAddressSelect,
}: Props) {
  return (
    <InputBoxWrapper gap={addressSearchResult.address ? '16px' : '12px'}>
      <Heading as="h3" color="black" fontWeight="semiBold" fontSize="16px">
        식당 정보
      </Heading>
      {!!addressSearchResult.address && !!addressSearchResult.storeName && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          {/* <p className={s.storeName}>{addressSearchResult.address}</p> */}
          <Text
            as="p"
            color="gray"
            fontSize="medium"
            fontWeight="medium"
            style={{
              lineHeight: '150%',
              letterSpacing: '-0.05em',
            }}
          >
            {addressSearchResult.storeName}
          </Text>
          {/* <p className={s.storeAddress}>{addressSearchResult.storeName}</p> */}
          <Text
            as="p"
            color="gray"
            fontSize="medium"
            fontWeight="medium"
            style={{
              lineHeight: '150%',
              letterSpacing: '-0.05em',
            }}
          >
            {addressSearchResult.address}
          </Text>
        </div>
      )}
      <AddressInput
        value={addressSearchResult.storeName || ''}
        onSelect={onAddressSelect}
      />
    </InputBoxWrapper>
  );
}
