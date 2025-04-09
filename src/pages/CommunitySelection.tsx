
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCommunities } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const CommunitySelection: React.FC = () => {
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // コミュニティの選択/選択解除を処理
  const toggleCommunity = (communityId: string) => {
    if (selectedCommunities.includes(communityId)) {
      setSelectedCommunities(selectedCommunities.filter(id => id !== communityId));
    } else {
      setSelectedCommunities([...selectedCommunities, communityId]);
    }
  };

  // 選択完了ボタン
  const handleComplete = () => {
    // 少なくとも1つのコミュニティを選択する必要がある
    if (selectedCommunities.length > 0) {
      console.log('選択されたコミュニティ:', selectedCommunities);
      // 通常はここでバックエンドにデータを送信
      // デモでは単にダッシュボードにリダイレクト
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-niche-blue-600">NicheHub</h1>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">コミュニティを選択</h2>
            <p className="text-gray-600">
              参加したいコミュニティを選んでください。後からいつでも変更できます。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {mockCommunities.map(community => (
              <div
                key={community.id}
                onClick={() => toggleCommunity(community.id)}
                className={`relative p-5 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCommunities.includes(community.id)
                    ? 'border-niche-blue-500 bg-niche-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {selectedCommunities.includes(community.id) && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-niche-blue-500 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-md mx-auto mb-4 flex items-center justify-center text-white ${community.color}`}>
                  <span className="text-3xl">{community.icon}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-center mb-2">{community.name}</h3>
                <p className="text-gray-600 text-center text-sm">{community.description}</p>
                
                <div className="mt-4 text-xs text-center text-gray-500">
                  {community.memberCount}人のメンバー
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              onClick={handleComplete}
              disabled={selectedCommunities.length === 0}
              size="lg"
              className="bg-niche-blue-500 hover:bg-niche-blue-600"
            >
              選択完了 ({selectedCommunities.length})
            </Button>
            
            <p className="mt-3 text-sm text-gray-600">
              少なくとも1つのコミュニティを選択してください。
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white p-4 border-t">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          &copy; 2024 NicheHub - すべての権利を保有
        </div>
      </footer>
    </div>
  );
};

export default CommunitySelection;
