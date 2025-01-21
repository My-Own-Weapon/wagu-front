import Link from 'next/link';

import { colors } from '@/constants/theme';
import { Flex, Spacing } from '@/components/layout';
import { Text } from '@/components/ui-kit';
import { LoginForm } from './_components/index';

import s from './page.module.scss';

export default function LoginPage() {
  return (
    <main className={s.container}>
      <LoginForm />

      <Spacing size={40} />

      <NotYetSignupText />
    </main>
  );
}

function NotYetSignupText() {
  return (
    <Flex justifyContent="center">
      <Text
        as="p"
        fontSize="medium"
        fontWeight="medium"
        color={colors.grayBlue800}
      >
        계정이 아직 없나요?{' '}
        <Link href="/signup">
          <Text
            as="span"
            fontSize="medium"
            fontWeight="medium"
            color={colors.primary}
          >
            회원가입
          </Text>
        </Link>
      </Text>
    </Flex>
  );
}
