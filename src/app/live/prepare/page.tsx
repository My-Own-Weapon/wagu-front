import Camera from './Camera';
import s from './page.module.scss';

export default function LivePreparePage() {
  return (
    <main className={s.container}>
      <Camera />
    </main>
  );
}
