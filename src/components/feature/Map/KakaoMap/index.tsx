import { ComponentPropsWithoutRef } from 'react';

interface Props extends ComponentPropsWithoutRef<'div'> {
  mountRefCallback: (node: HTMLDivElement | null) => void;
}

export default function KakaoMap({ mountRefCallback, ...rest }: Props) {
  return <div {...rest} ref={mountRefCallback} />;
}
