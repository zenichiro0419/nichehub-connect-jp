
// ユーザー情報の型
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  joinedAt: Date;
  communities: string[];
}

// コミュニティの型
export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  color: string;
  icon: string;
}

// 投稿の型
export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User;
  communityId: string;
  createdAt: Date;
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
}

// 通知の型
export interface Notification {
  id: string;
  type: 'like' | 'reply' | 'system';
  content: string;
  createdAt: Date;
  isRead: boolean;
  relatedUserId?: string;
  relatedPostId?: string;
}
