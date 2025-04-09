
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    
    if (user) {
      // ログイン済みの場合はコミュニティ選択またはダッシュボードにリダイレクト
      navigate('/community-selection');
    } else {
      // 未ログインの場合はログインページにリダイレクト
      navigate('/login');
    }
  }, [navigate, user, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">NicheHub へようこそ</h1>
        <p className="text-xl text-gray-600">リダイレクト中...</p>
      </div>
    </div>
  );
};

export default Index;
