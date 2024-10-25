/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type SelectContextValue<T> = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: NonNullable<T>;
  onSelect: (newValue: NonNullable<T>) => void;
};

const SelectContext = createContext<SelectContextValue<any> | null>(null);

export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select');
  }
  return context;
};

interface SelectProps<T> {
  children: React.ReactNode;
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T;
}
export default function Select<T>({
  children,
  value: controlledValue = undefined,
  onChange = () => {},
  defaultValue = undefined,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || undefined);

  const isControlled = controlledValue !== undefined && onChange !== undefined;
  const value = isControlled ? controlledValue : selectedValue;

  const handleSelect = useCallback(
    (newValue: NonNullable<T>) => {
      if (!isControlled) {
        setSelectedValue(newValue);
      }
      if (onChange) {
        onChange(newValue);
      }
      setIsOpen(false);
    },
    [isControlled, onChange],
  );

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      value,
      onSelect: handleSelect,
    }),
    [isOpen, value, handleSelect],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends ComponentPropsWithoutRef<'button'> {}
Select.Trigger = function Trigger({ children, ...rest }: SelectTriggerProps) {
  const { isOpen, setIsOpen } = useSelectContext();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button
      onClick={handleClick}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};

interface SelectContentProps extends ComponentPropsWithoutRef<'ul'> {}
Select.Content = function Content({ children, ...rest }: SelectContentProps) {
  const { isOpen, setIsOpen } = useSelectContext();
  const contentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ul ref={contentRef} role="listbox" tabIndex={-1} {...rest}>
      {children}
    </ul>
  );
};

interface SelectGroupProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
}
Select.Group = function Group({ children, label, ...rest }: SelectGroupProps) {
  return (
    <div role="group" aria-label={label} {...rest}>
      {children}
    </div>
  );
};

interface SelectItemProps extends ComponentPropsWithoutRef<'li'> {
  value: any;
  children: ReactNode;
}
Select.Item = function Item({
  value: itemValue,
  children,
  ...rest
}: SelectItemProps) {
  const { value, onSelect } = useSelectContext();

  const handleSelect = () => {
    onSelect(itemValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter') {
      handleSelect();
    }
  };

  return (
    <li
      role="option"
      aria-selected={value === itemValue}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      {...rest}
    >
      {children}
    </li>
  );
};
