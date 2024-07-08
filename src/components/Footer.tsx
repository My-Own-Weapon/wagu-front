import s from './Footer.module.scss';

export default function Footer() {
  return (
    <nav className={s.container}>
      <div>
        <span>🏠</span>
        <p>home</p>
      </div>
      <div>
        <span>🗳️</span>
        <p>vote</p>
      </div>
      <div>
        <span>✍️</span>
        <p>write</p>
      </div>
      <div>
        <span>🧭</span>
        <p>map</p>
      </div>
      <div>
        <span>📺</span>
        <p>홈</p>
      </div>
    </nav>
  );
}
