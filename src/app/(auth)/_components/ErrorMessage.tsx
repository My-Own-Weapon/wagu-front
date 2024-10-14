import { ReactNode } from 'react';

import Flex from '@/components/ui/Flex';
import Text from '@/components/ui/Text';

interface Props {
  align?: 'left' | 'center';
  role?: 'alert';
  children: ReactNode;
}

export default function ErrorMessage({
  align = 'left',
  role = 'alert',
  children,
}: Props) {
  return (
    <Flex justifyContent={align === 'left' ? 'flex-start' : 'center'}>
      <Text as="p" fontSize="small" fontWeight="medium" color="red" role={role}>
        {children}
      </Text>
    </Flex>
  );
}
