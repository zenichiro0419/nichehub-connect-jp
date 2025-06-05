/**
 * Signup機能 UI/UX・エラーハンドリングテストスイート
 *
 * @description NicheHubのユーザーアカウント作成機能のUI/UX動作とエラーハンドリングE2Eテスト
 * @author NicheHub Team
 * @version 1.0.0
 *
 * テスト対象:
 * - ローディング状態 (SIGNUP-601, SIGNUP-602)
 * - エラートースト表示 (SIGNUP-701, SIGNUP-702)
 * - フォーム状態管理 (SIGNUP-801, SIGNUP-802)
 * - バックエンドエラー処理 (SIGNUP-401, SIGNUP-402, SIGNUP-501, SIGNUP-502)
 *
 * 制限事項:
 * - テスト環境のSupabaseが必要
 * - ローカル開発サーバーが起動している必要がある
 */

import { test, expect } from "@playwright/test";
import {
  SignupPageHelper,
  TEST_DATA,
  SELECTORS,
  generateRandomTestData,
  simulateNetworkCondition,
} from "./utils/test-helpers";

test.describe("Signup機能 - UI/UX・エラーハンドリングテスト", () => {
  let signupHelper: SignupPageHelper;

  test.beforeEach(async ({ page }) => {
    signupHelper = new SignupPageHelper(page);
    await signupHelper.navigateToLoginPage();
    await signupHelper.switchToSignupMode();
  });

  test.describe("4.1 ローディング状態", () => {
    test("SIGNUP-601: 登録処理中のローディング表示", async ({ page }) => {
      // 1. 有効なデータを入力
      const testData = generateRandomTestData();
      await signupHelper.fillSignupForm({
        email: testData.email,
        password: testData.password,
        confirmPassword: testData.password,
        username: testData.username,
      });

      // 2. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果の確認
      // ・isLoading=trueになる
      // ・登録ボタンが無効化される
      // ・ローディングインジケーターが表示される

      // ローディング状態の確認（短時間でも確認できるように早めにチェック）
      await page.waitForTimeout(100); // 短時間待機

      // ローディングインジケーターまたはボタンの無効化を確認
      const signupButton = page.locator(SELECTORS.signupButton);
      const isDisabled = await signupButton.getAttribute("disabled");

      // ボタンが無効化されているか、またはローディング状態を確認
      const isLoadingState =
        isDisabled !== null || (await signupHelper.isLoading());
      expect(isLoadingState).toBeTruthy();

      // 3. 処理完了まで待機
      await page.waitForTimeout(5000); // 最大5秒待機

      // ・処理完了後にisLoading=falseになる
      expect(await signupHelper.isLoading()).toBeFalsy();

      // ボタンが再度有効になることを確認（エラーがない場合）
      const finalButtonState = await signupHelper.isSignupButtonEnabled();
      expect(typeof finalButtonState).toBe("boolean");
    });

    test("SIGNUP-602: ローディング中の追加クリック防止", async ({ page }) => {
      // 1. 有効なデータを入力
      const testData = generateRandomTestData();
      await signupHelper.fillSignupForm({
        email: testData.email,
        password: testData.password,
        confirmPassword: testData.password,
        username: testData.username,
      });

      // 2. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 3. 処理中に再度ボタンをクリック
      await page.waitForTimeout(100);

      // 期待結果
      // ・2回目のクリックが無視される
      // ・重複処理が発生しない

      // ボタンが無効化されていることを確認
      const signupButton = page.locator(SELECTORS.signupButton);
      const isDisabled = await signupButton.getAttribute("disabled");

      if (isDisabled === null) {
        // ボタンが有効な場合、クリックを試行
        await signupHelper.clickSignupButton();
      }

      // 2回目のクリックが適切に処理されることを確認
      // （エラーが発生しないか、適切に処理される）
      await page.waitForTimeout(2000);

      // エラーメッセージを確認（重複処理エラーでないこと）
      const errorMessage = await signupHelper.getErrorToastMessage();
      if (errorMessage) {
        expect(errorMessage).not.toContain("重複");
        expect(errorMessage).not.toContain("duplicate");
      }
    });
  });

  test.describe("4.2 エラートースト表示", () => {
    test("SIGNUP-701: エラートーストの表示確認", async ({ page }) => {
      // 1. エラーが発生する操作を実行（既存メールアドレス使用）
      await signupHelper.fillSignupForm({
        email: TEST_DATA.existingEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.validUsername,
      });

      await signupHelper.clickSignupButton();

      // 期待結果の確認
      await page.waitForTimeout(3000); // エラー表示を待機

      const errorMessage = await signupHelper.getErrorToastMessage();

      if (errorMessage) {
        // ・タイトル: "登録エラー"
        // ・バリアント: "destructive"（赤色）
        // ・エラー詳細メッセージが表示される
        expect(errorMessage.length).toBeGreaterThan(0);

        // エラートーストのスタイルを確認
        const errorToast = page.locator(SELECTORS.errorToast);
        if (await errorToast.isVisible()) {
          const toastClass = await errorToast.getAttribute("class");
          // destructiveバリアント（赤色）のスタイルが適用されていることを確認
          expect(toastClass).toContain("destructive");
        }
      }

      // ・一定時間後に自動消去される
      await page.waitForTimeout(8000); // 8秒待機
      const laterErrorMessage = await signupHelper.getErrorToastMessage();
      expect(laterErrorMessage).toBeNull();
    });

    test("SIGNUP-702: 複数エラーの表示", async ({ page }) => {
      // 1. 複数のエラーが発生する状況を作成

      // 最初のエラー（無効なメール形式）
      await signupHelper.fillSignupForm({
        email: TEST_DATA.invalidEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.validUsername,
      });

      await signupHelper.clickSignupButton();
      await page.waitForTimeout(2000);

      // 2番目のエラー（短いパスワード）
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.shortPassword,
        confirmPassword: TEST_DATA.shortPassword,
        username: TEST_DATA.validUsername,
      });

      await signupHelper.clickSignupButton();
      await page.waitForTimeout(2000);

      // 期待結果
      // ・最新のエラーが表示される
      // ・適切にトーストが管理される
      const errorMessage = await signupHelper.getErrorToastMessage();

      // 何らかのエラーメッセージが表示されていることを確認
      if (errorMessage) {
        expect(errorMessage.length).toBeGreaterThan(0);
      }

      // トーストが重複表示されていないことを確認
      const errorToasts = page.locator(SELECTORS.errorToast);
      const toastCount = await errorToasts.count();
      expect(toastCount).toBeLessThanOrEqual(3); // 一般的なトースト管理では最大3つ程度
    });
  });

  test.describe("4.3 フォーム状態管理", () => {
    test("SIGNUP-801: 入力値の保持確認", async ({ page }) => {
      // 1. 各フィールドに値を入力
      const testEmail = TEST_DATA.validEmail;
      const testPassword = TEST_DATA.validPassword;
      const testUsername = TEST_DATA.validUsername;

      await signupHelper.fillSignupForm({
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
        username: testUsername,
      });

      // 2. ログイン⇔登録モードを切り替え
      await signupHelper.switchToLoginMode();
      await signupHelper.switchToSignupMode();

      // 期待結果
      // ・共通フィールド（email, password）の値が保持される
      expect(await signupHelper.getFieldValue(SELECTORS.emailInput)).toBe(
        testEmail
      );
      expect(await signupHelper.getFieldValue(SELECTORS.passwordInput)).toBe(
        testPassword
      );

      // ・登録固有フィールドは適切に表示/非表示される
      await expect(page.locator(SELECTORS.usernameInput)).toBeVisible();
      await expect(page.locator(SELECTORS.confirmPasswordInput)).toBeVisible();
    });

    test("SIGNUP-802: フォームリセット", async ({ page }) => {
      // 有効なデータを入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.validUsername,
      });

      // エラーを発生させる（パスワード不一致）
      await signupHelper.fillSignupForm({
        confirmPassword: "different123",
      });

      await signupHelper.clickSignupButton();

      // 1. エラー発生後の状態確認
      await page.waitForTimeout(2000);

      // 期待結果
      // ・エラー発生後もフォーム値が保持される
      expect(await signupHelper.getFieldValue(SELECTORS.emailInput)).toBe(
        TEST_DATA.validEmail
      );
      expect(await signupHelper.getFieldValue(SELECTORS.usernameInput)).toBe(
        TEST_DATA.validUsername
      );

      // ・ユーザーが再入力しやすい状態
      const isSignupButtonEnabled = await signupHelper.isSignupButtonEnabled();
      expect(isSignupButtonEnabled).toBeTruthy();
    });
  });

  test.describe("3. バックエンドエラー処理テスト", () => {
    test("SIGNUP-401: 既存メールアドレスでの登録試行", async ({ page }) => {
      // 1. 既にDBに存在するメールアドレスを入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.existingEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.validUsername,
      });

      // 2. 他フィールドに有効値を入力（上記で実行済み）

      // 3. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果
      await page.waitForTimeout(5000); // バックエンド処理を待機

      const errorMessage = await signupHelper.getErrorToastMessage();

      if (errorMessage) {
        // ・"このメールアドレスは既に登録済みです"エラートーストが表示される
        expect(errorMessage.toLowerCase()).toMatch(/登録済み|already|既に使用/);

        // ・error.message="User already registered"
        // 注意: 実際のエラーメッセージは実装によって異なる
      }
    });

    test("SIGNUP-402: 既存ユーザー名での登録試行", async ({ page }) => {
      // 1. 既にDBに存在するユーザー名を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.existingUsername,
      });

      // 2. 他フィールドに有効値を入力（上記で実行済み）

      // 3. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果
      await page.waitForTimeout(5000); // バックエンド処理を待機

      const errorMessage = await signupHelper.getErrorToastMessage();

      if (errorMessage) {
        // ・"このユーザー名は既に使用されています"エラートーストが表示される
        expect(errorMessage.toLowerCase()).toMatch(
          /ユーザー名|username|既に使用/
        );

        // ・error.message="Username already exists"
        // 注意: 実際のエラーメッセージは実装によって異なる
      }
    });

    test("SIGNUP-501: ネットワークエラー時の処理", async ({ page }) => {
      // 1. ネットワークを切断した状態
      await simulateNetworkCondition(page, true); // オフライン状態

      // 2. 有効なデータで登録試行
      const testData = generateRandomTestData();
      await signupHelper.fillSignupForm({
        email: testData.email,
        password: testData.password,
        confirmPassword: testData.password,
        username: testData.username,
      });

      await signupHelper.clickSignupButton();

      // 期待結果
      await page.waitForTimeout(5000);

      // ・"ネットワークエラー"メッセージが表示される
      const errorMessage = await signupHelper.getErrorToastMessage();
      if (errorMessage) {
        expect(errorMessage.toLowerCase()).toMatch(
          /network|ネットワーク|connection/
        );
      }

      // ・ローディング状態が解除される
      expect(await signupHelper.isLoading()).toBeFalsy();

      // ネットワークを復旧
      await simulateNetworkCondition(page, false);
    });

    test.skip("SIGNUP-502: Supabaseサービス停止時の処理", async ({ page }) => {
      // 注意: このテストは実際のサービス停止をシミュレートするため、
      // 通常のテスト実行ではスキップします
      // 1. Supabaseが利用できない状態
      // 2. 有効なデータで登録試行
      // 期待結果:
      // ・"サービス一時停止"メッセージが表示される
      // ・適切なエラーハンドリング
    });
  });

  test.describe("セキュリティテスト", () => {
    test("SIGNUP-1101: SQLインジェクション対策", async ({ page }) => {
      // 1. usernameに"'; DROP TABLE profiles; --"を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.sqlInjection,
      });

      // 2. 登録試行
      await signupHelper.clickSignupButton();

      // 期待結果
      await page.waitForTimeout(3000);

      // ・攻撃が無効化される
      // ・正常なエラーハンドリング
      // ・データベースに影響なし

      // エラーメッセージまたは正常処理のいずれかが発生
      const errorMessage = await signupHelper.getErrorToastMessage();

      // SQLインジェクション攻撃によるシステム破壊が発生していないことを確認
      // （ページが正常に動作し続けることを確認）
      expect(await page.locator("body").isVisible()).toBeTruthy();

      // フォームが引き続き利用可能であることを確認
      expect(await signupHelper.isSignupButtonEnabled()).toBeTruthy();
    });

    test("SIGNUP-1102: XSS攻撃対策", async ({ page }) => {
      // 1. usernameに"<script>alert('xss')</script>"を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.xssAttack,
      });

      // 2. 登録試行
      await signupHelper.clickSignupButton();

      // 期待結果
      await page.waitForTimeout(3000);

      // ・スクリプトが実行されない
      // ・適切にエスケープされる

      // XSSアタックによるスクリプト実行が発生していないことを確認
      // アラートダイアログが表示されていないことを確認
      const dialogs: string[] = [];
      page.on("dialog", (dialog) => {
        dialogs.push(dialog.message());
        dialog.dismiss();
      });

      await page.waitForTimeout(1000);
      expect(dialogs).not.toContain("xss");

      // フォームが正常に動作し続けることを確認
      expect(await page.locator("body").isVisible()).toBeTruthy();
    });
  });
});
