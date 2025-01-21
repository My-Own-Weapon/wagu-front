'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Flex, Spacing, Stack } from '@/components/layout';
import { BoxButton, InputBox, Text } from '@/components/ui-kit';
import { useRouter } from 'next/navigation';
import { colors } from '@/constants/theme';
import useLogin from '@/feature/user/adapter/in/useLogin';
import useLoginAlert from '@/feature/user/adapter/ui/useLoginAlert';
import { LoginUseCaseInput } from '@/feature/user/application/port/in/LoginUseCase';

const loginFormSchema = z.object({
  userName: z
    .string()
    .max(20, { message: '아이디는 최대 20자까지 입력 가능합니다.' })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: '아이디는 영문과 숫자만 입력 가능합니다.',
    }),
  password: z.string().min(3, { message: '비밀번호는 3자 이상 입력해주세요' }),
}) satisfies z.ZodType<LoginUseCaseInput>;

export default function LoginForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    setError: setFormError,
  } = useForm<LoginUseCaseInput>({
    mode: 'onChange',
    resolver: zodResolver(loginFormSchema),
  });
  const { alert } = useLoginAlert();
  const { login } = useLogin({
    onSuccess: (result) => {
      alert(`${result.data.userName}님 환영합니다.`);
      router.push('/');
    },
    onError: (error) => {
      const errorMessage =
        error.message || '아이디 또는 비밀번호를 확인해주세요';
      setFormError('root', { message: errorMessage });
      alert(errorMessage);
    },
  });

  console.log(errors.root);

  return (
    <>
      <form onSubmit={handleSubmit((userInputs) => login(userInputs))}>
        <Stack padding="0 24px">
          <Spacing size={20} />
          <InputBox errorMessage={errors.userName?.message}>
            <InputBox.Label>아이디</InputBox.Label>
            <InputBox.Input
              height={56}
              placeholder="아이디를 입력해 주세요"
              type="text"
              {...register('userName')}
            />
          </InputBox>
          <Spacing size={40} />
          <InputBox errorMessage={errors.password?.message}>
            <InputBox.Label>비밀번호</InputBox.Label>
            <InputBox.Input
              height={56}
              placeholder="비밀번호를를 입력해 주세요"
              type="password"
              {...register('password')}
            />
          </InputBox>
          <Spacing size={40} />
          <BoxButton
            width="100%"
            height="56px"
            styleType="fill"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            로그인
          </BoxButton>
          <Spacing size={16} />
        </Stack>
      </form>
      <LoginPendingMessage isPending={isSubmitting} />
      <LoginErrorMessage errorMessage={errors.root?.message || ''} />
    </>
  );
}

function LoginPendingMessage({ isPending }: { isPending: boolean }) {
  return (
    isPending && (
      <>
        <Spacing size={24} />
        <Flex justifyContent="center">
          <Text
            as="p"
            fontSize="medium"
            fontWeight="medium"
            color={colors.grayBlue800}
            role="status"
          >
            로그인중...
          </Text>
        </Flex>
      </>
    )
  );
}

function LoginErrorMessage({ errorMessage }: { errorMessage: string }) {
  const isError = !!errorMessage;

  return (
    isError && (
      <>
        <Spacing size={24} />
        <Flex justifyContent="center">
          <Text
            as="p"
            fontSize="medium"
            fontWeight="medium"
            color={colors.red600}
            role="status"
          >
            {errorMessage}
          </Text>
        </Flex>
      </>
    )
  );
}
