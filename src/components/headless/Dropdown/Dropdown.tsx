import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { zIndex } from '@/constants/theme';

const DropdownContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  $triggerRef: React.RefObject<HTMLButtonElement>;
} | null>(null);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown');
  }
  return context;
};

function Dropdown({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const $triggerRef = useRef<HTMLButtonElement>(null);
  const value = useMemo(() => ({ isOpen, setIsOpen, $triggerRef }), [isOpen]);

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
}

interface TriggerProps extends ComponentProps<'button'> {
  children: React.ReactNode;
}

Dropdown.Trigger = function Dropdown__Trigger({
  children,
  ...rest
}: TriggerProps) {
  const { isOpen, setIsOpen, $triggerRef } = useDropdownContext();

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Enter' || e.key === ' ') {
      setIsOpen(true);
    }
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const $trigger = $triggerRef.current;

    if (isOpen && $trigger?.contains(e.target as Node)) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
  };

  return (
    <button
      ref={$triggerRef}
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      data-testid="dropdown-trigger"
      {...rest}
    >
      {children}
    </button>
  );
};

Dropdown.Portal = function Dropdown__Portal({
  offsetX = 0,
  offsetY = 0,
  children,
}: {
  offsetX?: number;
  offsetY?: number;
  children: React.ReactNode;
}) {
  const { isOpen, $triggerRef } = useDropdownContext();

  const triggerRect = $triggerRef.current?.getBoundingClientRect();
  if (!triggerRect) return null;

  return (
    isOpen && (
      <div
        style={{
          position: 'fixed',
          top: `${triggerRect.bottom + window.scrollY + offsetY}px`,
          left: `${triggerRect.left + window.scrollX + offsetX}px`,
          zIndex: zIndex.dropDown,
        }}
      >
        {children}
      </div>
    )
  );
};

interface ContentProps extends ComponentProps<'ul'> {
  children: React.ReactNode;
}
Dropdown.Content = function Dropdown__Content({
  children,
  ...rest
}: ContentProps) {
  const { isOpen, setIsOpen, $triggerRef } = useDropdownContext();
  const $contentRef = useRef<HTMLUListElement>(null);
  const focusIndex = useRef(-1);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const $content = $contentRef.current;
      const $trigger = $triggerRef.current;

      if (
        $content &&
        !$content.contains(e.target as Node) &&
        !$trigger?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !$contentRef.current) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();

        const $menuItems = $contentRef.current.querySelectorAll(
          '[role="menuitem"]',
        ) as NodeListOf<HTMLElement>;
        if (!$menuItems?.length) return;

        /* 첫번째 arrowDown 일 때 */
        if (focusIndex.current === -1) {
          focusIndex.current = 0;
          $menuItems[focusIndex.current]!.focus();
          return;
        }

        focusIndex.current = (focusIndex.current + 1) % $menuItems.length;
        $menuItems[focusIndex.current]!.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();

        const $menuItems = $contentRef.current.querySelectorAll(
          '[role="menuitem"]',
        ) as NodeListOf<HTMLElement>;
        if (!$menuItems?.length) return;

        /* 첫번째 arrowUp 일 때 */
        if (focusIndex.current === -1) {
          focusIndex.current = $menuItems.length - 1;
          $menuItems[focusIndex.current]!.focus();
          return;
        }

        focusIndex.current =
          (focusIndex.current - 1 + $menuItems.length) % $menuItems.length;
        $menuItems[focusIndex.current]!.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      const $firstMenuItem = $contentRef.current?.querySelector(
        '[role="menuitem"]',
      ) as HTMLElement;
      if (!$firstMenuItem) return;

      $firstMenuItem.focus();
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [$triggerRef, isOpen, setIsOpen]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (
    event,
  ) => {
    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  return (
    isOpen && (
      <ul
        ref={$contentRef}
        role="menu"
        /** focus되지 않도록
         * @see https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation-and-the-tabindex-attribute
         */
        tabIndex={-1}
        data-testid="dropdown-content"
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </ul>
    )
  );
};

interface ItemProps extends ComponentProps<'li'> {
  children: React.ReactNode;
  onSelect?: (e: React.MouseEvent<HTMLLIElement>) => unknown;
  disabled?: boolean;
}
Dropdown.Item = function Dropdown__Item({
  children,
  onSelect = undefined,
  disabled = false,
  ...rest
}: ItemProps) {
  const { setIsOpen } = useDropdownContext();

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (!onSelect) return;
    if (disabled) {
      event.preventDefault();
      return;
    }

    onSelect(event);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (disabled) return;
    const { target } = e;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onSelect) {
          onSelect(e as unknown as React.MouseEvent<HTMLLIElement>);
          setIsOpen(false);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();

        const { nextElementSibling } = target as HTMLElement;
        if (!nextElementSibling) return;

        (nextElementSibling as HTMLElement).focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const { previousElementSibling } = target as HTMLElement;
        if (!previousElementSibling) return;

        (previousElementSibling as HTMLElement).focus();
        break;
      default:
        break;
    }
  };

  return (
    <li
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </li>
  );
};

Dropdown.Group = function Dropdown__Group({
  children,
  label,
  ...rest
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} {...rest}>
      {children}
    </div>
  );
};

Dropdown.Label = function Dropdown__Label({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) {
  return (
    <span role="presentation" tabIndex={-1} {...rest}>
      {children}
    </span>
  );
};

export default Dropdown;
