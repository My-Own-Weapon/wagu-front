import Image from 'next/image';

interface props {
  id?: string;
  width?: string;
  src: string;
  alt: string;
  fill?: boolean;
  height: string;
  borderRadius?: string;
  backgroundColor?: string;
}

/**
 * @param height '100px'과 같이 단위를 포함한 문자열
 */
export default function ImageFill({
  id = undefined,
  width = '100%',
  height = 'auto',
  src,
  alt,
  fill = false,
  borderRadius = '0',
  backgroundColor = 'transparent',
}: props) {
  if ((!fill && width === '100%') || !height) {
    throw new Error('fill이 false일 때 width를 100%로 설정할 수 없습니다.');
  }

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius,
        backgroundColor,
      }}
    >
      <Image
        id={id}
        src={src}
        alt={alt}
        fill={fill}
        style={{
          borderRadius: borderRadius || '0',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
