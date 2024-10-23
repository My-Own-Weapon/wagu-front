'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Friend } from '@/types';

export default function useFetchLiveFollowings() {
  const [liveFollowings, setLiveFollowings] = useState<Friend[]>([]);

  useEffect(() => {
    async function fetchLiveFriends() {
      try {
        const liveFriendsData = await apiService.fetchLiveFollowings();
        setLiveFollowings(liveFriendsData);
      } catch (e) {
        if (e instanceof Error) {
          alert(
            e.message || '실시간 친구 데이터를 불러오는데 에러가 발생했습니다',
          );
        }
      }
    }

    fetchLiveFriends();
  }, []);

  return { liveFollowings };
}
