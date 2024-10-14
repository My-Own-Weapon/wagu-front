'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

import BackBtn from '@components/BackBtn';
import SlotHeader from '@/components/ui/SlotHeader';
import Heading from '@/components/ui/Heading';

const headerConfig = {
  login: {
    title: '로그인',
    goto: '/entry',
  },
  signup: {
    title: '회원가입',
    goto: '/entry',
  },
} as const;

export default function AuthHeader() {
  const segment = useSelectedLayoutSegment();
  if (segment === 'entry') return null;

  const { title, goto } = headerConfig[segment as keyof typeof headerConfig];

  return (
    <SlotHeader>
      <SlotHeader.Left>
        <BackBtn goto={goto} />
      </SlotHeader.Left>
      <SlotHeader.Center>
        <Heading as="h2" fontSize="20px" fontWeight="semiBold" color="black">
          {title}
        </Heading>
      </SlotHeader.Center>
    </SlotHeader>
  );
}
