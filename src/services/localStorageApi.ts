'use client';

class LocalStorage {
  private NAME = 'name';

  private USERNAME = 'username';

  getUserName() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.USERNAME);
    }

    return null;
  }

  setUserName(name: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USERNAME, name);
    }
  }

  getName() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.NAME);
    }
    return null; // or any other default value
  }

  setName(name: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.NAME, name);
    }
  }
}

export const localStorageApi = new LocalStorage();
