import { ComponentPropsWithoutRef } from 'react';

interface Props extends ComponentPropsWithoutRef<'div'> {
  mountRefCallback: (node: HTMLDivElement | null) => void;
}

export default function Map({ mountRefCallback, ...rest }: Props) {
  return <div {...rest} ref={mountRefCallback} />;
}
