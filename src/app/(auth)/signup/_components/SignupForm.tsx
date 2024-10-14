import InputBox from '@/components/ui/InputBox';
import { PendingMessage } from '@/app/(auth)/_components';
import { Spacing, Stack, BoxButton } from '@/components/ui';
import { useSignupForm } from '@/app/(auth)/signup/_hooks/useSignupForm';

export default function SignupForm() {
  const { inputFieldRegister, errors, isValid, isSubmitting, onSubmit } =
    useSignupForm();

  return (
    <form
      style={{
        width: '100%',
      }}
      onSubmit={onSubmit}
    >
      <Stack padding="0 24px">
        <InputBox errorMessage={errors.username?.message}>
          <InputBox.Label>아이디</InputBox.Label>
          <InputBox.Input
            width="100%"
            height={56}
            type="text"
            placeholder="아이디를 입력해 주세요"
            {...inputFieldRegister('username')}
          />
        </InputBox>
        <Spacing size={40} />
        <InputBox errorMessage={errors.password?.message}>
          <InputBox.Label>비밀번호</InputBox.Label>
          <InputBox.Input
            height={56}
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            {...inputFieldRegister('password')}
          />
        </InputBox>
        <Spacing size={40} />
        <InputBox errorMessage={errors.passwordConfirm?.message}>
          <InputBox.Label>비밀번호 확인</InputBox.Label>
          <InputBox.Input
            height={56}
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요"
            {...inputFieldRegister('passwordConfirm')}
          />
        </InputBox>
        <Spacing size={40} />
        <InputBox errorMessage={errors.name?.message}>
          <InputBox.Label>이름</InputBox.Label>
          <InputBox.Input
            height={56}
            type="text"
            placeholder="실명을 입력해 주세요"
            {...inputFieldRegister('name')}
          />
        </InputBox>
        <Spacing size={40} />
        <InputBox errorMessage={errors.phoneNumber?.message}>
          <InputBox.Label>휴대폰 번호</InputBox.Label>
          <InputBox.Input
            height={56}
            type="tel"
            placeholder="000-0000-0000"
            {...inputFieldRegister('phoneNumber')}
          />
        </InputBox>
        <Spacing size={40} />
        <BoxButton
          width="100%"
          height="56px"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          회원가입
        </BoxButton>
        <Spacing size={16} />
        <PendingMessage>회원가입중...</PendingMessage>
      </Stack>
    </form>
  );
}
