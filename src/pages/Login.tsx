
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // デモ用にログイン/登録処理をシミュレート
    console.log(isLogin ? 'ログイン' : '登録', { email, password });
    // この段階では実装しないため、ダッシュボードページにリダイレクトするだけ
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 左側：プロモーション */}
      <div className="bg-niche-blue-500 text-white p-8 flex flex-col justify-center md:w-1/2">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">NicheHub</h1>
          <h2 className="text-2xl font-semibold mb-4">あなたの専門分野のコミュニティへようこそ</h2>
          <p className="text-lg mb-6">
            NicheHubは、専門分野ごとのクローズドコミュニティを提供するSNSです。
            あなたの関心に合わせたコミュニティで、知識を共有し、専門家と繋がりましょう。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl mb-2">💼</div>
              <h3 className="font-semibold">Business</h3>
              <p className="text-sm">ビジネス戦略、マーケティング、起業について議論しよう</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold">Art</h3>
              <p className="text-sm">アート、デザイン、クリエイティブな表現を共有しよう</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl mb-2">💻</div>
              <h3 className="font-semibold">Technology</h3>
              <p className="text-sm">テクノロジー、開発、イノベーションについて語ろう</p>
            </div>
          </div>
        </div>
      </div>

      {/* 右側：ログイン/登録フォーム */}
      <div className="bg-white p-8 flex items-center justify-center md:w-1/2">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? 'アカウントにログイン' : '新規アカウント登録'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? '専門分野のコミュニティに参加しましょう' 
                : '数分で簡単に登録できます'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-niche-blue-300"
                placeholder="your-email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-niche-blue-300"
                placeholder="8文字以上のパスワード"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード(確認)
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required={!isLogin}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-niche-blue-300"
                  placeholder="パスワードを再入力"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-niche-blue-500 focus:ring-niche-blue-400 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    ログイン状態を保存
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-niche-blue-500 hover:underline">
                    パスワードをお忘れですか？
                  </a>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-niche-blue-500 hover:bg-niche-blue-600"
            >
              {isLogin ? 'ログイン' : '登録'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? 'アカウントをお持ちでないですか？' : 'すでにアカウントをお持ちですか？'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-niche-blue-500 hover:underline"
              >
                {isLogin ? '登録する' : 'ログイン'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
