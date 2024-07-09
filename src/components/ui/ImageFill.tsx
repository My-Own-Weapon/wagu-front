import Image from 'next/image';

interface props {
  src: string;
  alt: string;
  fill?: boolean | undefined;
  height: string;
}

/**
 * @param height '100px'과 같이 단위를 포함한 문자열
 */
export default function ImageFill({ src, alt, fill = false, height }: props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
      }}
    >
      <Image src={src} alt={alt} fill={fill} />
    </div>
  );
}
