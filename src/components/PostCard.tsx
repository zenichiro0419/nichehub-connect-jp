
import React from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // 投稿日時をフォーマットする
  const formatDate = (date: Date) => {
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

  return (
    <div className="border-b p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        <img 
          src={post.author.avatar} 
          alt={post.author.displayName} 
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-bold">{post.author.displayName}</span>
            <span className="text-gray-500 ml-2">@{post.author.username}</span>
            <span className="text-gray-400 mx-1">·</span>
            <span className="text-gray-500">{formatDate(post.createdAt)}</span>
          </div>
          
          <p className="text-gray-800 mb-3">{post.content}</p>
          
          <div className="flex items-center justify-between text-gray-500">
            <button className={`flex items-center ${post.isLiked ? 'text-red-500' : ''} hover:text-red-500`}>
              <Heart size={18} className={`mr-1 ${post.isLiked ? 'fill-red-500' : ''}`} />
              <span>{post.likeCount}</span>
            </button>
            
            <button className="flex items-center hover:text-blue-500">
              <MessageSquare size={18} className="mr-1" />
              <span>{post.replyCount}</span>
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
