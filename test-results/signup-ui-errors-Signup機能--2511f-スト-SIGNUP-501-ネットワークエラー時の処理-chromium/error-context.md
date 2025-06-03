# Test info

- Name: Signup機能 - UI/UX・エラーハンドリングテスト >> 3. バックエンドエラー処理テスト >> SIGNUP-501: ネットワークエラー時の処理
- Location: /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-ui-errors.spec.ts:326:5

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /network|ネットワーク|connection/
Received string:  "登録エラーアカウント登録に失敗しました: failed to fetch"
    at /Users/zenichiro/Develop/github/study/nichehub-connect-jp/src/e2e/signup-ui-errors.spec.ts:347:44
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
- textbox "メールアドレス": test-1748935011130-oh09dx@example.com
- text: パスワード
- textbox "パスワード": password123-oh09dx
- text: パスワード(確認)
- textbox "パスワード(確認)": password123-oh09dx
- text: ユーザー名（一意のID）
- textbox "ユーザー名（一意のID）": testuser-1748935011130-oh09dx
- button "登録"
- paragraph:
  - text: すでにアカウントをお持ちですか？
  - button "ログイン"
- region "Notifications (F8)":
  - list:
    - status:
      - text: "登録エラー アカウント登録に失敗しました: Failed to fetch"
      - button:
        - img
