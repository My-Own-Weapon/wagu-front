interface Props {
  size: 4 | 8 | 16 | 20 | 24 | 32 | 40 | 96;
}

export default function Spacing({ size }: Props) {
  return (
    <div
      style={{
        /**
         * `flex: 'none'` is equivalent to `flex-grow: 0; flex-shrink: 0;`
         * This means that the element will not grow or shrink.
         */
        flex: 'none',
        height: size,
      }}
      aria-hidden="true"
    />
  );
}
