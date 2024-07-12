import { LoginUserInputs, SignupDetails } from '@/types';

class ApiService {
  private baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:9090';

  private mswBaseUrl = 'http://localhost:9090';

  private kakaoBaseUrl =
    'https://dapi.kakao.com/v2/local/search/keyword.json?query=';

  private accessToken = '';

  async login({ username, password }: LoginUserInputs) {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const data = await res.text();

    return data;
  }

  async signup({
    username,
    password,
    passwordConfirm,
    name,
    phoneNumber,
  }: SignupDetails) {
    const res = await fetch(`${this.baseUrl}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        passwordConfirm,
        name,
        phoneNumber,
      }),
    });

    return res.text();
  }

  async fetchPosts() {
    const res = await fetch(`${this.mswBaseUrl}/posts`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  }

  async fetchPost(postId: string) {
    const res = await fetch(`${this.baseUrl}/posts/${postId}`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  }

  /* ✅ TODO 
    parameter로 데이터를 받도록 수정 또한, swagger에 맞게 param type 생성 */
  // async addPost(postData: AddPostProps) {
  async addPost(formData: FormData) {
    const res = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  async fetchFollowings() {
    const res = await fetch(`${this.mswBaseUrl}/followings`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchKAKAOStoreInfo(name: string) {
    const url = `${this.kakaoBaseUrl}${encodeURIComponent(name)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK f117ced1de2bab59de8005c69892ed73`,
      },
    });
    const data = await res.json();

    return data;
  }
}

export const apiService = new ApiService();
