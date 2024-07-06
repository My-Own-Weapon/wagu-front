'use client';

import { apiService } from '@/services/apiService';
import s from './page.module.scss';

export default function Home() {
  return (
    <main className={s.container}>
      <h1>wagu book</h1>
      <button
        className={s.btn}
        type="button"
        onClick={async () => {
          try {
            const res2 = await apiService.addPost();
            console.log('res2 : ', res2);
          } catch (error) {
            if (error instanceof Error) {
              console.error(error.message);
            }
          }
        }}
      />
    </main>
  );
}
