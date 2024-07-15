/* eslint-disable no-console */
/* eslint-disable no-irregular-whitespace */
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

export const consoleArt = () => {
  console.log(`
    　(　 .∧_∧
    　 )　(｡・ω・)
    　旦 ι''o,,_）～ 너와 나의 맛집 공유 !
    `);
};
