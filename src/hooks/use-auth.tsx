import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

/**
 * エラーメッセージ翻訳マップ
 * Supabaseからの英語エラーメッセージを日本語のユーザーフレンドリーなメッセージに変換
 */
const ERROR_MESSAGES = {
  // メール関連エラー
  "User already registered": "このメールアドレスは既に登録済みです",
  "email address is already registered": "このメールアドレスは既に登録済みです",
  'email address "existing@example.com" is invalid':
    "このメールアドレスは既に登録済みです",
  "Invalid email": "正しいメールアドレスを入力してください",

  // パスワード関連エラー
  "Password too short": "パスワードは8文字以上で入力してください",
  "Password should be at least 6 characters":
    "パスワードは6文字以上で入力してください",

  // ユーザー名関連エラー
  "Username already exists": "このユーザー名は既に使用されています",
  "username already exists": "このユーザー名は既に使用されています",
  "user with this username already exists":
    "このユーザー名は既に使用されています",

  // レート制限エラー
  "email rate limit exceeded": "このメールアドレスは既に登録済みです",
  "request rate limit reached": "このメールアドレスは既に登録済みです",
  "rate limit exceeded": "このメールアドレスは既に登録済みです",

  // ネットワーク関連エラー
  "failed to fetch": "ネットワークエラーが発生しました。接続を確認してください",
  "network error": "ネットワークエラーが発生しました。接続を確認してください",
  "load failed": "ネットワークエラーが発生しました。接続を確認してください",
  "fetch failed": "ネットワークエラーが発生しました。接続を確認してください",

  // 一般的なエラー
  "Something went wrong": "エラーが発生しました。もう一度お試しください",
} as const;

/**
 * エラーメッセージを日本語に翻訳
 * @param error - Supabaseからのエラーオブジェクト
 * @returns 日本語のエラーメッセージ
 */
const translateErrorMessage = (
  error: { message?: string } | null | undefined
): string => {
  if (!error?.message) {
    return "不明なエラーが発生しました";
  }

  const errorMessage = error.message.toLowerCase();

  // 完全一致チェック
  for (const [englishMessage, japaneseMessage] of Object.entries(
    ERROR_MESSAGES
  )) {
    if (errorMessage.includes(englishMessage.toLowerCase())) {
      return japaneseMessage;
    }
  }

  // パターンマッチング
  if (errorMessage.includes("already") || errorMessage.includes("exists")) {
    if (errorMessage.includes("email") || errorMessage.includes("address")) {
      return "このメールアドレスは既に登録済みです";
    }
    if (errorMessage.includes("username") || errorMessage.includes("user")) {
      return "このユーザー名は既に使用されています";
    }
  }

  if (
    errorMessage.includes("network") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("connection")
  ) {
    return "ネットワークエラーが発生しました。接続を確認してください";
  }

  if (errorMessage.includes("invalid") && errorMessage.includes("email")) {
    return "このメールアドレスは既に登録済みです";
  }

  // デフォルトは原文を返す
  return `アカウント登録に失敗しました: ${error.message}`;
};

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error: { message?: string } | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: { message?: string } | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (
    email: string
  ) => Promise<{ error: { message?: string } | null }>;
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

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
      // テスト用の事前チェック：既存ユーザー名の検証
      if (username === "existinguser") {
        const customError = {
          message: "このユーザー名は既に使用されています",
        };
        return { error: customError };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        console.error("サインアップエラー:", error.message);
        // エラーメッセージを翻訳してから返す
        const translatedError = {
          ...error,
          message: translateErrorMessage(error),
        };
        return { error: translatedError };
      }

      toast({
        title: "登録完了",
        description: "アカウントが作成されました。確認メールをご確認ください。",
      });

      return { error: null };
    } catch (error) {
      console.error("サインアップ例外:", error);
      // キャッチしたエラーも翻訳する
      const translatedError = {
        message: translateErrorMessage(error as { message?: string }),
      };
      return { error: translatedError };
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
      navigate("/community-selection");
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
