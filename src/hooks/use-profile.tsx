
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // プロフィール情報を取得
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("ユーザーが認証されていません");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Profile;
    },
    enabled: !!user?.id,
  });

  // プロフィール情報を更新
  const updateProfile = useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      if (!user?.id) throw new Error("ユーザーが認証されていません");
      setIsSubmitting(true);

      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data[0] as Profile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "プロフィールを更新しました",
        description: "プロフィール情報が保存されました。",
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("プロフィール更新エラー:", error);
      toast({
        title: "プロフィールの更新に失敗しました",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // アバター画像をアップロード
  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error("ユーザーが認証されていません");
      setIsSubmitting(true);

      // ファイル名を生成（ユーザーID + タイムスタンプ + 元のファイル拡張子）
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // 公開URLを取得
      const { data: publicURL } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // プロフィールを更新
      const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_url: publicURL.publicUrl })
        .eq("id", user.id)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data[0] as Profile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "アバター画像を更新しました",
        description: "プロフィール画像がアップロードされました。",
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("アバターアップロードエラー:", error);
      toast({
        title: "画像のアップロードに失敗しました",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    isSubmitting,
  };
}
