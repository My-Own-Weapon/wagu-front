'use client';

import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BoxButton, InputBox, Spacing, Stack } from '@/components/ui';
import { PendingMessage } from '@/app/(auth)/_components';

import { apiService } from '@/services/apiService';
import { localStorageApi } from '@/services/localStorageApi';
import { LoginFormInputs } from '@/types';

interface Props {
  setErrorMsg: (msg: string | null) => void;
}

export default function LoginForm({ setErrorMsg }: Props) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormInputs>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (loginInputs) => {
    const { username, password } = loginInputs;

    try {
      await apiService.login({ username, password });
      localStorageApi.setUserName(username);
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(`${error.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack padding="0 24px">
        <Spacing size={20} />
        <InputBox errorMessage={errors.username?.message}>
          <InputBox.Label>아이디</InputBox.Label>
          <InputBox.Input
            height={56}
            placeholder="아이디를 입력해 주세요"
            type="text"
            {...register('username', {
              required: true,
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: '아이디는 영문과 숫자만 입력 가능합니다',
              },
              maxLength: {
                value: 20,
                message: '아이디는 최대 20자까지 입력 가능합니다.',
              },
            })}
          />
        </InputBox>
        <Spacing size={40} />
        <InputBox errorMessage={errors.password?.message}>
          <InputBox.Label>비밀번호</InputBox.Label>
          <InputBox.Input
            height={56}
            placeholder="비밀번호를를 입력해 주세요"
            type="password"
            {...register('password', {
              required: true,
              minLength: {
                value: 3,
                message: '비밀번호는 3자 이상 입력해주세요',
              },
            })}
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
        <PendingMessage isPending={isSubmitting}>로그인중...</PendingMessage>
      </Stack>
    </form>
  );
}
