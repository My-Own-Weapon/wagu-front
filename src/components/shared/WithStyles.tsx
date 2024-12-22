import React from 'react';

interface WithStyleProps {
  style: React.CSSProperties;
  children?: React.ReactNode;
}

export default function WithStyles<T extends WithStyleProps>(
  Component: React.ComponentType<T>,
) {
  function WithStylesComponent({ style, children, ...rest }: T) {
    return (
      <Component {...(rest as T)} style={style}>
        {children}
      </Component>
    );
  }

  return WithStylesComponent;
}
