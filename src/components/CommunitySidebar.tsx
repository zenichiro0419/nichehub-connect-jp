
import React from 'react';
import { mockCommunities, mockUsers } from '../data/mockData';
import { Search, Users } from 'lucide-react';

const CommunitySidebar: React.FC = () => {
  // 人気のコミュニティをメンバー数で並べ替え
  const popularCommunities = [...mockCommunities].sort((a, b) => b.memberCount - a.memberCount);
  
  // おすすめユーザー（簡易的にモックユーザーを使用）
  const suggestedUsers = mockUsers.slice(0, 2);
  
  return (
    <div className="h-full border-l p-4 space-y-6">
      {/* 検索ボックス */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="NicheHubを検索"
          className="w-full pl-10 pr-4 py-2 rounded-full border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-niche-blue-300"
        />
      </div>
      
      {/* 人気のコミュニティ */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-4">人気のコミュニティ</h2>
        <div className="space-y-3">
          {popularCommunities.map(community => (
            <div key={community.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white ${community.color} mr-3`}>
                <span className="text-xl">{community.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{community.name}</h3>
                <p className="text-xs text-gray-500 flex items-center">
                  <Users size={12} className="mr-1" />
                  {community.memberCount}人のメンバー
                </p>
              </div>
              <button className="text-sm text-niche-blue-500 font-medium hover:text-niche-blue-600">
                参加
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* おすすめユーザー */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-4">おすすめユーザー</h2>
        <div className="space-y-3">
          {suggestedUsers.map(user => (
            <div key={user.id} className="flex items-center">
              <img 
                src={user.avatar} 
                alt={user.displayName} 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <h3 className="font-medium">{user.displayName}</h3>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
              <button className="text-sm text-niche-blue-500 font-medium hover:text-niche-blue-600">
                フォロー
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* フッター情報 */}
      <div className="text-xs text-gray-500">
        <p className="mb-2">© 2024 NicheHub</p>
        <div className="space-x-2">
          <a href="#" className="hover:underline">利用規約</a>
          <span>·</span>
          <a href="#" className="hover:underline">プライバシーポリシー</a>
          <span>·</span>
          <a href="#" className="hover:underline">ヘルプ</a>
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;
