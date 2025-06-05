# NicheHub Connect JP - E2Eテストスイート

## 概要

このディレクトリには、NicheHub Connect JPのユーザーアカウント作成（Signup）機能のPlaywright E2Eテストが含まれています。

## テストファイル構成

```
src/e2e/
├── utils/
│   └── test-helpers.ts          # 共通ヘルパー関数とユーティリティ
├── signup-normal.spec.ts        # 正常系テスト (SIGNUP-001〜005)
├── signup-validation.spec.ts    # バリデーション・異常系テスト (SIGNUP-101〜303)
├── signup-ui-errors.spec.ts     # UI/UX・エラーハンドリングテスト (SIGNUP-601〜1102)
└── README.md                    # このファイル
```

## 前提条件

### 必要な環境
- Node.js (v18以上)
- npm または yarn
- ローカル開発サーバーが `http://localhost:5173` で起動している
- テスト用のSupabaseプロジェクト環境

### 必要な設定
1. **環境変数**: `.env.local` にテスト用のSupabase設定
2. **テストデータ**: 一部のテストで既存ユーザーが必要
   - `existing@example.com` (既存メールアドレステスト用)
   - `existinguser` (既存ユーザー名テスト用)

## テスト実行方法

### 基本的な実行コマンド

```bash
# 全E2Eテストを実行
npm run test:e2e

# UIモードでテスト実行（推奨：デバッグに便利）
npm run test:e2e:ui

# ブラウザを表示してテスト実行
npm run test:e2e:headed

# signup機能のテストのみ実行
npm run test:e2e:signup

# テストレポートを表示
npm run test:e2e:report
```

### 個別テストファイルの実行

```bash
# 正常系テストのみ
npx playwright test src/e2e/signup-normal.spec.ts

# バリデーションテストのみ
npx playwright test src/e2e/signup-validation.spec.ts

# UI/UXテストのみ
npx playwright test src/e2e/signup-ui-errors.spec.ts
```

### 特定のブラウザでテスト実行

```bash
# Chromiumのみ
npx playwright test --project=chromium

# Firefoxのみ
npx playwright test --project=firefox

# WebKit (Safari) のみ
npx playwright test --project=webkit

# モバイルChromeのみ
npx playwright test --project="Mobile Chrome"
```

## テストケース一覧

### 正常系テスト (`signup-normal.spec.ts`)
- **SIGNUP-001**: 有効なデータでの新規登録
- **SIGNUP-002**: ログインモードから登録モードへの切り替え
- **SIGNUP-003**: 登録モードからログインモードへの切り替え
- **SIGNUP-004**: 各入力フィールドの基本動作
- **SIGNUP-005**: プレースホルダーの表示確認

### バリデーションテスト (`signup-validation.spec.ts`)
- **SIGNUP-101〜105**: 必須入力チェック
- **SIGNUP-201〜203**: フォーマットバリデーション
- **SIGNUP-301〜303**: 特殊文字・境界値テスト

### UI/UX・エラーハンドリングテスト (`signup-ui-errors.spec.ts`)
- **SIGNUP-601〜602**: ローディング状態
- **SIGNUP-701〜702**: エラートースト表示
- **SIGNUP-801〜802**: フォーム状態管理
- **SIGNUP-401〜502**: バックエンドエラー処理
- **SIGNUP-1101〜1102**: セキュリティテスト

## 設定・カスタマイズ

### セレクター変更
`src/e2e/utils/test-helpers.ts` の `SELECTORS` 定数を編集してください。

```typescript
export const SELECTORS = {
  emailInput: '[data-testid="email-input"]',
  passwordInput: '[data-testid="password-input"]',
  // ...
} as const;
```

### テストデータ変更
`src/e2e/utils/test-helpers.ts` の `TEST_DATA` 定数を編集してください。

```typescript
export const TEST_DATA = {
  validEmail: "test@example.com",
  validPassword: "password123",
  // ...
} as const;
```

### Playwright設定変更
`playwright.config.ts` を編集してください。

## トラブルシューティング

### よくある問題

#### 1. テストがタイムアウトする
```bash
# タイムアウト時間を延長
npx playwright test --timeout=60000
```

#### 2. ローカルサーバーが起動していない
```bash
# 別ターミナルで開発サーバーを起動
npm run dev
```

#### 3. Supabaseの接続エラー
- `.env.local` のSupabase設定を確認
- テスト用プロジェクトのURL・キーが正しいか確認

#### 4. セレクターが見つからない
- 実際のHTML要素に `data-testid` 属性が追加されているか確認
- セレクターが最新のコンポーネント実装と一致しているか確認

### デバッグモード

```bash
# デバッグモードで実行（ブラウザが一時停止）
npx playwright test --debug

# 特定のテストをデバッグ
npx playwright test src/e2e/signup-normal.spec.ts --debug
```

### ヘッドレスモード無効化

```bash
# ブラウザを表示してテスト実行
npx playwright test --headed --slowmo=1000
```

## CI/CD統合

### GitHub Actions例

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 貢献ガイドライン

### 新しいテストケース追加時

1. `docs/signup_test.md` を参考にテストケースIDを確認
2. 適切なテストファイルに追加
3. 共通処理は `test-helpers.ts` に抽出
4. 日本語コメントでテスト内容を明記
5. エラーハンドリングを適切に実装

### コード品質

- TypeScriptの型安全性を活用
- 再利用可能なヘルパー関数を作成
- 適切な待機時間の設定
- わかりやすいテスト名とコメント

## 参考リンク

- [Playwright公式ドキュメント](https://playwright.dev/)
- [NicheHub Signup機能仕様書](../../docs/signup.md)
- [Signup機能テストケース一覧](../../docs/signup_test.md) 