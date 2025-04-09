
import React, { useEffect } from 'react';
import NavMenu from '../components/NavMenu';
import PostForm from '../components/PostForm';
import Timeline from '../components/Timeline';
import CommunitySidebar from '../components/CommunitySidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import AuthGuard from '@/components/AuthGuard';
import { initializeCommunities } from '@/utils/initializeData';

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  
  // コンポーネントマウント時にコミュニティデータを初期化
  useEffect(() => {
    initializeCommunities();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen flex">
        {/* 左側：ナビゲーションメニュー */}
        {!isMobile && (
          <div className="w-64 fixed top-0 bottom-0 left-0 z-10">
            <NavMenu />
          </div>
        )}
        
        {/* 中央：投稿フォーム + タイムライン */}
        <div className={`flex-1 border-x ${!isMobile ? 'ml-64 mr-80' : ''} min-h-screen`}>
          <div className="max-w-full mx-auto flex flex-col h-screen">
            <PostForm />
            <Timeline />
          </div>
        </div>
        
        {/* 右側：コミュニティ情報 + 検索 */}
        {!isMobile && (
          <div className="w-80 fixed top-0 bottom-0 right-0">
            <CommunitySidebar />
          </div>
        )}
        
        {/* モバイル用ナビゲーション（簡易版） */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-10">
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
