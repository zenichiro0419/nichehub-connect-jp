# Test info

- Name: Signup機能 - UI/UX・エラーハンドリングテスト >> 3. バックエンドエラー処理テスト >> SIGNUP-402: 既存ユーザー名での登録試行
- Location: /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-ui-errors.spec.ts:296:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8080/login
Call log:
  - navigating to "http://localhost:8080/login", waiting until "load"

    at SignupPageHelper.navigateToLoginPage (/Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/utils/test-helpers.ts:90:21)
    at /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-ui-errors.spec.ts:33:24
```

# Test source

```ts
   1 | /**
   2 |  * Playwrightテスト用ヘルパー関数
   3 |  *
   4 |  * @description signup機能のE2Eテストで使用する共通ユーティリティ
   5 |  * @author NicheHub Team
   6 |  * @version 1.0.0
   7 |  *
   8 |  * 主な機能:
   9 |  * - テストデータ管理
   10 |  * - ページ操作のヘルパー関数
   11 |  * - セレクター定義
   12 |  * - エラーハンドリング
   13 |  *
   14 |  * 制限事項:
   15 |  * - Playwrightのページオブジェクトが必要
   16 |  * - テスト環境のSupabase設定が必要
   17 |  */
   18 |
   19 | import { Page } from "@playwright/test";
   20 |
   21 | /**
   22 |  * テストデータ定数
   23 |  */
   24 | export const TEST_DATA = {
   25 |   // 正常系テスト用
   26 |   validEmail: "test@example.com",
   27 |   validPassword: "password123",
   28 |   validUsername: "testuser123",
   29 |
   30 |   // 異常系テスト用
   31 |   existingEmail: "existing@example.com",
   32 |   existingUsername: "existinguser",
   33 |   invalidEmail: "invalid-email",
   34 |   shortPassword: "123",
   35 |   longUsername: "a".repeat(51), // 制限がある場合
   36 |
   37 |   // 境界値テスト用
   38 |   minPasswordLength: "abcd1234", // 8文字
   39 |   specialCharUsername: "user@#$",
   40 |
   41 |   // セキュリティテスト用
   42 |   sqlInjection: "'; DROP TABLE profiles; --",
   43 |   xssAttack: "<script>alert('xss')</script>",
   44 | } as const;
   45 |
   46 | /**
   47 |  * セレクター定数
   48 |  */
   49 | export const SELECTORS = {
   50 |   // フォーム要素
   51 |   emailInput: '[data-testid="email-input"]',
   52 |   passwordInput: '[data-testid="password-input"]',
   53 |   confirmPasswordInput: '[data-testid="confirm-password-input"]',
   54 |   usernameInput: '[data-testid="username-input"]',
   55 |   signupButton: '[data-testid="signup-button"]',
   56 |
   57 |   // モード切り替え
   58 |   loginModeButton: '[data-testid="login-mode-button"]',
   59 |   signupModeButton: '[data-testid="signup-mode-button"]',
   60 |
   61 |   // エラー・成功メッセージ
   62 |   errorToast: '[data-testid="error-toast"]',
   63 |   successToast: '[data-testid="success-toast"]',
   64 |
   65 |   // ローディング状態
   66 |   loadingIndicator: '[data-testid="loading-indicator"]',
   67 |
   68 |   // フォーム状態
   69 |   signupForm: '[data-testid="signup-form"]',
   70 |   loginForm: '[data-testid="login-form"]',
   71 | } as const;
   72 |
   73 | /**
   74 |  * ページヘルパークラス
   75 |  */
   76 | export class SignupPageHelper {
   77 |   /**
   78 |    * コンストラクター
   79 |    *
   80 |    * @param page - Playwrightページオブジェクト
   81 |    */
   82 |   constructor(private page: Page) {}
   83 |
   84 |   /**
   85 |    * Login/Signup画面にアクセス
   86 |    *
   87 |    * @returns Promise<void>
   88 |    */
   89 |   async navigateToLoginPage(): Promise<void> {
>  90 |     await this.page.goto("/login");
      |                     ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8080/login
   91 |     await this.page.waitForLoadState("networkidle");
   92 |   }
   93 |
   94 |   /**
   95 |    * 登録モードに切り替え
   96 |    *
   97 |    * @returns Promise<void>
   98 |    */
   99 |   async switchToSignupMode(): Promise<void> {
  100 |     const signupModeButton = this.page.locator(SELECTORS.signupModeButton);
  101 |     await signupModeButton.click();
  102 |
  103 |     // 登録フォームが表示されるまで待機
  104 |     await this.page
  105 |       .locator(SELECTORS.usernameInput)
  106 |       .waitFor({ state: "visible" });
  107 |     await this.page
  108 |       .locator(SELECTORS.confirmPasswordInput)
  109 |       .waitFor({ state: "visible" });
  110 |   }
  111 |
  112 |   /**
  113 |    * ログインモードに切り替え
  114 |    *
  115 |    * @returns Promise<void>
  116 |    */
  117 |   async switchToLoginMode(): Promise<void> {
  118 |     const loginModeButton = this.page.locator(SELECTORS.loginModeButton);
  119 |     await loginModeButton.click();
  120 |
  121 |     // ログインフォームが表示されるまで待機
  122 |     await this.page
  123 |       .locator(SELECTORS.usernameInput)
  124 |       .waitFor({ state: "hidden" });
  125 |     await this.page
  126 |       .locator(SELECTORS.confirmPasswordInput)
  127 |       .waitFor({ state: "hidden" });
  128 |   }
  129 |
  130 |   /**
  131 |    * フォームに入力
  132 |    *
  133 |    * @param formData - 入力データ
  134 |    * @returns Promise<void>
  135 |    */
  136 |   async fillSignupForm(formData: {
  137 |     email?: string;
  138 |     password?: string;
  139 |     confirmPassword?: string;
  140 |     username?: string;
  141 |   }): Promise<void> {
  142 |     if (formData.email !== undefined) {
  143 |       await this.page.locator(SELECTORS.emailInput).fill(formData.email);
  144 |     }
  145 |
  146 |     if (formData.password !== undefined) {
  147 |       await this.page.locator(SELECTORS.passwordInput).fill(formData.password);
  148 |     }
  149 |
  150 |     if (formData.confirmPassword !== undefined) {
  151 |       await this.page
  152 |         .locator(SELECTORS.confirmPasswordInput)
  153 |         .fill(formData.confirmPassword);
  154 |     }
  155 |
  156 |     if (formData.username !== undefined) {
  157 |       await this.page.locator(SELECTORS.usernameInput).fill(formData.username);
  158 |     }
  159 |   }
  160 |
  161 |   /**
  162 |    * 登録ボタンをクリック
  163 |    *
  164 |    * @returns Promise<void>
  165 |    */
  166 |   async clickSignupButton(): Promise<void> {
  167 |     await this.page.locator(SELECTORS.signupButton).click();
  168 |   }
  169 |
  170 |   /**
  171 |    * ローディング状態の確認
  172 |    *
  173 |    * @returns Promise<boolean>
  174 |    */
  175 |   async isLoading(): Promise<boolean> {
  176 |     const loadingIndicator = this.page.locator(SELECTORS.loadingIndicator);
  177 |     return await loadingIndicator.isVisible();
  178 |   }
  179 |
  180 |   /**
  181 |    * エラートーストの確認
  182 |    *
  183 |    * @returns Promise<string | null>
  184 |    */
  185 |   async getErrorToastMessage(): Promise<string | null> {
  186 |     const errorToast = this.page.locator(SELECTORS.errorToast);
  187 |     if (await errorToast.isVisible()) {
  188 |       return await errorToast.textContent();
  189 |     }
  190 |     return null;
```