'use client';

import { MouseEventHandler } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';

import { localStorageApi } from '@/services/localStorageApi';
import { apiService } from '@/services/apiService';

import s from './index.module.scss';

export default function MainHeader() {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const handleClickLogout: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      await apiService.logout();
      localStorageApi.setName('');
      router.push('/login');
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  return (
    <header
      className={s.container}
      style={segment === 'search' ? { backgroundColor: '#1c0a00' } : {}}
    >
      <div>
        <Link href="/">
          <p className={s.logoTitle}>WAGU BOOK</p>
        </Link>
      </div>
      <div className={s.navBtnArea}>
        {segment !== 'search' ? (
          <Link href="/search">
            <Image
              src="/newDesign/nav/search_glass.svg"
              alt="search-btn"
              width={24}
              height={24}
            />
          </Link>
        ) : (
          <div
            style={{
              width: 24,
              height: 24,
            }}
          />
        )}
        <div className={s.profileContainer}>
          <Image
            className={s.profileIcon}
            src="/newDesign/nav/user_profile.svg"
            alt="profile-btn"
            width={24}
            height={24}
          />
          <div className={s.dropdownMenu}>
            <Link className={s.myPage} href="/profile">
              마이페이지
            </Link>
            <div className={s.logout}>
              <button
                type="button"
                className={s.logoutBtn}
                onClick={handleClickLogout}
              >
                <p className={s.text}>로그아웃</p>
              </button>
              <Image
                src="/newDesign/sign_out.svg"
                alt="arrow-down"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
