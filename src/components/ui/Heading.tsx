import s from './Heading.module.scss';

interface Props {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontSize: string;
  fontWeight:
    | 'thin'
    | 'extraLight'
    | 'light'
    | 'regular'
    | 'medium'
    | 'semiBold'
    | 'bold'
    | 'extraBold'
    | 'black';
  title: string;
}

export default function Heading({
  as: Component,
  fontSize,
  fontWeight,
  title,
}: Props) {
  return (
    <Component
      className={s.heading}
      style={{
        fontSize,
        fontWeight: getFontWeight(fontWeight),
      }}
    >
      {title}
    </Component>
  );
}

function getFontWeight(fontWeight: string) {
  const fontWeights: { [key: string]: number } = {
    thin: 100,
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  };

  return fontWeights[fontWeight];
}
