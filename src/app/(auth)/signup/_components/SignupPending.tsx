import { useFormStatus } from 'react-dom';

export default function SignupPending() {
  const { pending } = useFormStatus();

  return pending ? <div>회원가입중...</div> : null;
}
