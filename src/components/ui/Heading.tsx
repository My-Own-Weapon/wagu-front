interface Props {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontSize: string;
  fontWeight: string;
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
      style={{
        fontSize,
        fontWeight,
      }}
    >
      {title}
    </Component>
  );
}
