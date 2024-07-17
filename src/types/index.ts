export interface LoginUserInputs {
  username: string;
  password: string;
}

export interface SignupDetails {
  username: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phoneNumber: string;
}

export interface AddPostProps {
  postMainMenu: 'string';
  postImage: 'string';
  postContent: 'string';
  storeName: 'string';
  storeLocation: {
    address: 'string';
    posx: 0;
    posy: 0;
  };
  menus: [
    {
      menuName: 'string';
      menuPrice: 0;
      categoryName: 'string';
    },
  ];
  auto: true;
}

export interface PostCardProps {
  postId: string;
  storeName: string;
  postMainMenu: string;
  menuImage: PostImage;
  menuPrice: string;
  createdDate: string;
}

export interface PostImage {
  id: string;
  url: string;
}
