
export interface Post {
  id: string;
  content: string;
  user_id: string;
  community_id: string;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
  likes_count?: number;
  is_liked?: boolean;
}
