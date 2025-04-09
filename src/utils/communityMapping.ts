
import { supabase } from "@/integrations/supabase/client";
import { mockCommunities } from "@/data/mockData";

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
export const getActualCommunityId = (mockCommunityId: string) => {
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

export const getMockCommunityId = (supabaseCommunityId: string) => {
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
