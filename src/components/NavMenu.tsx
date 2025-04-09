
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Bell, MessageSquare, User, Settings, LogOut } from 'lucide-react';
import { mockCommunities, currentUser } from '../data/mockData';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

const NavMenu: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "ログアウトしました",
        description: "またのご利用をお待ちしています",
      });
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      toast({
        title: "ログアウトに失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col border-r p-4">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center">
          <h1 className="text-2xl font-bold text-niche-blue-600">
            NicheHub
            <span className="text-xs align-super ml-1 text-gray-500">BETA</span>
          </h1>
        </Link>
      </div>

      <nav className="space-y-1 mb-6">
        <Link to="/dashboard" className="flex items-center p-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
          <Home size={20} className="mr-4" />
          <span>ホーム</span>
        </Link>
        <Link to="/search" className="flex items-center p-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
          <Search size={20} className="mr-4" />
          <span>検索</span>
        </Link>
        <Link to="/notifications" className="flex items-center p-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
          <Bell size={20} className="mr-4" />
          <span>通知</span>
        </Link>
        <Link to="/messages" className="flex items-center p-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
          <MessageSquare size={20} className="mr-4" />
          <span>メッセージ</span>
        </Link>
      </nav>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 px-3">マイコミュニティ</h2>
        <div className="space-y-1">
          {mockCommunities.filter(community => currentUser.communities.includes(community.id)).map(community => (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="flex items-center p-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              <span className={`w-6 h-6 flex items-center justify-center rounded-md mr-4 text-white ${community.color}`}>
                {community.icon}
              </span>
              <span>{community.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Button variant="outline" className="w-full mb-2" asChild>
          <Link to="/profile">
            <User size={20} className="mr-2" />
            プロフィール
          </Link>
        </Button>
        <Button variant="outline" className="w-full mb-2">
          <Settings size={20} className="mr-2" />
          設定
        </Button>
        <Button 
          variant="outline" 
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-2" />
          ログアウト
        </Button>
      </div>
    </div>
  );
};

export default NavMenu;
