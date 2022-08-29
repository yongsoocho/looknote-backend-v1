export interface PostDetailResponse {
  id: number;
  createdAt: string;
  updateAt: string;
  title: string;
  content: string;
  authorId: number;
  imageURL: string;
  author: {
    nickname: string;
    profile: string;
    id: number;
  };
  comments: [
    {
      id: number;
      authorId: number;
      content: string;
      postId: number;
      createdAt: string;
      author: {
        profile: string;
        nickname: string;
        id: number;
        email: string;
      };
    },
  ];
}
