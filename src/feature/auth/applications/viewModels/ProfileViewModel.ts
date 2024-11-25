import { z } from 'zod';

import ViewModel from '@/feature/_lib/ViewModel';

class ProfileViewModel extends ViewModel {
  private readonly userId: number;
  private readonly userName: string;
  private readonly profileImageUrl: string;
  private readonly fullName: string;

  constructor(props: ProfileViewModelProps) {
    super(props);
    this.userId = props.userId;
    this.userName = props.userName;
    this.profileImageUrl =
      props.profileImageUrl ?? '/public/profile/profile-default-icon-male.svg';
    this.fullName = props.fullName;
  }

  // eslint-disable-next-line class-methods-use-this
  protected override validateProps(props: ProfileViewModelProps) {
    return profileViewModelProps.parse(props);
  }

  getUserName() {
    return this.userName;
  }

  getProfileImageUrl() {
    return this.profileImageUrl;
  }

  getFullName() {
    return this.fullName;
  }

  getUserId() {
    return this.userId;
  }
}

const profileViewModelProps = z.object({
  userId: z.number(),
  userName: z.string(),
  profileImageUrl: z.string().nullable(),
  fullName: z.string(),
});
export type ProfileViewModelProps = z.infer<typeof profileViewModelProps>;

export default ProfileViewModel;
