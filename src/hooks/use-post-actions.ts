
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { getActualCommunityId } from "@/utils/communityMapping";

export function usePostActions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 投稿を作成する
  const createPost = useMutation({
    mutationFn: async ({ content, communityId }: { content: string; communityId: string }) => {
      setIsSubmitting(true);
      
      // モックCommunityIDをSupabaseのUUIDに変換
      const actualCommunityId = getActualCommunityId(communityId);
      console.log("Creating post with community:", communityId, "->", actualCommunityId);
      
      if (!actualCommunityId) {
        throw new Error("有効なコミュニティIDが見つかりません。コミュニティが作成されていることを確認してください。");
      }
      
      const { data, error } = await supabase.from("posts").insert({
        content,
        community_id: actualCommunityId,
        user_id: user?.id || '',
      }).select();

      if (error) {
        console.error("投稿作成エラー:", error);
        throw new Error(error.message);
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "投稿を作成しました",
        description: "あなたの投稿がタイムラインに表示されます。",
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("投稿作成エラー:", error);
      toast({
        title: "投稿の作成に失敗しました",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // いいねを追加/削除する
  const toggleLike = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (!user) {
        throw new Error("ログインが必要です");
      }
      
      if (isLiked) {
        // いいねを削除
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw new Error(error.message);
        return { postId, action: "unliked" };
      } else {
        // いいねを追加
        const { error } = await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id,
        });

        if (error) throw new Error(error.message);
        return { postId, action: "liked" };
      }
    },
    onSuccess: () => {
      // いいねのトグル後にキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("いいねのトグルエラー:", error);
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createPost,
    isSubmitting,
    toggleLike,
  };
}
