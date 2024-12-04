'use client';

import React, { FormEventHandler, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AddressSearchDetails } from '@/types';
import { apiService } from '@services/apiService';
import { BoxButton, Container, Flex, Spacing } from '@/components/ui';
import Camera from '@/app/(live)/live/_components/Camera';
import { AddressSearchSection } from '@/app/(post)/write/_components';

export default function PrepareLivePage() {
  const [addressSearchResult, setAddressSearchResult] =
    useState<AddressSearchDetails>({
      address: '',
      storeName: '',
      posx: '',
      posy: '',
    });
  const [isCameraOn, toggleCamera] = useReducer((state) => !state, false);
  const router = useRouter();

  const handleClickLiveStart: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!addressSearchResult.address) {
      alert('가게 정보를 입력해주세요');
      return;
    }
    const { sessionId } = await apiService.createSessionId(addressSearchResult);

    alert('라이브 방송을 시작합니다.');

    router.push(`/live/${sessionId}`);
  };

  const handleClickCameraOnOff = () => {
    toggleCamera();
  };

  return (
    <Container
      backgroundColor="#f5f6f8"
      style={{
        height: '100vh',
      }}
    >
      <div style={{ padding: '0 24px' }}>
        <Spacing size={24} />
        <AddressSearchSection
          addressSearchResult={addressSearchResult}
          onAddressSelect={setAddressSearchResult}
        />
        <Spacing size={40} />

        <Camera isCameraOn={isCameraOn} />
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: '80px',
          maxWidth: 'calc(410px - 48px)',
          width: 'calc(100% - 48px)',
          padding: '0 24px',
        }}
      >
        <Flex gap="16px" justifyContent="space-between">
          <BoxButton onClick={handleClickLiveStart}>라이브 시작</BoxButton>
          <BoxButton onClick={handleClickCameraOnOff} styleType="outline">
            {isCameraOn ? '카메라 테스트 종료' : '카메라 테스트 시작'}
          </BoxButton>
        </Flex>
      </div>
    </Container>
  );
}
