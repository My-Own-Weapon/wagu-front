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

export const formatNumberToKRW = (price: number) => {
  const formattedPrice = new Intl.NumberFormat('KR', {
    currency: 'KRW',
  }).format(price);

  return `${formattedPrice}원`;
};
