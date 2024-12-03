'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';

import { localStorageApi } from '@/services/localStorageApi';
import { apiService } from '@/services/apiService';
import Dropdown from '@/components/headless/Dropdown/Dropdown';
import { colors } from '@/constants/theme';
import { Stack, Text, Flex } from '@/components/ui';

import s from './index.module.scss';

export default function MainHeader() {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const handleLogoutClick = async () => {
    try {
      await apiService.logout();
      localStorageApi.setUserFullName('');
      router.push('/login');
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  const handleMyPageClick = () => {
    alert('마이페이지 기능이 아직 준비되지 않았어요.');
  };

  return (
    <header
      className={s.container}
      style={segment === 'search' ? { backgroundColor: '#1c0a00' } : {}}
    >
      <Link href="/">
        <Text fontSize="big" fontWeight="regular" color={colors.primary}>
          WAGU BOOK
        </Text>
      </Link>
      <Flex justifyContent="center" gap={16}>
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
        <Dropdown>
          <Dropdown.Trigger
            style={{
              backgroundColor: 'transparent',
              margin: 0,
              padding: 0,
            }}
          >
            <Image
              style={{
                cursor: 'pointer',
              }}
              src="/newDesign/nav/user_profile.svg"
              alt="profile-btn"
              width={24}
              height={24}
            />
          </Dropdown.Trigger>
          <Dropdown.Portal offsetX={-80} offsetY={8}>
            <Dropdown.Content style={STYLE.dropdownContent}>
              <Stack>
                <Dropdown.Item
                  style={STYLE.dropDownItem}
                  onSelect={handleMyPageClick}
                >
                  <Flex
                    style={STYLE.dropDownItem}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      fontSize="medium"
                      fontWeight="medium"
                      color={colors.grayBlue800}
                    >
                      마이페이지
                    </Text>
                  </Flex>
                </Dropdown.Item>
                <Dropdown.Item
                  style={STYLE.dropDownItem}
                  onSelect={handleLogoutClick}
                >
                  <Flex
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      fontSize="medium"
                      fontWeight="medium"
                      color={colors.grayBlue800}
                    >
                      로그아웃
                    </Text>
                  </Flex>
                </Dropdown.Item>
              </Stack>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      </Flex>
    </header>
  );
}

const STYLE = {
  dropdownContent: {
    width: '100px',
    backgroundColor: colors.white,
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgb(0 0 0 / 10%)',
  },
  dropDownItem: {
    height: 40,
    cursor: 'pointer',
  },
};