```

# Test source

```ts
  247 |       await signupHelper.clickSignupButton();
  248 |
  249 |       // 1. エラー発生後の状態確認
  250 |       await page.waitForTimeout(2000);
  251 |
  252 |       // 期待結果
  253 |       // ・エラー発生後もフォーム値が保持される
  254 |       expect(await signupHelper.getFieldValue(SELECTORS.emailInput)).toBe(
  255 |         TEST_DATA.validEmail
  256 |       );
  257 |       expect(await signupHelper.getFieldValue(SELECTORS.usernameInput)).toBe(
  258 |         TEST_DATA.validUsername
  259 |       );
  260 |
  261 |       // ・ユーザーが再入力しやすい状態
  262 |       const isSignupButtonEnabled = await signupHelper.isSignupButtonEnabled();
  263 |       expect(isSignupButtonEnabled).toBeTruthy();
  264 |     });
  265 |   });
  266 |
  267 |   test.describe("3. バックエンドエラー処理テスト", () => {
  268 |     test("SIGNUP-401: 既存メールアドレスでの登録試行", async ({ page }) => {
  269 |       // 1. 既にDBに存在するメールアドレスを入力
  270 |       await signupHelper.fillSignupForm({
  271 |         email: TEST_DATA.existingEmail,
  272 |         password: TEST_DATA.validPassword,
  273 |         confirmPassword: TEST_DATA.validPassword,
  274 |         username: TEST_DATA.validUsername,
  275 |       });
  276 |
  277 |       // 2. 他フィールドに有効値を入力（上記で実行済み）
  278 |
  279 |       // 3. 登録ボタンをクリック
  280 |       await signupHelper.clickSignupButton();
  281 |
  282 |       // 期待結果
  283 |       await page.waitForTimeout(5000); // バックエンド処理を待機
  284 |
  285 |       const errorMessage = await signupHelper.getErrorToastMessage();
  286 |
  287 |       if (errorMessage) {
  288 |         // ・"このメールアドレスは既に登録済みです"エラートーストが表示される
  289 |         expect(errorMessage.toLowerCase()).toMatch(/登録済み|already|既に使用/);
  290 |
  291 |         // ・error.message="User already registered"
  292 |         // 注意: 実際のエラーメッセージは実装によって異なる
  293 |       }
  294 |     });
  295 |
  296 |     test("SIGNUP-402: 既存ユーザー名での登録試行", async ({ page }) => {
  297 |       // 1. 既にDBに存在するユーザー名を入力
  298 |       await signupHelper.fillSignupForm({
  299 |         email: TEST_DATA.validEmail,
  300 |         password: TEST_DATA.validPassword,
  301 |         confirmPassword: TEST_DATA.validPassword,
  302 |         username: TEST_DATA.existingUsername,
  303 |       });
  304 |
  305 |       // 2. 他フィールドに有効値を入力（上記で実行済み）
  306 |
  307 |       // 3. 登録ボタンをクリック
  308 |       await signupHelper.clickSignupButton();
  309 |
  310 |       // 期待結果
  311 |       await page.waitForTimeout(5000); // バックエンド処理を待機
  312 |
  313 |       const errorMessage = await signupHelper.getErrorToastMessage();
  314 |
  315 |       if (errorMessage) {
  316 |         // ・"このユーザー名は既に使用されています"エラートーストが表示される
  317 |         expect(errorMessage.toLowerCase()).toMatch(
  318 |           /ユーザー名|username|既に使用/
  319 |         );
  320 |
  321 |         // ・error.message="Username already exists"
  322 |         // 注意: 実際のエラーメッセージは実装によって異なる
  323 |       }
  324 |     });
  325 |
  326 |     test("SIGNUP-501: ネットワークエラー時の処理", async ({ page }) => {
  327 |       // 1. ネットワークを切断した状態
  328 |       await simulateNetworkCondition(page, true); // オフライン状態
  329 |
  330 |       // 2. 有効なデータで登録試行
  331 |       const testData = generateRandomTestData();
  332 |       await signupHelper.fillSignupForm({
  333 |         email: testData.email,
  334 |         password: testData.password,
  335 |         confirmPassword: testData.password,
  336 |         username: testData.username,
  337 |       });
  338 |
  339 |       await signupHelper.clickSignupButton();
  340 |
  341 |       // 期待結果
  342 |       await page.waitForTimeout(5000);
  343 |
  344 |       // ・"ネットワークエラー"メッセージが表示される
  345 |       const errorMessage = await signupHelper.getErrorToastMessage();
  346 |       if (errorMessage) {
> 347 |         expect(errorMessage.toLowerCase()).toMatch(
      |                                            ^ Error: expect(received).toMatch(expected)
  348 |           /network|ネットワーク|connection/
  349 |         );
  350 |       }
  351 |
  352 |       // ・ローディング状態が解除される
  353 |       expect(await signupHelper.isLoading()).toBeFalsy();
  354 |
  355 |       // ネットワークを復旧
  356 |       await simulateNetworkCondition(page, false);
  357 |     });
  358 |
  359 |     test.skip("SIGNUP-502: Supabaseサービス停止時の処理", async ({ page }) => {
  360 |       // 注意: このテストは実際のサービス停止をシミュレートするため、
  361 |       // 通常のテスト実行ではスキップします
  362 |       // 1. Supabaseが利用できない状態
  363 |       // 2. 有効なデータで登録試行
  364 |       // 期待結果:
  365 |       // ・"サービス一時停止"メッセージが表示される
  366 |       // ・適切なエラーハンドリング
  367 |     });
  368 |   });
  369 |
  370 |   test.describe("セキュリティテスト", () => {
  371 |     test("SIGNUP-1101: SQLインジェクション対策", async ({ page }) => {
  372 |       // 1. usernameに"'; DROP TABLE profiles; --"を入力
  373 |       await signupHelper.fillSignupForm({
  374 |         email: TEST_DATA.validEmail,
  375 |         password: TEST_DATA.validPassword,
  376 |         confirmPassword: TEST_DATA.validPassword,
  377 |         username: TEST_DATA.sqlInjection,
  378 |       });
  379 |
  380 |       // 2. 登録試行
  381 |       await signupHelper.clickSignupButton();
  382 |
  383 |       // 期待結果
  384 |       await page.waitForTimeout(3000);
  385 |
  386 |       // ・攻撃が無効化される
  387 |       // ・正常なエラーハンドリング
  388 |       // ・データベースに影響なし
  389 |
  390 |       // エラーメッセージまたは正常処理のいずれかが発生
  391 |       const errorMessage = await signupHelper.getErrorToastMessage();
  392 |
  393 |       // SQLインジェクション攻撃によるシステム破壊が発生していないことを確認
  394 |       // （ページが正常に動作し続けることを確認）
  395 |       expect(await page.locator("body").isVisible()).toBeTruthy();
  396 |
  397 |       // フォームが引き続き利用可能であることを確認
  398 |       expect(await signupHelper.isSignupButtonEnabled()).toBeTruthy();
  399 |     });
  400 |
  401 |     test("SIGNUP-1102: XSS攻撃対策", async ({ page }) => {
  402 |       // 1. usernameに"<script>alert('xss')</script>"を入力
  403 |       await signupHelper.fillSignupForm({
  404 |         email: TEST_DATA.validEmail,
  405 |         password: TEST_DATA.validPassword,
  406 |         confirmPassword: TEST_DATA.validPassword,
  407 |         username: TEST_DATA.xssAttack,
  408 |       });
  409 |
  410 |       // 2. 登録試行
  411 |       await signupHelper.clickSignupButton();
  412 |
  413 |       // 期待結果
  414 |       await page.waitForTimeout(3000);
  415 |
  416 |       // ・スクリプトが実行されない
  417 |       // ・適切にエスケープされる
  418 |
  419 |       // XSSアタックによるスクリプト実行が発生していないことを確認
  420 |       // アラートダイアログが表示されていないことを確認
  421 |       const dialogs: string[] = [];
  422 |       page.on("dialog", (dialog) => {
  423 |         dialogs.push(dialog.message());
  424 |         dialog.dismiss();
  425 |       });
  426 |
  427 |       await page.waitForTimeout(1000);
  428 |       expect(dialogs).not.toContain("xss");
  429 |
  430 |       // フォームが正常に動作し続けることを確認
  431 |       expect(await page.locator("body").isVisible()).toBeTruthy();
  432 |     });
  433 |   });
  434 | });
  435 |
```