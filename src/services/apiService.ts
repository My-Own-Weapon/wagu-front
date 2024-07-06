import { LoginUserInputs, SignupDetails } from '@/types';

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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

    console.log('---------------------------------');
    console.log('api', res);
    console.log(res.headers.get('set-cookie'));
    console.log('---------------------------------');

    return res;
  }

  async signup({
    username,
    password,
    passwordConfirm,
    name,
    phoneNumber,
  }: SignupDetails) {
    console.log(this.baseUrl);
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
    console.log(res);

    return res;
  }

  async fetchPosts({ cookie }: { cookie: string }) {
    console.log(cookie);

    const res = await fetch(`${this.baseUrl}/followers`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  }
}

export const apiService = new ApiService();
