
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, username: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 認証状態リスナーの設定
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // 初期セッションの確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });

      if (error) {
        console.error("サインアップエラー:", error.message);
        return { error };
      }

      toast({
        title: "登録完了",
        description: "アカウントが作成されました。確認メールをご確認ください。",
      });

      return { error: null };
    } catch (error) {
      console.error("サインアップ例外:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("ログインエラー:", error.message);
        return { error };
      }

      toast({
        title: "ログイン成功",
        description: "NicheHubへようこそ！",
      });

      // ログイン成功後、コミュニティ選択またはダッシュボードへリダイレクト
      navigate('/community-selection');
      return { error: null };
    } catch (error) {
      console.error("ログイン例外:", error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("パスワードリセットエラー:", error.message);
        return { error };
      }

      toast({
        title: "パスワードリセットメール送信",
        description: "パスワードリセット用のリンクをメールで送信しました。",
      });

      return { error: null };
    } catch (error) {
      console.error("パスワードリセット例外:", error);
      return { error };
    }
  };

  const value = {
    ...authState,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
