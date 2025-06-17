export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: string;
  location?: string;
  website?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
}

export interface Post {
  id: string;
  content: string;
  image?: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    isVerified?: boolean;
  };
  likes: number;
  comments: Array<{
    id: string;
    content: string;
    author: {
      username: string;
      avatar?: string;
      isVerified?: boolean;
    };
  }>;
  createdAt: string;
