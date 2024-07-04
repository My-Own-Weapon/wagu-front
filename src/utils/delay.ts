/* eslint-disable @typescript-eslint/no-unused-vars */

export const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
