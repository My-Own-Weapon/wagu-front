/* eslint-disable class-methods-use-this */

import { UserStoragePort } from '@/feature/_shared/applications/port/out/UserStoragePort';
import { injectable } from 'tsyringe';

@injectable()
export default class LocalStorageAdapter implements UserStoragePort {
  private USER_FULL_NAME = 'user_full_name';
  private USER_NAME = 'user_name';
  private USER_PROFILE_IMAGE_URL = 'user_profile_image_url';
  private INSTALL_PROMPT_CLOSED_AT = 'install_prompt_closed_at';

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

  setProfileImageUrl(profileImage: string) {
    this.saveSet(this.USER_PROFILE_IMAGE_URL, profileImage);
  }

  getInstallPromptClosedAt() {
    return this.saveGet(this.INSTALL_PROMPT_CLOSED_AT);
  }

  setInstallPromptClosedAt(date: string) {
    this.saveSet('install_prompt_closed_at', date);
  }
}
