import Image from 'next/image';

interface props {
  id?: string;
  width?: string;
  src: string;
  alt: string;
  fill?: boolean | undefined;
  height: string;
  borderRadius?: string;
}

/**
 * @param height '100px'과 같이 단위를 포함한 문자열
 */
export default function ImageFill({
  id = undefined,
  width = '100%',
  height,
  src,
  alt,
  fill = false,
  borderRadius = '0',
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
      }}
    >
      <Image
        id={id}
        src={src}
        alt={alt}
        fill={fill}
        style={borderRadius ? { borderRadius } : { borderRadius: '0' }}
      />
    </div>
  );
}
