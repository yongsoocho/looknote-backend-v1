export interface Comment {
  id: number;
  postId: number;
  author: CommentAuthor;
  content: string;
  createdAt: string;
}

interface CommentAuthor {
  profile: string;
  name: string;
  id: number;
  email: string;
}

export interface CommentResponse {
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
}

export interface CreateCommentBody {
  postId: number;
  content: string;
}

export interface CreateComment {
  postId: number;
  authorId: number;
  content: string;
}

export interface UpdateComment {
  commentId: number;
  content: string;
}
