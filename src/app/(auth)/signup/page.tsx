'use client';

import Link from 'next/link';

import { Flex, Spacing, Text } from '@/components/ui';
import { SignupForm } from './_components';

export default function SignupPage() {
  return (
    <>
      <Spacing size={32} />
      <SignupForm />
      <Spacing size={24} />
      <Flex justifyContent="center">
        <Text as="span" fontSize="medium" fontWeight="regular" color="#2e2e2e">
          계정이 이미 있나요?{' '}
          <Link href="/login">
            <Text
              as="span"
              fontSize="medium"
              fontWeight="regular"
              color="#ff6b00"
            >
              로그인
            </Text>
          </Link>
        </Text>
      </Flex>
      <Spacing size={40} />
    </>
  );
}
