# Test info

- Name: Signup機能 - バリデーションテスト（異常系） >> 2.1 必須入力チェック >> SIGNUP-102: emailのみ未入力
- Location: /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-validation.spec.ts:51:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "入力してください"
Received string:    "Fill out this field"
    at /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-validation.spec.ts:68:33
```

# Page snapshot

```yaml
- heading "NicheHub" [level=1]
- heading "あなたの専門分野のコミュニティへようこそ" [level=2]
- paragraph: NicheHubは、専門分野ごとのクローズドコミュニティを提供するSNSです。 あなたの関心に合わせたコミュニティで、知識を共有し、専門家と繋がりましょう。
- text: 💼
- heading "Business" [level=3]
- paragraph: ビジネス戦略、マーケティング、起業について議論しよう
- text: 🎨
- heading "Art" [level=3]
- paragraph: アート、デザイン、クリエイティブな表現を共有しよう
- text: 💻
- heading "Technology" [level=3]
- paragraph: テクノロジー、開発、イノベーションについて語ろう
- heading "新規アカウント登録" [level=2]
- paragraph: 数分で簡単に登録できます
- text: メールアドレス
- textbox "メールアドレス"
- text: パスワード
- textbox "パスワード": password123
- text: パスワード(確認)
- textbox "パスワード(確認)": password123
- text: ユーザー名（一意のID）
- textbox "ユーザー名（一意のID）": testuser123
- button "登録"
- paragraph:
  - text: すでにアカウントをお持ちですか？
  - button "ログイン"
- region "Notifications (F8)":
  - list
