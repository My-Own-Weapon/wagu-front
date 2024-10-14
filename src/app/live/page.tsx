'use client';

import React, { FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AddressSearchDetails } from '@/types';
import { apiService } from '@services/apiService';
import AddressInput from '@/components/AddressInput';
import { BoxButton, Container } from '@/components/ui';
import Camera from '@/app/live/prepare/Camera';

export default function PrepareStreamingPage() {
  const [storeInfo, setStoreInfo] = useState<AddressSearchDetails | null>(null);
  const router = useRouter();

  const handleClickLiveStart: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!storeInfo) {
      alert('가게 정보를 입력해주세요');
      return;
    }

    const { sessionId } = await apiService.createSessionId(storeInfo);

    alert('라이브 방송을 시작합니다.');

    router.push(`/live/${sessionId}`);
  };

  return (
    <Container>
      <Camera />
      <AddressInput
        title="가게 이름"
        value={
          storeInfo ? `[${storeInfo?.storeName}] ${storeInfo?.address}` : ''
        }
        onSelect={setStoreInfo}
      />
      <BoxButton onClick={handleClickLiveStart}>라이브 시작</BoxButton>
    </Container>
  );
}
