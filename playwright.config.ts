/**
 * Playwright設定ファイル
 *
 * @description NicheHub Connect JPプロジェクトのE2Eテスト設定
 * @author NicheHub Team
 * @version 1.0.0
 *
 * 主な仕様:
 * - 複数ブラウザ対応（Chromium, Firefox, WebKit）
 * - ローカル開発サーバーとの連携
 * - テスト結果レポート生成
 * - 並列実行設定
 *
 * 制限事項:
 * - ローカル環境での実行を前提
 * - Supabaseテスト環境が必要
 */

import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright設定
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // テストディレクトリ
  testDir: "./src/e2e",

  // 各テストファイルを完全に並列実行
  fullyParallel: true,

  // CIで失敗時のリトライなし、ローカルでは再試行なし
  forbidOnly: !!process.env.CI,

  // CIでのリトライ回数
  retries: process.env.CI ? 2 : 0,

  // 並列実行するワーカー数
  workers: process.env.CI ? 1 : undefined,

  // レポーター設定
  reporter: "html",

  // 全テスト共通の設定
  use: {
    // ベースURL（ローカル開発サーバー）
    baseURL: "http://localhost:8080",

    // 失敗時のスクリーンショット
    screenshot: "only-on-failure",

    // 失敗時のビデオ録画
    video: "retain-on-failure",

    // テスト実行時のトレース
    trace: "on-first-retry",
  },

  // プロジェクト別設定（ブラウザ別）
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // モバイル対応テスト
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },

    // タブレット対応テスト
    {
      name: "Microsoft Edge",
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },
  ],

  // ローカル開発サーバーの起動設定
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2分でタイムアウト
  },
});
