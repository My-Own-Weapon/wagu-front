'use server';

import { apiService } from '@/services/apiService';
import { SignupDetails } from '@/types';
import { redirect } from 'next/navigation';

interface SignupState {
  message: string;
  succ: boolean;
}
type SignupFields = keyof SignupDetails;

const convertToFormData = (
  formData: FormData,
): Record<SignupFields, string> => {
  const keys: SignupFields[] = [
    'username',
    'password',
    'passwordConfirm',
    'name',
    'phoneNumber',
  ];

  return keys.reduce(
    (acc, key) => {
      acc[key] = formData.get(key) as string;
      return acc;
    },
    {} as Record<SignupFields, string>,
  );
};

const signupUser = async (userInputs: Record<SignupFields, string>) => {
  try {
    await apiService.signup(userInputs);
    return { succ: true, message: '회원가입 성공' };
  } catch (error) {
    if (error instanceof Error) {
      return { succ: false, message: error.message };
    }

    return { succ: false, message: '알 수 없는 에러 발생' };
  }
};

export const handleSubmitAction = async (
  state: SignupState,
  formData: FormData,
) => {
  const userInputs = convertToFormData(formData);

  const result = await signupUser(userInputs);

  if (!result.succ) {
    return {
      message: result.message,
      succ: false,
    };
  }

  return redirect('/login');
};
