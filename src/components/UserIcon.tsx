import Image from 'next/image';

interface Props {
  name: string;
  width: number;
  height: number;
  imgSrc: string;
  alt: string;
  withText: boolean;
}

export default function UserIcon({
  imgSrc,
  name,
  alt,
  width,
  height,
  withText,
}: Props) {
  return (
    <div>
      <Image src={imgSrc} alt={alt} width={width} height={height} />
      {withText && <p>{name}</p>}
    </div>
  );
}
