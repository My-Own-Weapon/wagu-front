// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import BackButton from '@/components/BackBtn';
// import InputBox from '@/components/ui/InputBox';
// import { useFormState, useFormStatus } from 'react-dom';
// import { handleSubmitAction } from './handleSubmitAction';
// import s from './page.module.scss';

// interface State {
//   message: string | null;
// }

// export default function LoginPage() {
//   const [state, formAction] = useFormState<State, FormData>(
//     handleSubmitAction,
//     {
//       message: null,
//     },
//   );
//   const { pending } = useFormStatus();

//   return (
//     <main className={s.container}>
//       <div className={s.header}>
//         <BackButton />
//         <h1 className={s.title}>로그인</h1>
//       </div>
//       <form className={s.form} action={formAction}>
//         <InputBox
//           className={s.inputBox}
//           label="아이디"
//           name="username"
//           placeholder="아이디를 입력해 주세요"
//           type="text"
//         />
//         <InputBox
//           className={s.inputBox}
//           label="비밀번호"
//           name="password"
//           placeholder="비밀번호를를 입력해 주세요"
//           type="password"
//         />
//         <Pending />
//         {/* {state.message && <div className={s.error}>{state.message}</div>} */}
//         <button type="submit" className={s.loginBtn} disabled={pending}>
//           로그인
//         </button>
//       </form>
//       <div className={s.socialLogin}>
//         <div className={s.divider}>
//           <span>간편한 로그인</span>
//         </div>
//         <div className={s.socialButtons}>
//           <div className={s.socialButton}>
//             <Image src="/GoogleLogo.png" alt="Google" width={24} height={24} />
//           </div>
//           <div className={s.socialButton}>
//             <Image src="/KakaoLogo.png" alt="Kakao" width={24} height={24} />
//           </div>
//         </div>
//       </div>
//       <div className={s.footer}>
//         계정이 아직 없나요?{' '}
//         <Link href="/signup">
//           <span className={s.signupLink}>회원가입</span>
//         </Link>
//       </div>
//       <div className={s.homeIndicator} />
//     </main>
//   );
// }

// function Pending() {
//   const { pending } = useFormStatus();

//   if (pending) {
//     return <div>로그인중 중...</div>;
//   }

//   return null;
// }

// ('use client');

// import Image from 'next/image';
// import Link from 'next/link';
// import BackButton from '@/components/BackBtn';
// import InputBox from '@/components/ui/InputBox';
// // import { useFormState, useFormStatus } from 'react-dom';
// // import { handleSubmitAction } from './handleSubmitAction';
// import { apiService } from '@/services/apiService';
// import { ChangeEventHandler, FormEventHandler, useState } from 'react';
// import s from './page.module.scss';

// // interface State {
// //   message: string | null;
// // }

// export default function LoginPage() {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   // const [state, formAction] = useFormState<State, FormData>(
//   //   handleSubmitAction,
//   //   {
//   //     message: null,
//   //   },
//   // );
//   // const { pending } = useFormStatus();
//   const [loginInfo, setLoginInfo] = useState({
//     username: '',
//     password: '',
//   });

//   const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
//     const { name, value } = e.target;
//     setLoginInfo({
//       ...loginInfo,
//       [name]: value,
//     });
//   };

//   const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
//     e.preventDefault();

//     try {
//       console.log('loginInfo : ', loginInfo);
//       const res = await apiService.login(loginInfo);

//       console.log(res);

//       console.log(res.status === 200);

//       if (res.status === 200) {
//         const sessionId = res.headers.getSetCookie('JSESSIONID');
//         console.log('sessionId is :', sessionId);
//       }
//       // eslint-disable-next-line no-shadow
//     } catch (e) {
//       if (e instanceof Error) {
//         console.error(e.message);
//       }
//     }
//   };

//   return (
//     <main className={s.container}>
//       <div className={s.header}>
//         <BackButton />
//         <h1 className={s.title}>로그인</h1>
//       </div>
//       {/* <form className={s.form} action={formAction}> */}
//       <form className={s.form} onSubmit={handleSubmit}>
//         <InputBox
//           className={s.inputBox}
//           label="아이디"
//           name="username"
//           placeholder="아이디를 입력해 주세요"
//           onChange={handleChange}
//           type="text"
//         />
//         <InputBox
//           className={s.inputBox}
//           label="비밀번호"
//           name="password"
//           placeholder="비밀번호를를 입력해 주세요"
//           onChange={handleChange}
//           type="password"
//         />
//         {/* <Pending /> */}
//         {/* {state.message && <div className={s.error}>{state.message}</div>} */}
//         {/* <button type="submit" className={s.loginBtn} disabled={pending}> */}
//         <button type="submit" className={s.loginBtn}>
//           로그인
//         </button>
//       </form>
//       <div className={s.socialLogin}>
//         <div className={s.divider}>
//           <span>간편한 로그인</span>
//         </div>
//         <div className={s.socialButtons}>
//           <div className={s.socialButton}>
//             <Image src="/GoogleLogo.png" alt="Google" width={24} height={24} />
//           </div>
//           <div className={s.socialButton}>
//             <Image src="/KakaoLogo.png" alt="Kakao" width={24} height={24} />
//           </div>
//         </div>
//       </div>
//       <div className={s.footer}>
//         계정이 아직 없나요?{' '}
//         <Link href="/signup">
//           <span className={s.signupLink}>회원가입</span>
//         </Link>
//       </div>
//       <div className={s.homeIndicator} />
//     </main>
//   );
// }

// // function Pending() {
// //   const { pending } = useFormStatus();

// //   if (pending) {
// //     return <div>로그인중 중...</div>;
// //   }

// //   return null;
// // }
