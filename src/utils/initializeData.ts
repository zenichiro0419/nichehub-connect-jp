
import { supabase } from "@/integrations/supabase/client";
import { mockCommunities } from "@/data/mockData";

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

    // モックコミュニティデータをSupabaseに挿入
    for (const community of mockCommunities) {
      // 既存のコミュニティと名前を比較して存在するかチェック
      const existingCommunity = existingCommunities?.find(c => c.name === community.name);
      
      if (existingCommunity) {
        console.log(`コミュニティ "${community.name}" は既に存在します (ID: ${existingCommunity.id})`);
        // 既存のIDをモックデータに更新 (RLSポリシーのため更新はできないのでここでは何もしない)
        continue;
      }

      // 存在しない場合は新規作成
      const { data, error } = await supabase.from("communities").insert({
        name: community.name,
        description: community.description,
        color: community.color,
        icon: community.icon
      }).select();

      if (error) {
        console.error(`コミュニティ "${community.name}" の作成に失敗:`, error);
      } else {
        console.log(`コミュニティ "${community.name}" を作成しました:`, data);
      }
    }

    // 作成後のコミュニティIDを取得して確認
    const { data: updatedCommunities } = await supabase
      .from("communities")
      .select("id, name");
      
    console.log("更新後のコミュニティ一覧:", updatedCommunities);

    console.log("コミュニティの初期化完了");
    return updatedCommunities;
  } catch (err) {
    console.error("コミュニティ初期化エラー:", err);
    return null;
  }
}
