import React from 'react';

import type { AddressSearchDetails } from '@/types';

import InputBoxWrapper from '@/app/(post)/write/_components/InputBoxWrapper';
import { Heading, Spacing, Stack, Text } from '@/components/ui';
import { AddressInput } from '@/components';
import { colors } from '@/constants/theme';

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
      {Boolean(addressSearchResult.address) &&
        Boolean(addressSearchResult.storeName) && (
          <Stack>
            <Text
              as="p"
              color={colors.grayBlue900}
              fontSize="medium"
              fontWeight="semiBold"
              style={{
                lineHeight: '150%',
                letterSpacing: '-0.05em',
              }}
            >
              {addressSearchResult.storeName}
            </Text>
            <Spacing size={8} />
            <Text
              as="p"
              color={colors.grayBlue700}
              fontSize="medium"
              fontWeight="medium"
              style={{
                lineHeight: '150%',
                letterSpacing: '-0.05em',
              }}
            >
              {addressSearchResult.address}
            </Text>
          </Stack>
        )}
      <AddressInput onSelect={onAddressSelect} />
    </InputBoxWrapper>
  );
}
