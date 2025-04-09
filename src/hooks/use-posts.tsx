
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePostActions } from "@/hooks/use-post-actions";
import { initializeCommunityMapping, getMockCommunityId } from "@/utils/communityMapping";
import { Post } from "@/types/post";

export type { Post };
export { initializeCommunityMapping } from "@/utils/communityMapping";

export function usePosts(communityId?: string) {
  const { user } = useAuth();
  const postActions = usePostActions();
  
  // コンポーネントのマウント時にコミュニティマッピングを初期化
  useEffect(() => {
    initializeCommunityMapping();
  }, []);

  console.log("Fetching posts for communityId:", communityId);
  
  // 投稿を取得する
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts", communityId],
    queryFn: async () => {
      try {
        console.log("Starting to fetch posts");
        // まず投稿を取得
        let query = supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (communityId && communityId !== "all") {
          // モックCommunityIDをSupabaseのUUIDに変換
          const actualCommunityId = getMockCommunityId(communityId);
          console.log("Filtering by community:", communityId, "->", actualCommunityId);
          if (actualCommunityId) {
            query = query.eq("community_id", actualCommunityId);
          }
        }

        const { data: postsData, error: postsError } = await query;

        if (postsError) {
          console.error("投稿取得エラー:", postsError);
          throw new Error(postsError.message);
        }

        console.log("Posts fetched:", postsData?.length || 0);
        if (!postsData || postsData.length === 0) {
          return [];
        }

        // 各投稿のプロファイル情報、いいね数、いいね状態を取得
        const enhancedPosts = await Promise.all(
          postsData.map(async (post: any) => {
            // モックコミュニティIDに変換
            const mockCommunityId = getMockCommunityId(post.community_id);
            
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
              community_id: mockCommunityId, // モックIDに変換して返す
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

  return {
    posts,
    isLoading,
    error,
    ...postActions
  };
}
