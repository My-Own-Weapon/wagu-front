const categories = ['KOREAN', 'JAPANESE', 'CHINESE', 'WESTERN'];

const posts = Array.from({ length: 60 }, (_, i) => ({
  postId: i + 100,
  menuPrice: '12000',
  storeName: '울엄 김치찜',
  category: categories[i % 4],
  postMainMenu: '김치찜',
  menuImage: { id: `img-${i}`, url: '/images/mock-food.png' },
  postContent: '맛있어요오오오 !!',
  createdDate: '2024-07-26T15:03:03.196666',
  updatedDate: '2024-07-26T15:03:03.196666',
  auto: true,
}));

export default posts;
