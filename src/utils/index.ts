/* eslint-disable @typescript-eslint/no-unused-vars */

export const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

type CookieProtocols = 'username' | 'JSESSIONID';

export const getCookieValue = (name: CookieProtocols) => {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return value ? value.split('=')[1] : null;
};
