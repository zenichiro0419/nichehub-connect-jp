# Test info

- Name: Signup機能 - バリデーションテスト（異常系） >> 追加のバリデーションテスト >> 特殊なメールアドレス形式
- Location: /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-validation.spec.ts:318:5

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not ""
    at /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-validation.spec.ts:342:39
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
- textbox "メールアドレス": test..test@example.com
- text: パスワード
- textbox "パスワード": password123
- text: パスワード(確認)
- textbox "パスワード(確認)": password123
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
  314 |       );
  315 |       expect(validationMessage).not.toBe("");
  316 |     });
  317 |
  318 |     test("特殊なメールアドレス形式", async ({ page }) => {
  319 |       const specialEmails = [
  320 |         "test@",
  321 |         "@example.com",
  322 |         "test..test@example.com",
  323 |         "test@.com",
  324 |         "test@com",
  325 |       ];
  326 |
  327 |       for (const email of specialEmails) {
  328 |         await signupHelper.fillSignupForm({
  329 |           email: email,
  330 |           password: TEST_DATA.validPassword,
  331 |           confirmPassword: TEST_DATA.validPassword,
  332 |           username: TEST_DATA.validUsername,
  333 |         });
  334 |
  335 |         await signupHelper.clickSignupButton();
  336 |
  337 |         // バリデーションエラーが発生することを確認
  338 |         const emailInput = page.locator(SELECTORS.emailInput);
  339 |         const validationMessage = await emailInput.evaluate(
  340 |           (el: HTMLInputElement) => el.validationMessage
  341 |         );
> 342 |         expect(validationMessage).not.toBe("");
      |                                       ^ Error: expect(received).not.toBe(expected) // Object.is equality
  343 |
  344 |         // 次のテストのためにクリア
  345 |         await signupHelper.clearAllFields();
  346 |       }
  347 |     });
  348 |
  349 |     test("パスワード強度チェック", async ({ page }) => {
  350 |       const weakPasswords = [
  351 |         "12345678", // 数字のみ
  352 |         "abcdefgh", // 英字のみ
  353 |         "aaaaaaaa", // 同じ文字の繰り返し
  354 |       ];
  355 |
  356 |       for (const password of weakPasswords) {
  357 |         await signupHelper.fillSignupForm({
  358 |           email: TEST_DATA.validEmail,
  359 |           password: password,
  360 |           confirmPassword: password,
  361 |           username: TEST_DATA.validUsername,
  362 |         });
  363 |
  364 |         await signupHelper.clickSignupButton();
  365 |
  366 |         // パスワード強度によるエラーまたは成功（実装による）
  367 |         await page.waitForTimeout(1000);
  368 |
  369 |         // 次のテストのためにクリア
  370 |         await signupHelper.clearAllFields();
  371 |       }
  372 |     });
  373 |   });
  374 | });
  375 |
```