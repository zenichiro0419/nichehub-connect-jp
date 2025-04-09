
import { supabase } from "@/integrations/supabase/client";
import { mockCommunities } from "@/data/mockData";
import { initializeCommunityMapping } from "./communityMapping";

/**
 * Supabaseのコミュニティテーブルに初期データを追加する関数
 */
export async function initializeCommunities() {
  console.log("コミュニティの初期化を開始");

  try {
    // まず既存のコミュニティを取得して確認
    const { data: existingCommunities, error: fetchError } = await supabase
      .from("communities")
      .select("id, name");
    
    if (fetchError) {
      console.error("コミュニティデータの取得に失敗:", fetchError);
      return;
    }

    console.log("既存のコミュニティ:", existingCommunities);
    let communitiesCreated = false;

    // モックコミュニティデータをSupabaseに挿入
    for (const community of mockCommunities) {
      // 英語名も取得（日本語名のマッピング用）
      const englishName = getEnglishName(community.name);
      
      // 既存のコミュニティと名前を比較して存在するかチェック（日本語名または英語名）
      const existingCommunity = existingCommunities?.find(c => 
        c.name === community.name || 
        c.name.toLowerCase() === englishName.toLowerCase()
      );
      
      if (existingCommunity) {
        console.log(`コミュニティ "${community.name}" は既に存在します (ID: ${existingCommunity.id})`);
        continue;
      }

      // 存在しない場合は新規作成（英語名で作成）
      const { data, error } = await supabase.from("communities").insert({
        name: englishName || community.name,
        description: community.description,
        color: community.color,
        icon: community.icon
      }).select();

      if (error) {
        console.error(`コミュニティ "${community.name}" の作成に失敗:`, error);
      } else {
        console.log(`コミュニティ "${community.name}" を作成しました:`, data);
        communitiesCreated = true;
      }
    }

    // 作成後のコミュニティIDを取得して確認
    const { data: updatedCommunities } = await supabase
      .from("communities")
      .select("id, name");
      
    console.log("更新後のコミュニティ一覧:", updatedCommunities);
    
    // コミュニティマッピングを必ず再初期化
    console.log("コミュニティマッピングを初期化します");
    await initializeCommunityMapping();

    console.log("コミュニティの初期化完了");
    return updatedCommunities;
  } catch (err) {
    console.error("コミュニティ初期化エラー:", err);
    return null;
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
