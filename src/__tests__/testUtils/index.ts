import { screen, waitFor } from '@testing-library/react';

export const $testId = (id: string) => screen.getByTestId(id);

export const $testIdQuery = (id: string) => screen.queryByTestId(id);

export const $testIdWaitFor = async (id: string, timeout?: number) => {
  return waitFor(() => $testId(id), { timeout });
};
