
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export interface Post {
  id: string;
  content: string;
  user_id: string;
  community_id: string;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
  likes_count?: number;
  is_liked?: boolean;
}

export function usePosts(communityId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 投稿を取得する
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts", communityId],
    queryFn: async () => {
      try {
        // まず投稿を取得
        let query = supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (communityId && communityId !== "all") {
          query = query.eq("community_id", communityId);
        }

        const { data: postsData, error: postsError } = await query;

        if (postsError) {
          console.error("投稿取得エラー:", postsError);
          throw new Error(postsError.message);
        }

        if (!postsData || postsData.length === 0) {
          return [];
        }

        // 各投稿のプロファイル情報、いいね数、いいね状態を取得
        const enhancedPosts = await Promise.all(
          postsData.map(async (post: any) => {
            // プロフィール情報を取得
            const { data: profileData } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", post.user_id)
              .single();
            
            // いいねの数を取得
            const { count: likesCount } = await supabase
              .from("likes")
              .select("*", { count: "exact" })
              .eq("post_id", post.id);

            // 現在のユーザーがいいねしているかを取得
            let isLiked = false;
            if (user) {
              const { data: likeData } = await supabase
                .from("likes")
                .select("*")
                .eq("post_id", post.id)
                .eq("user_id", user.id)
                .maybeSingle();
              
              isLiked = !!likeData;
            }

            return {
              ...post,
              author: {
                username: profileData?.username || 'ユーザー',
                display_name: profileData?.display_name || 'ユーザー',
                avatar_url: profileData?.avatar_url || '',
              },
              likes_count: likesCount || 0,
              is_liked: isLiked,
            } as Post;
          })
        );

        return enhancedPosts;
      } catch (err: any) {
        console.error("投稿取得エラー:", err);
        throw new Error(err.message || "投稿の取得に失敗しました");
      }
    },
    enabled: !!user,
  });

  // 投稿を作成する
  const createPost = useMutation({
    mutationFn: async ({ content, communityId }: { content: string; communityId: string }) => {
      setIsSubmitting(true);
      
      const { data, error } = await supabase.from("posts").insert({
        content,
        community_id: communityId,
        user_id: user?.id || '',
      }).select();

      if (error) {
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
    onSuccess: (data) => {
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
    posts,
    isLoading,
    error,
    createPost,
    isSubmitting,
    toggleLike,
  };
}
