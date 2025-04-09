
import React, { useState } from 'react';
import PostCard from './PostCard';
import { mockPosts, mockCommunities } from '../data/mockData';
import { Post } from '../types';

const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  // タブに基づいて投稿をフィルタリングする
  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.communityId === activeTab);

  return (
    <div className="flex flex-col h-full">
      {/* タブナビゲーション */}
      <div className="border-b flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'all'
              ? 'text-niche-blue-600 border-b-2 border-niche-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          すべて
        </button>

        {mockCommunities.map((community) => (
          <button
            key={community.id}
            onClick={() => setActiveTab(community.id)}
            className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${
              activeTab === community.id
                ? 'text-niche-blue-600 border-b-2 border-niche-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className={`w-5 h-5 flex items-center justify-center rounded-md text-white ${community.color} mr-2`}>
              {community.icon}
            </span>
            {community.name}
          </button>
        ))}
      </div>

      {/* 投稿リスト */}
      <div className="flex-1 overflow-y-auto">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <p className="text-lg text-gray-500 mb-2">このコミュニティにはまだ投稿がありません</p>
            <p className="text-sm text-gray-400">最初の投稿をしましょう！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
