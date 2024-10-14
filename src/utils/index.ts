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

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // 날짜가 유효한지 확인
    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch (error) {
    return '알 수 없는 작성일';
  }
};

export interface ResultProps<T, E> {
  (Ok: () => T, Err: (e: Error) => E): T | E;
}

export const Result: ResultProps<void, void> = async (Ok, Err) => {
  try {
    return await Ok();
  } catch (e) {
    if (e instanceof Error) {
      return Err(e);
    }
    return new Error('An unknown error occurred');
  }
};
