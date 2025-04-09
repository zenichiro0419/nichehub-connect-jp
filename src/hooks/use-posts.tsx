
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePostActions } from "@/hooks/use-post-actions";
import { initializeCommunityMapping, getActualCommunityId } from "@/utils/communityMapping";
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
          const actualCommunityId = getActualCommunityId(communityId);
          console.log("Filtering by community:", communityId, "->", actualCommunityId);
          if (actualCommunityId) {
            query = query.eq("community_id", actualCommunityId);
          } else {
            console.warn(`No mapping found for community ID: ${communityId}`);
            return []; // マッピングが見つからない場合は空の配列を返す
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

        // 各投稿のプロフィール情報、いいね数、いいね状態を取得
        const enhancedPosts = await Promise.all(
          postsData.map(async (post: any) => {
            // モックコミュニティIDに変換（表示用）
            const { getMockCommunityId } = await import("@/utils/communityMapping");
            const mockCommunityId = getMockCommunityId(post.community_id);
            
            // プロフィール情報を取得（実際の投稿者のプロフィール）
            const { data: profileData } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", post.user_id)
              .maybeSingle();
            
            // プロフィールが見つからない場合、エラーログを残すがアプリは停止しない
            if (!profileData) {
              console.warn(`Profile not found for user_id: ${post.user_id}. Creating fallback profile.`);
              
              // プロフィールが見つからない場合は、ユーザーIDの一部を使用して仮のユーザー名を生成
              const shortUserId = post.user_id.substring(0, 8);
              return {
                ...post,
                community_id: mockCommunityId, // モックIDに変換して返す
                author: {
                  username: `user_${shortUserId}`,
                  display_name: `User ${shortUserId}`,
                  avatar_url: '',
                },
                likes_count: await getPostLikesCount(post.id),
                is_liked: user ? await isPostLikedByUser(post.id, user.id) : false,
              } as Post;
            }
            
            // いいねの数を取得
            const likesCount = await getPostLikesCount(post.id);

            // 現在のユーザーがいいねしているかを取得
            const isLiked = user ? await isPostLikedByUser(post.id, user.id) : false;

            return {
              ...post,
              community_id: mockCommunityId, // モックIDに変換して返す
              author: {
                username: profileData.username,
                display_name: profileData.display_name || profileData.username,
                avatar_url: profileData.avatar_url || '',
              },
              likes_count: likesCount,
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

  // いいねの数を取得する補助関数
  async function getPostLikesCount(postId: string): Promise<number> {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact" })
      .eq("post_id", postId);
    
    return count || 0;
  }

  // ユーザーがいいねしているかを確認する補助関数
  async function isPostLikedByUser(postId: string, userId: string): Promise<boolean> {
    const { data: likeData } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();
    
    return !!likeData;
  }

  return {
    posts,
    isLoading,
    error,
    ...postActions
  };
}
