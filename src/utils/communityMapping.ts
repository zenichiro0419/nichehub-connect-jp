
import { supabase } from "@/integrations/supabase/client";
import { mockCommunities } from "@/data/mockData";

// 実際のコミュニティIDマッピングを格納するためのオブジェクト
let communityMapping: Record<string, string> = {};

// コミュニティIDマッピングを初期化する関数
export async function initializeCommunityMapping() {
  try {
    console.log("コミュニティマッピングの初期化を開始");
    
    // Supabaseからコミュニティデータを取得
    const { data: communities, error } = await supabase
      .from("communities")
      .select("id, name");
    
    if (error) {
      console.error("コミュニティデータの取得に失敗:", error);
      return;
    }
    
    if (communities && communities.length > 0) {
      console.log("取得したコミュニティ:", communities);
      
      // マッピングをクリア
      communityMapping = {};
      
      // 名前を基にマッピングを作成（英語表記と日本語表記の両方に対応）
      mockCommunities.forEach(mockCommunity => {
        // 英語名と一致するコミュニティを検索
        const englishName = getEnglishName(mockCommunity.name);
        const matchedCommunity = communities.find(c => 
          c.name.toLowerCase() === englishName.toLowerCase() || 
          c.name === mockCommunity.name
        );
        
        if (matchedCommunity) {
          communityMapping[mockCommunity.id] = matchedCommunity.id;
          console.log(`マッピング作成: ${mockCommunity.name}(${mockCommunity.id}) -> ${matchedCommunity.name}(${matchedCommunity.id})`);
        } else {
          console.log(`マッピング未作成: ${mockCommunity.name}(${mockCommunity.id}) - 対応するコミュニティがありません`);
        }
      });
      
      console.log("コミュニティIDマッピング:", communityMapping);
    } else {
      console.warn("Supabaseにコミュニティが存在しません");
    }
  } catch (err) {
    console.error("コミュニティマッピングの初期化に失敗:", err);
  }
}

// 日本語名から英語名への変換（必要な分のみ定義）
function getEnglishName(japaneseName: string): string {
  const nameMap: Record<string, string> = {
    'テクノロジー': 'Technology',
    'アート': 'Art',
    'ビジネス': 'Business',
    '教育': 'Education',
    '健康': 'Health'
  };
  
  return nameMap[japaneseName] || japaneseName;
}

// コミュニティIDをモックとSupabaseの間で変換するヘルパー関数
export const getActualCommunityId = (mockCommunityId: string) => {
  if (!mockCommunityId) {
    console.log("getActualCommunityId: モックIDが空です");
    return null;
  }
  
  // マッピングが存在すればそれを使用
  if (communityMapping[mockCommunityId]) {
    console.log(`モックID ${mockCommunityId} -> 実際のID ${communityMapping[mockCommunityId]}`);
    return communityMapping[mockCommunityId];
  }
  
  // マッピングがない場合はログ出力
  console.log(`モックID ${mockCommunityId} -> マッピングが見つかりませんでした`);
  return null;
};

export const getMockCommunityId = (supabaseCommunityId: string) => {
  if (!supabaseCommunityId) {
    console.log("getMockCommunityId: SupabaseIDが空です");
    return null;
  }
  
  // マッピングの逆引き
  const entry = Object.entries(communityMapping).find(([_, id]) => id === supabaseCommunityId);
  if (entry) {
    console.log(`実際のID ${supabaseCommunityId} -> モックID ${entry[0]}`);
    return entry[0];
  }
  
  // マッピングが見つからない場合はそのままのIDを返す
  console.log(`実際のID ${supabaseCommunityId} -> モックIDが見つかりません`);
  return supabaseCommunityId;
};
