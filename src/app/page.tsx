'use client';

import axios from 'axios';
// import { headers } from 'next/headers';
import s from './page.module.scss';

export default function Home() {
  return (
    <main className={s.container}>
      <h1>wagu book</h1>
      <button
        className={s.btn}
        type="button"
        onClick={async () => {
          // const decodedSessionId = decodeURIComponent(sessionCookie);
          // JSESSIONID=6E4C6223A0076ACDA51F74C5527749BB; Path=/; HttpOnly

          console.log('document.cookie : ', document.cookie);

          // const decodedCookie = decodeURIComponent(document.cookie);
          // console.log('decodedCookie : ', decodedCookie);

          const [cookieValue] = document.cookie.split('; ');

          console.log(cookieValue);
          const [, sesstionId] = cookieValue.split('Cookie=');

          console.log('sesstionId : ', sesstionId);

          // console.log('key : ', key);
          // console.log('cookieValue :', cookieValue);

          // // eslint-disable-next-line @typescript-eslint/no-unused-vars
          // // const a = decodedSessionId.split('Cookie=JSESSIONID=').join('');
          // // 값을 디코딩합니다.
          // const [withoutOption] = cookieValue.split('; ');

          // console.log('', withoutOption);

          // console.log('without cookie', withoutOption);

          // const selectCookie = undecodedCookie;

          // console.log('@selected cookie :', selectCookie);
          try {
            // const res = await fetch(`http://3.39.118.22:8080/posts`, {
            //   method: 'GET',
            //   credentials: 'include',
            // });

            const res = await axios.get(`http://3.39.118.22:8080/posts`, {
              withCredentials: true,
            });

            console.log('befroe : ', res);
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </main>
  );
}
