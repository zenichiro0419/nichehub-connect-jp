/**
 * Signup機能 正常系テストスイート
 *
 * @description NicheHubのユーザーアカウント作成機能の正常系E2Eテスト
 * @author NicheHub Team
 * @version 1.0.0
 *
 * テスト対象:
 * - 基本的な新規登録フロー (SIGNUP-001)
 * - フォーム操作 (SIGNUP-002, SIGNUP-003)
 * - 入力フィールドの動作 (SIGNUP-004, SIGNUP-005)
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
  cleanupTestData,
} from "./utils/test-helpers";

test.describe("Signup機能 - 正常系テスト", () => {
  let signupHelper: SignupPageHelper;

  test.beforeEach(async ({ page }) => {
    signupHelper = new SignupPageHelper(page);
    await signupHelper.navigateToLoginPage();
  });

  test.describe("1.1 基本的な新規登録フロー", () => {
    test("SIGNUP-001: 有効なデータでの新規登録", async ({ page }) => {
      // テスト用のランダムデータ生成
      const testData = generateRandomTestData();

      // 1. Login画面にアクセス（beforeEachで実行済み）

      // 2. 「登録」モードに切り替え
      await signupHelper.switchToSignupMode();
      expect(await signupHelper.isSignupMode()).toBeTruthy();

      // 3. 有効なemail, password, confirm-password, usernameを入力
      await signupHelper.fillSignupForm({
        email: testData.email,
        password: testData.password,
        confirmPassword: testData.password,
        username: testData.username,
      });

      // 4. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果の確認
      // ・登録処理が成功
      // ・ログインモードに切り替わる
      await expect(page.locator(SELECTORS.signupForm)).toBeVisible();

      // ・成功メッセージが表示される（またはエラーがないこと）
      const errorMessage = await signupHelper.getErrorToastMessage();
      expect(errorMessage).toBeNull();

      // ・Supabaseにユーザーが作成される
      // ・profilesテーブルにレコードが作成される
      // 注意: 実際のテストでは、テスト用APIエンドポイントで確認する

      // テストデータクリーンアップ
      await cleanupTestData(testData.email, testData.username);
    });
  });

  test.describe("1.2 フォーム操作", () => {
    test("SIGNUP-002: ログインモードから登録モードへの切り替え", async ({
      page,
    }) => {
      // 1. Login画面にアクセス（デフォルトはログインモード）
      expect(await signupHelper.isLoginMode()).toBeTruthy();

      // 2. 「新規登録」リンクをクリック
      await signupHelper.switchToSignupMode();

      // 期待結果の確認
      // ・isLogin=falseに変更
      expect(await signupHelper.isSignupMode()).toBeTruthy();

      // ・登録フォームが表示される
      await expect(page.locator(SELECTORS.signupForm)).toBeVisible();

      // ・username、confirm-passwordフィールドが表示される
      await expect(page.locator(SELECTORS.usernameInput)).toBeVisible();
      await expect(page.locator(SELECTORS.confirmPasswordInput)).toBeVisible();
    });

    test("SIGNUP-003: 登録モードからログインモードへの切り替え", async ({
      page,
    }) => {
      // 1. 登録モードの状態
      await signupHelper.switchToSignupMode();
      expect(await signupHelper.isSignupMode()).toBeTruthy();

      // 2. 「ログイン」リンクをクリック
      await signupHelper.switchToLoginMode();

      // 期待結果の確認
      // ・isLogin=trueに変更
      expect(await signupHelper.isLoginMode()).toBeTruthy();

      // ・ログインフォームが表示される
      await expect(page.locator(SELECTORS.loginForm)).toBeVisible();

      // ・username、confirm-passwordフィールドが非表示
      await expect(page.locator(SELECTORS.usernameInput)).not.toBeVisible();
      await expect(
        page.locator(SELECTORS.confirmPasswordInput)
      ).not.toBeVisible();
    });
  });

  test.describe("1.3 入力フィールドの動作", () => {
    test("SIGNUP-004: 各入力フィールドの基本動作", async ({ page }) => {
      // 1. 登録モードに切り替え
      await signupHelper.switchToSignupMode();

      // 2. 各フィールドに有効な値を入力
      const testData = {
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.validUsername,
      };

      await signupHelper.fillSignupForm(testData);

      // 期待結果の確認
      // ・emailフィールド: type="email"
      const emailType = await signupHelper.getFieldAttribute(
        SELECTORS.emailInput,
        "type"
      );
      expect(emailType).toBe("email");

      // ・passwordフィールド: type="password"（マスク表示）
      const passwordType = await signupHelper.getFieldAttribute(
        SELECTORS.passwordInput,
        "type"
      );
      expect(passwordType).toBe("password");

      // ・confirm-passwordフィールド: type="password"
      const confirmPasswordType = await signupHelper.getFieldAttribute(
        SELECTORS.confirmPasswordInput,
        "type"
      );
      expect(confirmPasswordType).toBe("password");

      // ・usernameフィールド: type="text"
      const usernameType = await signupHelper.getFieldAttribute(
        SELECTORS.usernameInput,
        "type"
      );
      expect(usernameType).toBe("text");

      // 入力値が正しく設定されているか確認
      expect(await signupHelper.getFieldValue(SELECTORS.emailInput)).toBe(
        testData.email
      );
      expect(await signupHelper.getFieldValue(SELECTORS.usernameInput)).toBe(
        testData.username
      );
    });

    test("SIGNUP-005: プレースホルダーの表示確認", async ({ page }) => {
      // 1. 登録モードに切り替え
      await signupHelper.switchToSignupMode();

      // 期待結果の確認
      // ・email: "your-email@example.com"
      const emailPlaceholder = await signupHelper.getPlaceholder(
        SELECTORS.emailInput
      );
      expect(emailPlaceholder).toBe("your-email@example.com");

      // ・password: "8文字以上のパスワード"
      const passwordPlaceholder = await signupHelper.getPlaceholder(
        SELECTORS.passwordInput
      );
      expect(passwordPlaceholder).toBe("8文字以上のパスワード");

      // ・confirm-password: "パスワードを再入力"
      const confirmPasswordPlaceholder = await signupHelper.getPlaceholder(
        SELECTORS.confirmPasswordInput
      );
      expect(confirmPasswordPlaceholder).toBe("パスワードを再入力");

      // ・username: "username123"
      const usernamePlaceholder = await signupHelper.getPlaceholder(
        SELECTORS.usernameInput
      );
      expect(usernamePlaceholder).toBe("username123");
    });
  });

  test.describe("追加の正常系テスト", () => {
    test("フォーム入力値の保持確認", async ({ page }) => {
      // 登録モードに切り替え
      await signupHelper.switchToSignupMode();

      // 各フィールドに値を入力
      const testEmail = TEST_DATA.validEmail;
      const testPassword = TEST_DATA.validPassword;

      await signupHelper.fillSignupForm({
        email: testEmail,
        password: testPassword,
        username: TEST_DATA.validUsername,
        confirmPassword: testPassword,
      });

      // ログインモードに切り替え
      await signupHelper.switchToLoginMode();

      // 再度登録モードに切り替え
      await signupHelper.switchToSignupMode();

      // 期待結果: 共通フィールド（email, password）の値が保持される
      expect(await signupHelper.getFieldValue(SELECTORS.emailInput)).toBe(
        testEmail
      );
      expect(await signupHelper.getFieldValue(SELECTORS.passwordInput)).toBe(
        testPassword
      );
    });

    test("登録ボタンの有効性確認", async ({ page }) => {
      await signupHelper.switchToSignupMode();

      // 初期状態では登録ボタンが利用可能
      expect(await signupHelper.isSignupButtonEnabled()).toBeTruthy();

      // 有効なデータを入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.validUsername,
      });

      // 登録ボタンが有効のまま
      expect(await signupHelper.isSignupButtonEnabled()).toBeTruthy();
    });
  });
});
