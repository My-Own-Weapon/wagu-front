class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  private accessToken = '';

  async signup(formData: FormData) {
    const res = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    return res;
  }

  async fetchPosts() {
    const res = await fetch(`${this.baseUrl}/allPosts`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  }
}

export const apiService = new ApiService();
