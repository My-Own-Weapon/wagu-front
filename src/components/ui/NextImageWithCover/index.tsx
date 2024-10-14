import Image from 'next/image';
import type { ImageProps } from 'next/image';

interface props extends Omit<ImageProps, 'width' | 'height' | 'fill'> {
  id?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  backgroundColor?: string;
}

/**
 * @description next/image 컴포넌트를 이용해 props로 넘겨받은 width, height를
 *              이용해 이미지를 `object-fit : cover;하게 채워주는 컴포넌트
 * @param width 이미지를 채우고자 하는 요소의 width
 * @param height 이미지를 채우고자 하는 요소의 height
 * @link https://nextjs.org/docs/app/building-your-application/optimizing/images
 */
export default function NextImageWithCover({
  id = undefined,
  width = '100%',
  height = 'auto',
  borderRadius = undefined,
  backgroundColor = 'transparent',
  ...rest
}: props) {
  return (
    <div
      id={id}
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor,
      }}
    >
      <Image
        fill
        style={{
          objectFit: 'cover',
          borderRadius,
        }}
        {...rest}
      />
    </div>
  );
}
