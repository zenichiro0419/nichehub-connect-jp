
import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { mockCommunities } from '../data/mockData';
import { usePosts } from '../hooks/use-posts';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { posts, isLoading, error } = usePosts(activeTab !== 'all' ? activeTab : undefined);

  useEffect(() => {
    if (error) {
      console.error("Timeline error:", error);
      toast({
        title: "データの読み込みに失敗しました",
        description: "タイムラインの読み込み中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleRetry = () => {
    window.location.reload();
  };

  console.log("Timeline rendering. ActiveTab:", activeTab, "Posts:", posts, "Error:", error);

  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-niche-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6">
            <Alert variant="destructive">
              <AlertTitle>エラーが発生しました</AlertTitle>
              <AlertDescription>
                データの読み込みに失敗しました。
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={handleRetry}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> 再試行する
                </Button>
              </AlertDescription>
            </Alert>
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
