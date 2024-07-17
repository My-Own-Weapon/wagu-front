'use client';

import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';

import { apiService } from '@/services/apiService';
import UserCards, { User } from '@/components/UserCard';
import StoreCards, { Store } from '@/components/StoreCard';

import s from './page.module.scss';

type Tab = 'store' | 'user';

export default function SearchPage() {
  const [selectedTab, setSelectedTab] = useState<Tab>('store');
  const [searchStores, setSearchStores] = useState<Store[]>([]);
  const [users, setSearchUsers] = useState<User[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  async function fetchStorePosts(userInput: string) {
    const data = await apiService.searchStore(userInput);

    console.log(data);

    setSearchStores(data);
  }

  async function fetchUsers(userInput: string) {
    const data = await apiService.searchUsers(userInput);

    console.log(data);

    setSearchUsers(data);
  }

  const handleSelectTab: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!searchInputRef.current) return;

    const { name } = e.currentTarget;

    searchInputRef.current.value = '';
    setSelectedTab(name as Tab);
  };

  const handleSearchSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!searchInputRef.current) return;

    const userSearchText = searchInputRef.current.value;
    if (!userSearchText) alert('검색어를 입력해주세요 !');

    if (selectedTab === 'store') {
      fetchStorePosts(userSearchText);
    } else {
      fetchUsers(userSearchText);
    }
  };

  // console.log(searchResult);
  console.log(users);

  return (
    <div
      className={s.container}
      style={{
        backgroundColor: 'pink',
      }}
    >
      <nav className={s.tabWrapper}>
        <div className={s.tabBtnArea}>
          <button
            className={`${s.tab} ${selectedTab === 'store' && s.active}`}
            type="button"
            name="store"
            onClick={handleSelectTab}
          >
            store
          </button>
          <button
            className={`${s.tab} ${selectedTab === 'user' && s.active}`}
            type="button"
            name="user"
            onClick={handleSelectTab}
          >
            user
          </button>
        </div>
        <div className={s.searchArea}>
          <form className={s.searchForm} onSubmit={handleSearchSubmit}>
            <input
              className={s.searchInput}
              ref={searchInputRef}
              type="text"
              placeholder="검색어를 입력해주세요 !"
              required
            />
            <button className={s.submitBtn} type="submit">
              <Image
                src="/images/search-glass.svg"
                width={16}
                height={16}
                alt="search-btn"
              />
            </button>
          </form>
        </div>
      </nav>
      <ul className={s.searchResultWrapper}>
        {selectedTab === 'store' ? (
          <StoreCards stores={searchStores} />
        ) : (
          <UserCards users={users} />
        )}
      </ul>
    </div>
  );
}
