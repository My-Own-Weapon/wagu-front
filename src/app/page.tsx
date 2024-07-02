'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/services/ApiService';
import s from './page.module.scss';

export default function Home() {
  const [post, setPost] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await apiService.fetchPosts();
      setPost(data);
    };

    fetchPosts();
  }, []);

  return <main className={s.main}>{post}</main>;
}
