
import React, { useState } from 'react';
import PostCard from './PostCard';
import { mockCommunities } from '../data/mockData';
import { usePosts } from '../hooks/use-posts';

const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { posts, isLoading, error } = usePosts(activeTab !== 'all' ? activeTab : undefined);

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
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-niche-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            データの読み込みに失敗しました。再試行してください。
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
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
