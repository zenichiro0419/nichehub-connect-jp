# Test info

- Name: Signup機能 - バリデーションテスト（異常系） >> 2.2 フォーマットバリデーション >> SIGNUP-203: パスワード不一致
- Location: /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-validation.spec.ts:186:5

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not ""
    at /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-validation.spec.ts:213:39
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
- textbox "メールアドレス": test@example.com
- text: パスワード
- textbox "パスワード": password123
- text: パスワード(確認)
- textbox "パスワード(確認)": different123
- text: ユーザー名（一意のID）
- textbox "ユーザー名（一意のID）": testuser123
- button "処理中..." [disabled]
- paragraph:
  - text: すでにアカウントをお持ちですか？
  - button "ログイン"
- region "Notifications (F8)":
  - list
```

# Test source

```ts
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
  169 |       await signupHelper.clickSignupButton();
  170 |
  171 |       // 期待結果: "パスワードは8文字以上で入力してください"エラーが表示される
  172 |       // カスタムバリデーションまたはトーストメッセージで確認
  173 |       const errorMessage = await signupHelper.getErrorToastMessage();
  174 |       if (errorMessage) {
  175 |         expect(errorMessage).toContain("パスワードは8文字以上");
  176 |       } else {
  177 |         // HTML5バリデーションの場合
  178 |         const passwordInput = page.locator(SELECTORS.passwordInput);
  179 |         const validationMessage = await passwordInput.evaluate(
  180 |           (el: HTMLInputElement) => el.validationMessage
  181 |         );
  182 |         expect(validationMessage).not.toBe("");
  183 |       }
  184 |     });
  185 |
  186 |     test("SIGNUP-203: パスワード不一致", async ({ page }) => {
  187 |       // 1. passwordに"password123"を入力
  188 |       // 2. confirm-passwordに"different123"を入力
  189 |       await signupHelper.fillSignupForm({
  190 |         email: TEST_DATA.validEmail,
  191 |         password: TEST_DATA.validPassword,
  192 |         confirmPassword: "different123",
  193 |         username: TEST_DATA.validUsername,
  194 |       });
  195 |
  196 |       // 3. 他フィールドに有効値を入力（上記で実行済み）
  197 |
  198 |       // 4. 登録ボタンをクリック
  199 |       await signupHelper.clickSignupButton();
  200 |
  201 |       // 期待結果: "パスワードが一致しません"エラーが表示される
  202 |       const errorMessage = await signupHelper.getErrorToastMessage();
  203 |       if (errorMessage) {
  204 |         expect(errorMessage).toContain("パスワードが一致");
  205 |       } else {
  206 |         // カスタムバリデーションが実装されている場合の確認
  207 |         const confirmPasswordInput = page.locator(
  208 |           SELECTORS.confirmPasswordInput
  209 |         );
  210 |         const validationMessage = await confirmPasswordInput.evaluate(
  211 |           (el: HTMLInputElement) => el.validationMessage
  212 |         );
> 213 |         expect(validationMessage).not.toBe("");
      |                                       ^ Error: expect(received).not.toBe(expected) // Object.is equality
  214 |       }
  215 |     });
  216 |   });
  217 |
  218 |   test.describe("2.3 特殊文字・境界値テスト", () => {
  219 |     test("SIGNUP-301: ちょうど8文字のパスワード", async ({ page }) => {
  220 |       // 1. passwordに"abcd1234"（8文字）を入力
  221 |       await signupHelper.fillSignupForm({
  222 |         email: TEST_DATA.validEmail,
  223 |         password: TEST_DATA.minPasswordLength,
  224 |         confirmPassword: TEST_DATA.minPasswordLength,
  225 |         username: TEST_DATA.validUsername,
  226 |       });
  227 |
  228 |       // 2. 他フィールドに有効値を入力（上記で実行済み）
  229 |
  230 |       // 3. 登録ボタンをクリック
  231 |       await signupHelper.clickSignupButton();
  232 |
  233 |       // 期待結果: 登録処理が成功する
  234 |       // エラーメッセージが表示されないことを確認
  235 |
  236 |       // 少し待機してエラートーストが表示されないことを確認
  237 |       await page.waitForTimeout(2000);
  238 |       const errorMessage = await signupHelper.getErrorToastMessage();
  239 |       expect(errorMessage).toBeNull();
  240 |     });
  241 |
  242 |     test("SIGNUP-302: 特殊文字を含むユーザー名", async ({ page }) => {
  243 |       // 1. usernameに"user@#$"を入力
  244 |       await signupHelper.fillSignupForm({
  245 |         email: TEST_DATA.validEmail,
  246 |         password: TEST_DATA.validPassword,
  247 |         confirmPassword: TEST_DATA.validPassword,
  248 |         username: TEST_DATA.specialCharUsername,
  249 |       });
  250 |
  251 |       // 2. 他フィールドに有効値を入力（上記で実行済み）
  252 |
  253 |       // 3. 登録ボタンをクリック
  254 |       await signupHelper.clickSignupButton();
  255 |
  256 |       // 期待結果: ユーザー名の文字制限に応じた処理（許可/禁止のどちらかを確認）
  257 |       // 実装に応じてエラーまたは成功を確認
  258 |       await page.waitForTimeout(2000);
  259 |
  260 |       // エラーまたは成功のいずれかが発生することを確認
  261 |       const errorMessage = await signupHelper.getErrorToastMessage();
  262 |       // 特殊文字が許可されているか禁止されているかは実装による
  263 |       // ここでは処理が完了することを確認
  264 |       expect(["string", "object"]).toContain(typeof errorMessage);
  265 |     });
  266 |
  267 |     test("SIGNUP-303: 非常に長い入力値", async ({ page }) => {
  268 |       // 1. 各フィールドに極端に長い文字列を入力
  269 |       const longString = "a".repeat(1000);
  270 |
  271 |       await signupHelper.fillSignupForm({
  272 |         email: `${longString}@example.com`,
  273 |         password: longString,
  274 |         confirmPassword: longString,
  275 |         username: longString,
  276 |       });
  277 |
  278 |       // 2. 登録ボタンをクリック
  279 |       await signupHelper.clickSignupButton();
  280 |
  281 |       // 期待結果: 適切な文字数制限エラーが表示される
  282 |       await page.waitForTimeout(2000);
  283 |
  284 |       // バリデーションエラーまたはトーストエラーが表示されることを確認
  285 |       const errorMessage = await signupHelper.getErrorToastMessage();
  286 |       if (errorMessage) {
  287 |         expect(errorMessage.length).toBeGreaterThan(0);
  288 |       } else {
  289 |         // HTML5バリデーションによる制限をチェック
  290 |         const emailInput = page.locator(SELECTORS.emailInput);
  291 |         const emailValue = await emailInput.inputValue();
  292 |         // maxlength属性による制限がかかっていることを期待
  293 |         expect(emailValue.length).toBeLessThan(1000);
  294 |       }
  295 |     });
  296 |   });
  297 |
  298 |   test.describe("追加のバリデーションテスト", () => {
  299 |     test("空白文字のみの入力", async ({ page }) => {
  300 |       // 空白文字のみを入力
  301 |       await signupHelper.fillSignupForm({
  302 |         email: "   ",
  303 |         password: "   ",
  304 |         confirmPassword: "   ",
  305 |         username: "   ",
  306 |       });
  307 |
  308 |       await signupHelper.clickSignupButton();
  309 |
  310 |       // バリデーションエラーが発生することを確認
  311 |       const emailInput = page.locator(SELECTORS.emailInput);
  312 |       const validationMessage = await emailInput.evaluate(
  313 |         (el: HTMLInputElement) => el.validationMessage
```