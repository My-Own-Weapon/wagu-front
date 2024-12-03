/* eslint-disable class-methods-use-this */

'use client';

class LocalStorage {
  private USER_FULL_NAME = 'user_full_name';
  private USER_NAME = 'user_name';
  private PROFILE_IMAGE = 'profile_image';

  private saveGet(key: string) {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem(key);
  }

  private saveSet(key: string, value: string) {
    if (typeof window === 'undefined') return;

    localStorage.setItem(key, value);
  }

  getUserName() {
    return this.saveGet(this.USER_NAME);
  }

  setUserName(name: string) {
    this.saveSet(this.USER_NAME, name);
  }

  getUserFullName() {
    return this.saveGet(this.USER_FULL_NAME);
  }

  setUserFullName(name: string) {
    this.saveSet(this.USER_FULL_NAME, name);
  }

  getProfileImage() {
    return this.saveGet(this.PROFILE_IMAGE);
  }

  setProfileImage(profileImage: string) {
    this.saveSet(this.PROFILE_IMAGE, profileImage);
  }
}

export const localStorageApi = new LocalStorage();
