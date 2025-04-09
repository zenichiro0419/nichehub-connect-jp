
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "パスワードエラー",
        description: "パスワードが一致しません。",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) {
        toast({
          title: "エラー",
          description: `パスワードリセット中にエラーが発生しました: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "パスワード変更完了",
          description: "パスワードが正常に変更されました。",
        });
        navigate('/login');
      }
    } catch (error) {
      console.error("パスワードリセットエラー:", error);
      toast({
        title: "エラーが発生しました",
        description: "パスワードの変更中に問題が発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">パスワードのリセット</h1>
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              新しいパスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-niche-blue-300"
              placeholder="8文字以上のパスワード"
              minLength={8}
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード確認
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-niche-blue-300"
              placeholder="パスワードを再入力"
              minLength={8}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-niche-blue-500 hover:bg-niche-blue-600"
            disabled={isLoading}
          >
            {isLoading ? '処理中...' : 'パスワードを変更'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
