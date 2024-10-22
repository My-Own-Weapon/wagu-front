import { ComponentProps } from 'react';

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

export const $ = (selector: string, parent: ParentNode = document) => {
  return parent.querySelector(selector);
};

export const createElementWithAttr = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attrMap: ComponentProps<K>,
) => {
  const el = document.createElement(tagName);
  (Object.keys(attrMap) as Array<keyof ComponentProps<K>>).forEach((attr) => {
    /* setAttribute로 사용시 추론이 명확히 되지만 onClick과 같은 핸들러 등록시에 분기문이 많아지기에
       type을 any로 변경하고 코드의 가독성을 높임  */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any)[attr] = attrMap[attr];
  });

  return el;
};

export const elementsAppendChild = (
  elementArr: Array<HTMLElement> | HTMLElement,
  target: HTMLElement,
) => {
  if (Array.isArray(elementArr)) {
    const fragment = document.createDocumentFragment();
    elementArr.forEach((element) => fragment.appendChild(element));
    target.appendChild(fragment);
    return;
  }

  target.appendChild(elementArr);
};

export const removeChild = (
  element: HTMLElement | string,
  target: ParentNode = document,
) => {
  if (typeof element === 'string') {
    const el = $(element);
    if (!el) throw new Error('해당 element가 존재하지 않습니다.');

    target.removeChild(el);
    return;
  }

  if (typeof element === 'object') {
    target.removeChild(element);
    return;
  }

  throw new Error('string 또는 HTMLElement만 가능합니다.');
};
