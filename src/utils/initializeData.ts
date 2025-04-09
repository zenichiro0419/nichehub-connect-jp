
import { supabase } from "@/integrations/supabase/client";
import { mockCommunities } from "@/data/mockData";

/**
 * Supabaseのコミュニティテーブルに初期データを追加する関数
 */
export async function initializeCommunities() {
  console.log("コミュニティの初期化を開始");

  try {
    // 既存のコミュニティを確認
    const { data: existingCommunities, error: fetchError } = await supabase
      .from("communities")
      .select("id");
    
    if (fetchError) {
      console.error("コミュニティデータの取得に失敗:", fetchError);
      return;
    }

    // モックコミュニティデータをSupabaseに挿入
    for (const community of mockCommunities) {
      // 既に存在するかチェック
      if (existingCommunities?.some(c => c.id === community.supabaseId)) {
        console.log(`コミュニティ "${community.name}" は既に存在します`);
        continue;
      }

      const { error } = await supabase.from("communities").insert({
        id: community.supabaseId,
        name: community.name,
        description: community.description,
        color: community.color,
        icon: community.icon
      });

      if (error) {
        console.error(`コミュニティ "${community.name}" の作成に失敗:`, error);
      } else {
        console.log(`コミュニティ "${community.name}" を作成しました`);
      }
    }

    console.log("コミュニティの初期化完了");
  } catch (err) {
    console.error("コミュニティ初期化エラー:", err);
  }
}
