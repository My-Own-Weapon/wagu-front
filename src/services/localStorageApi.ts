/* eslint-disable class-methods-use-this */

'use client';

class LocalStorage {
  private USER_FULL_NAME = 'user_full_name';
  private USER_NAME = 'user_name';
  private USER_PROFILE_IMAGE_URL = 'user_profile_image_url';

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

  getUserProfileImageUrl() {
    return this.saveGet(this.USER_PROFILE_IMAGE_URL);
  }

  setProfileImage(profileImage: string) {
    this.saveSet(this.USER_PROFILE_IMAGE_URL, profileImage);
  }
}

export const localStorageApi = new LocalStorage();