```

# Test source

```ts
   1 | /**
   2 |  * Signup機能 バリデーションテストスイート
   3 |  *
   4 |  * @description NicheHubのユーザーアカウント作成機能のバリデーション（異常系）E2Eテスト
   5 |  * @author NicheHub Team
   6 |  * @version 1.0.0
   7 |  *
   8 |  * テスト対象:
   9 |  * - 必須入力チェック (SIGNUP-101～105)
   10 |  * - フォーマットバリデーション (SIGNUP-201～203)
   11 |  * - 特殊文字・境界値テスト (SIGNUP-301～303)
   12 |  *
   13 |  * 制限事項:
   14 |  * - テスト環境のSupabaseが必要
   15 |  * - ローカル開発サーバーが起動している必要がある
   16 |  */
   17 |
   18 | import { test, expect } from "@playwright/test";
   19 | import { SignupPageHelper, TEST_DATA, SELECTORS } from "./utils/test-helpers";
   20 |
   21 | test.describe("Signup機能 - バリデーションテスト（異常系）", () => {
   22 |   let signupHelper: SignupPageHelper;
   23 |
   24 |   test.beforeEach(async ({ page }) => {
   25 |     signupHelper = new SignupPageHelper(page);
   26 |     await signupHelper.navigateToLoginPage();
   27 |     await signupHelper.switchToSignupMode();
   28 |   });
   29 |
   30 |   test.describe("2.1 必須入力チェック", () => {
   31 |     test("SIGNUP-101: 全フィールド未入力での登録試行", async ({ page }) => {
   32 |       // 1. 登録モードで全フィールドを空のまま
   33 |       await signupHelper.clearAllFields();
   34 |
   35 |       // 2. 登録ボタンをクリック
   36 |       await signupHelper.clickSignupButton();
   37 |
   38 |       // 期待結果の確認
   39 |       // ・登録処理が実行されない
   40 |       // ・必須入力エラーが表示される
   41 |
   42 |       // HTMLフォームバリデーションまたはカスタムバリデーションによるエラー表示を確認
   43 |       // ブラウザのデフォルトバリデーションメッセージまたはカスタムエラーを検証
   44 |       const emailInput = page.locator(SELECTORS.emailInput);
   45 |       const validationMessage = await emailInput.evaluate(
   46 |         (el: HTMLInputElement) => el.validationMessage
   47 |       );
   48 |       expect(validationMessage).not.toBe("");
   49 |     });
   50 |
   51 |     test("SIGNUP-102: emailのみ未入力", async ({ page }) => {
   52 |       // 1. email以外のフィールドに有効な値を入力
   53 |       await signupHelper.fillSignupForm({
   54 |         email: "", // 空文字
   55 |         password: TEST_DATA.validPassword,
   56 |         confirmPassword: TEST_DATA.validPassword,
   57 |         username: TEST_DATA.validUsername,
   58 |       });
   59 |
   60 |       // 2. 登録ボタンをクリック
   61 |       await signupHelper.clickSignupButton();
   62 |
   63 |       // 期待結果: メールアドレス必須エラーが表示される
   64 |       const emailInput = page.locator(SELECTORS.emailInput);
   65 |       const validationMessage = await emailInput.evaluate(
   66 |         (el: HTMLInputElement) => el.validationMessage
   67 |       );
>  68 |       expect(validationMessage).toContain("入力してください");
      |                                 ^ Error: expect(received).toContain(expected) // indexOf
   69 |     });
   70 |
   71 |     test("SIGNUP-103: passwordのみ未入力", async ({ page }) => {
   72 |       // 1. password以外のフィールドに有効な値を入力
   73 |       await signupHelper.fillSignupForm({
   74 |         email: TEST_DATA.validEmail,
   75 |         password: "", // 空文字
   76 |         confirmPassword: TEST_DATA.validPassword,
   77 |         username: TEST_DATA.validUsername,
   78 |       });
   79 |
   80 |       // 2. 登録ボタンをクリック
   81 |       await signupHelper.clickSignupButton();
   82 |
   83 |       // 期待結果: パスワード必須エラーが表示される
   84 |       const passwordInput = page.locator(SELECTORS.passwordInput);
   85 |       const validationMessage = await passwordInput.evaluate(
   86 |         (el: HTMLInputElement) => el.validationMessage
   87 |       );
   88 |       expect(validationMessage).not.toBe("");
   89 |     });
   90 |
   91 |     test("SIGNUP-104: confirm-passwordのみ未入力", async ({ page }) => {
   92 |       // 1. confirm-password以外のフィールドに有効な値を入力
   93 |       await signupHelper.fillSignupForm({
   94 |         email: TEST_DATA.validEmail,
   95 |         password: TEST_DATA.validPassword,
   96 |         confirmPassword: "", // 空文字
   97 |         username: TEST_DATA.validUsername,
   98 |       });
   99 |
  100 |       // 2. 登録ボタンをクリック
  101 |       await signupHelper.clickSignupButton();
  102 |
  103 |       // 期待結果: パスワード確認必須エラーが表示される
  104 |       const confirmPasswordInput = page.locator(SELECTORS.confirmPasswordInput);
  105 |       const validationMessage = await confirmPasswordInput.evaluate(
  106 |         (el: HTMLInputElement) => el.validationMessage
  107 |       );
  108 |       expect(validationMessage).not.toBe("");
  109 |     });
  110 |
  111 |     test("SIGNUP-105: usernameのみ未入力", async ({ page }) => {
  112 |       // 1. username以外のフィールドに有効な値を入力
  113 |       await signupHelper.fillSignupForm({
  114 |         email: TEST_DATA.validEmail,
  115 |         password: TEST_DATA.validPassword,
  116 |         confirmPassword: TEST_DATA.validPassword,
  117 |         username: "", // 空文字
  118 |       });
  119 |
  120 |       // 2. 登録ボタンをクリック
  121 |       await signupHelper.clickSignupButton();
  122 |
  123 |       // 期待結果: ユーザー名必須エラーが表示される
  124 |       const usernameInput = page.locator(SELECTORS.usernameInput);
  125 |       const validationMessage = await usernameInput.evaluate(
  126 |         (el: HTMLInputElement) => el.validationMessage
  127 |       );
  128 |       expect(validationMessage).not.toBe("");
  129 |     });
  130 |   });
  131 |
  132 |   test.describe("2.2 フォーマットバリデーション", () => {
  133 |     test("SIGNUP-201: 無効なメールアドレス形式", async ({ page }) => {
  134 |       // 1. emailに"invalid-email"を入力
  135 |       await signupHelper.fillSignupForm({
  136 |         email: TEST_DATA.invalidEmail,
  137 |         password: TEST_DATA.validPassword,
  138 |         confirmPassword: TEST_DATA.validPassword,
  139 |         username: TEST_DATA.validUsername,
  140 |       });
  141 |
  142 |       // 2. 他フィールドに有効値を入力（上記で実行済み）
  143 |
  144 |       // 3. 登録ボタンをクリック
  145 |       await signupHelper.clickSignupButton();
  146 |
  147 |       // 期待結果
  148 |       // ・メールアドレス形式エラーが表示される
  149 |       // ・HTML5バリデーションエラー
  150 |       const emailInput = page.locator(SELECTORS.emailInput);
  151 |       const validationMessage = await emailInput.evaluate(
  152 |         (el: HTMLInputElement) => el.validationMessage
  153 |       );
  154 |       expect(validationMessage).toContain("有効なメール");
  155 |     });
  156 |
  157 |     test("SIGNUP-202: 短すぎるパスワード", async ({ page }) => {
  158 |       // 1. passwordに"123"（7文字以下）を入力
  159 |       await signupHelper.fillSignupForm({
  160 |         email: TEST_DATA.validEmail,
  161 |         password: TEST_DATA.shortPassword,
  162 |         confirmPassword: TEST_DATA.shortPassword,
  163 |         username: TEST_DATA.validUsername,
  164 |       });
  165 |
  166 |       // 2. 他フィールドに有効値を入力（上記で実行済み）
  167 |
  168 |       // 3. 登録ボタンをクリック
```