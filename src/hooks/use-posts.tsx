
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { mockCommunities } from "@/data/mockData";

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

// 実際のコミュニティIDマッピングを格納するためのオブジェクト
let communityMapping: Record<string, string> = {};

// コミュニティIDマッピングを初期化する関数
export async function initializeCommunityMapping() {
  try {
    const { data: communities } = await supabase
      .from("communities")
      .select("id, name");
    
    if (communities && communities.length > 0) {
      // Supabase内の実際のIDと名前をマッピング
      communityMapping = {};
      communities.forEach(community => {
        // モックコミュニティから対応するIDを見つける
        const mockCommunity = mockCommunities.find(c => c.name === community.name);
        if (mockCommunity) {
          communityMapping[mockCommunity.id] = community.id;
        }
      });
      console.log("コミュニティIDマッピングを初期化しました:", communityMapping);
    }
  } catch (err) {
    console.error("コミュニティマッピングの初期化に失敗:", err);
  }
}

// コミュニティIDをモックとSupabaseの間で変換するヘルパー関数
const getActualCommunityId = (mockCommunityId: string) => {
  // マッピングが存在すればそれを使用
  if (communityMapping[mockCommunityId]) {
    console.log(`モックID ${mockCommunityId} -> 実際のID ${communityMapping[mockCommunityId]}`);
    return communityMapping[mockCommunityId];
  }
  
  // 以前のサポート (マッピングがない場合)
  const community = mockCommunities.find(c => c.id === mockCommunityId);
  console.log(`モックID ${mockCommunityId} -> サポートなし`, community);
  return community?.supabaseId || mockCommunityId;
};

const getMockCommunityId = (supabaseCommunityId: string) => {
  // マッピングの逆引き
  const entry = Object.entries(communityMapping).find(([_, id]) => id === supabaseCommunityId);
  if (entry) {
    console.log(`実際のID ${supabaseCommunityId} -> モックID ${entry[0]}`);
    return entry[0];
  }
  
  // 以前のサポート
  const community = mockCommunities.find(c => c.supabaseId === supabaseCommunityId);
  return community?.id || supabaseCommunityId;
};

export function usePosts(communityId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
