import InputBox from '@/components/ui/InputBox';
import { ErrorMessage, PendingMessage } from '@/app/(auth)/_components';
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
        <InputBox>
          {(id) => (
            <>
              <InputBox.Label htmlFor={id}>아이디</InputBox.Label>
              <InputBox.Input
                width="100%"
                height={56}
                id={id}
                type="text"
                placeholder="아이디를 입력해 주세요"
                {...inputFieldRegister('username')}
              />
            </>
          )}
        </InputBox>
        {errors.username && (
          <>
            <Spacing size={16} />
            <ErrorMessage role="alert">{errors.username.message}</ErrorMessage>
          </>
        )}
        <Spacing size={40} />
        <InputBox>
          {(id) => (
            <>
              <InputBox.Label htmlFor={id}>비밀번호</InputBox.Label>
              <InputBox.Input
                id={id}
                height={56}
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                {...inputFieldRegister('password')}
              />
            </>
          )}
        </InputBox>
        {errors.password && (
          <>
            <Spacing size={16} />
            <ErrorMessage role="alert">{errors.password.message}</ErrorMessage>
          </>
        )}
        <Spacing size={40} />
        <InputBox>
          {(id) => (
            <>
              <InputBox.Label htmlFor={id}>비밀번호 확인</InputBox.Label>
              <InputBox.Input
                id={id}
                height={56}
                type="password"
                placeholder="비밀번호를 다시 입력해 주세요"
                {...inputFieldRegister('passwordConfirm')}
              />
            </>
          )}
        </InputBox>
        {errors.passwordConfirm && (
          <>
            <Spacing size={16} />
            <ErrorMessage role="alert">
              {errors.passwordConfirm.message}
            </ErrorMessage>
          </>
        )}
        <Spacing size={40} />
        <InputBox>
          {(id) => (
            <>
              <InputBox.Label htmlFor={id}>이름</InputBox.Label>
              <InputBox.Input
                id={id}
                height={56}
                type="text"
                placeholder="실명을 입력해 주세요"
                {...inputFieldRegister('name')}
              />
            </>
          )}
        </InputBox>
        {errors.name && (
          <>
            <Spacing size={16} />
            <ErrorMessage role="alert">{errors.name.message}</ErrorMessage>
          </>
        )}
        <Spacing size={40} />
        <InputBox>
          {(id) => (
            <>
              <InputBox.Label htmlFor={id}>휴대폰 번호</InputBox.Label>
              <InputBox.Input
                id={id}
                height={56}
                type="tel"
                placeholder="000-0000-0000"
                {...inputFieldRegister('phoneNumber')}
              />
            </>
          )}
        </InputBox>
        {errors.phoneNumber && (
          <>
            <Spacing size={16} />
            <ErrorMessage role="alert">
              {errors.phoneNumber.message}
            </ErrorMessage>
          </>
        )}
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
