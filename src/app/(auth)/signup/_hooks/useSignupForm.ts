import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import { SignupDetails } from '@/types';
import { handleSubmitAction } from '../_lib/handleSubmitAction';

interface SignupFormInputs extends SignupDetails {}

export function useSignupForm() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormInputs>({
    mode: 'onChange',
  });

  const inputFieldRegister = (
    name: keyof SignupFormInputs,
  ): UseFormRegisterReturn => {
    const validationRules = {
      username: {
        required: '아이디는 필수 입력 사항입니다',
        pattern: {
          value: /^[a-zA-Z0-9]+$/,
          message: '아이디는 영문과 숫자만 입력 가능합니다',
        },
        maxLength: {
          value: 20,
          message: '아이디는 최대 20자까지 입력 가능합니다.',
        },
      },

      password: {
        required: '비밀번호는 필수 입력 사항입니다',
        minLength: {
          value: 3,
          message: '비밀번호는 3자 이상 입력해주세요',
        },
      },

      passwordConfirm: {
        required: '비밀번호 확인은 필수 입력 사항입니다',
        minLength: {
          value: 3,
          message: '비밀번호는 3자 이상 입력해주세요',
        },
        validate: (value: string) => {
          return value === watch('password') || '비밀번호가 일치하지 않습니다';
        },
      },

      name: {
        required: '이름은 필수 입력 사항입니다',
        pattern: {
          value: /^[가-힣]+$/,
          message: '한글 이름을 입력해 주세요',
        },
      },

      phoneNumber: {
        required: '휴대폰 번호는 필수 입력 사항입니다',
        pattern: {
          value: /^\d{3}-\d{4}-\d{4}$/,
          message: '- 를 포함한 휴대폰 번호를 입력해 주세요 ex) 010-1234-5678',
        },
      },
    };

    return register(name, validationRules[name]);
  };

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof SignupFormInputs] as string);
    });

    const result = await handleSubmitAction(
      { message: '', succ: true },
      formData,
    );

    if (result === undefined) {
      return;
    }

    if (!result.succ) {
      alert(result.message);
    }
  });

  return {
    inputFieldRegister,
    errors,
    isValid,
    isSubmitting,
    onSubmit,
  };
}
