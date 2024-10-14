import { ComponentProps, MouseEventHandler, ReactNode } from 'react';

export interface ButtonProps extends ComponentProps<'button'> {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: Exclude<ComponentProps<'button'>['type'], 'reset'>;
  children?: ReactNode;
}

export function Button({
  className = undefined,
  type = 'button',
  onClick = undefined,
  disabled = false,
  children = undefined,
  ...rest
}: ButtonProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={className}
      type={type === 'button' ? 'button' : 'submit'}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
