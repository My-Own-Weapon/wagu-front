import s from './Spinner.module.scss';

export default function Spinner() {
  return (
    <div className={s.spinnerOverlay}>
      <div className={s.spinner} />
    </div>
  );
}
