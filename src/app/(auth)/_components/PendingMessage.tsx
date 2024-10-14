import { useFormStatus } from 'react-dom';

import { PropsWithNotUndefinedChildren } from '@/components/ui/_types';
import Text from '@/components/ui/Text';

interface Props {
  isPending?: boolean;
}

/**
 * @description form 상태에 따른 메시지를 보여주는 컴포넌트
 * @warning form 태그 내부에서 사용해야 합니다.
 *
 * @example
 * <form>
 *  {...other components}
 *  <LoginPending />
 * </form>
 */
export default function PendingMessage({
  isPending = undefined,
  children,
}: PropsWithNotUndefinedChildren<Props>) {
  const { pending: serverActionPending } = useFormStatus();

  return (
    (isPending || serverActionPending) && (
      <Text
        role="status"
        as="p"
        fontSize="medium"
        fontWeight="regular"
        color="#2e2e2e"
      >
        {children}
      </Text>
    )
  );
}
