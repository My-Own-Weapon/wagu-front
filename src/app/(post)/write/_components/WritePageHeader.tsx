'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

import { SlotHeader } from '@/components/ui';
import { BackBtn } from '@/components';

export default function WritePageHeader() {
  const segment = useSelectedLayoutSegment();

  if (segment === 'entry') return null;

  return (
    <SlotHeader>
      <SlotHeader.Left>
        <BackBtn goto="back" />
      </SlotHeader.Left>
    </SlotHeader>
  );
}
