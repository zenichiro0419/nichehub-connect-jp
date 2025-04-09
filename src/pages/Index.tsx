
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // トップページにアクセスしたらログインページにリダイレクト
    navigate('/login');
  }, [navigate]);

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
