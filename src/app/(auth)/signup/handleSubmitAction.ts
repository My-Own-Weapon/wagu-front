'use server';

import { apiService } from '@/services/apiService';
import { SignupDetails } from '@/types';
import { redirect } from 'next/navigation';

interface SignupState {
  message: string;
  succ: boolean;
}
type SignupField = keyof SignupDetails;

export const handleSubmitAction = async (
  state: SignupState,
  formData: FormData,
) => {
  const keys: SignupField[] = [
    'username',
    'password',
    'passwordConfirm',
    'name',
    'phoneNumber',
  ];
  const userInputs = keys.reduce(
    (acc, key) => {
      acc[key] = formData.get(key) as string;
      return acc;
    },
    {} as Record<SignupField, string>,
  );

  try {
    await apiService.signup({
      ...userInputs,
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: error.message,
        succ: false,
      };
    }
  }

  return redirect('/login');
};
