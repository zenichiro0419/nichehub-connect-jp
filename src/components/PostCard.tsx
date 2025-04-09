
import React from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { Post, usePosts } from '@/hooks/use-posts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { toggleLike } = usePosts();

  // 投稿日時をフォーマットする
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}分前`;
    } else if (diffHours < 24) {
      return `${diffHours}時間前`;
    } else {
      return `${diffDays}日前`;
    }
  };

  // いいねを切り替える
  const handleToggleLike = () => {
    toggleLike.mutate({ 
      postId: post.id, 
      isLiked: post.is_liked || false 
    });
  };

  // ユーザー名のイニシャルを取得
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="border-b p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage 
            src={post.author?.avatar_url || ''} 
            alt={post.author?.display_name || 'ユーザー'}
          />
          <AvatarFallback>{getInitials(post.author?.display_name || 'ユーザー')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-bold">{post.author?.display_name || 'ユーザー'}</span>
            <span className="text-gray-500 ml-2">@{post.author?.username || 'user'}</span>
            <span className="text-gray-400 mx-1">·</span>
            <span className="text-gray-500">{formatDate(post.created_at)}</span>
          </div>
          
          <p className="text-gray-800 mb-3">{post.content}</p>
          
          <div className="flex items-center justify-between text-gray-500">
            <button 
              className={`flex items-center ${post.is_liked ? 'text-red-500' : ''} hover:text-red-500`}
              onClick={handleToggleLike}
            >
              <Heart size={18} className={`mr-1 ${post.is_liked ? 'fill-red-500' : ''}`} />
              <span>{post.likes_count || 0}</span>
            </button>
            
            <button className="flex items-center hover:text-blue-500">
              <MessageSquare size={18} className="mr-1" />
              <span>0</span>
            </button>
            
            <button className="flex items-center hover:text-green-500">
              <Share2 size={18} className="mr-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
