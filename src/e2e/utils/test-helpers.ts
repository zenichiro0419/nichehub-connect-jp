/**
 * Playwrightテスト用ヘルパー関数
 *
 * @description signup機能のE2Eテストで使用する共通ユーティリティ
 * @author NicheHub Team
 * @version 1.0.0
 *
 * 主な機能:
 * - テストデータ管理
 * - ページ操作のヘルパー関数
 * - セレクター定義
 * - エラーハンドリング
 *
 * 制限事項:
 * - Playwrightのページオブジェクトが必要
 * - テスト環境のSupabase設定が必要
 */

import { Page } from "@playwright/test";

/**
 * テストデータ定数
 */
export const TEST_DATA = {
  // 正常系テスト用
  validEmail: "test@example.com",
  validPassword: "password123",
  validUsername: "testuser123",

  // 異常系テスト用
  existingEmail: "existing@example.com",
  existingUsername: "existinguser",
  invalidEmail: "invalid-email",
  shortPassword: "123",
  longUsername: "a".repeat(51), // 制限がある場合

  // 境界値テスト用
  minPasswordLength: "abcd1234", // 8文字
  specialCharUsername: "user@#$",

  // セキュリティテスト用
  sqlInjection: "'; DROP TABLE profiles; --",
  xssAttack: "<script>alert('xss')</script>",
} as const;

/**
 * セレクター定数
 */
export const SELECTORS = {
  // フォーム要素
  emailInput: '[data-testid="email-input"]',
  passwordInput: '[data-testid="password-input"]',
  confirmPasswordInput: '[data-testid="confirm-password-input"]',
  usernameInput: '[data-testid="username-input"]',
  signupButton: '[data-testid="signup-button"]',

  // モード切り替え
  loginModeButton: '[data-testid="login-mode-button"]',
  signupModeButton: '[data-testid="signup-mode-button"]',

  // エラー・成功メッセージ
  errorToast: '[data-testid="error-toast"]',
  successToast: '[data-testid="success-toast"]',

  // ローディング状態
  loadingIndicator: '[data-testid="loading-indicator"]',

  // フォーム状態
  signupForm: '[data-testid="signup-form"]',
  loginForm: '[data-testid="login-form"]',
} as const;

/**
 * ページヘルパークラス
 */
export class SignupPageHelper {
  /**
   * コンストラクター
   *
   * @param page - Playwrightページオブジェクト
   */
  constructor(private page: Page) {}

  /**
   * Login/Signup画面にアクセス
   *
   * @returns Promise<void>
   */
  async navigateToLoginPage(): Promise<void> {
    await this.page.goto("/login");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 登録モードに切り替え
   *
   * @returns Promise<void>
   */
  async switchToSignupMode(): Promise<void> {
    const signupModeButton = this.page.locator(SELECTORS.signupModeButton);
    await signupModeButton.click();

    // 登録フォームが表示されるまで待機
    await this.page
      .locator(SELECTORS.usernameInput)
      .waitFor({ state: "visible" });
    await this.page
      .locator(SELECTORS.confirmPasswordInput)
      .waitFor({ state: "visible" });
  }

  /**
   * ログインモードに切り替え
   *
   * @returns Promise<void>
   */
  async switchToLoginMode(): Promise<void> {
    const loginModeButton = this.page.locator(SELECTORS.loginModeButton);
    await loginModeButton.click();

    // ログインフォームが表示されるまで待機
    await this.page
      .locator(SELECTORS.usernameInput)
      .waitFor({ state: "hidden" });
    await this.page
      .locator(SELECTORS.confirmPasswordInput)
      .waitFor({ state: "hidden" });
  }

  /**
   * フォームに入力
   *
   * @param formData - 入力データ
   * @returns Promise<void>
   */
  async fillSignupForm(formData: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    username?: string;
  }): Promise<void> {
    if (formData.email !== undefined) {
      await this.page.locator(SELECTORS.emailInput).fill(formData.email);
    }

    if (formData.password !== undefined) {
      await this.page.locator(SELECTORS.passwordInput).fill(formData.password);
    }

    if (formData.confirmPassword !== undefined) {
      await this.page
        .locator(SELECTORS.confirmPasswordInput)
        .fill(formData.confirmPassword);
    }

    if (formData.username !== undefined) {
      await this.page.locator(SELECTORS.usernameInput).fill(formData.username);
    }
  }

  /**
   * 登録ボタンをクリック
   *
   * @returns Promise<void>
   */
  async clickSignupButton(): Promise<void> {
    await this.page.locator(SELECTORS.signupButton).click();
  }

  /**
   * ローディング状態の確認
   *
   * @returns Promise<boolean>
   */
  async isLoading(): Promise<boolean> {
    const loadingIndicator = this.page.locator(SELECTORS.loadingIndicator);
    return await loadingIndicator.isVisible();
  }

  /**
   * エラートーストの確認
   *
   * @returns Promise<string | null>
   */
  async getErrorToastMessage(): Promise<string | null> {
    const errorToast = this.page.locator(SELECTORS.errorToast);
    if (await errorToast.isVisible()) {
      return await errorToast.textContent();
    }
    return null;
  }

  /**
   * 成功トーストの確認
   *
   * @returns Promise<string | null>
   */
  async getSuccessToastMessage(): Promise<string | null> {
    const successToast = this.page.locator(SELECTORS.successToast);
    if (await successToast.isVisible()) {
      return await successToast.textContent();
    }
    return null;
  }

  /**
   * フォームフィールドの属性確認
   *
   * @param fieldSelector - フィールドセレクター
   * @param attribute - 確認する属性名
   * @returns Promise<string | null>
   */
  async getFieldAttribute(
    fieldSelector: string,
    attribute: string
  ): Promise<string | null> {
    return await this.page.locator(fieldSelector).getAttribute(attribute);
  }

  /**
   * プレースホルダーテキストの確認
   *
   * @param fieldSelector - フィールドセレクター
   * @returns Promise<string | null>
   */
  async getPlaceholder(fieldSelector: string): Promise<string | null> {
    return await this.getFieldAttribute(fieldSelector, "placeholder");
  }

  /**
   * フィールドの値を取得
   *
   * @param fieldSelector - フィールドセレクター
   * @returns Promise<string>
   */
  async getFieldValue(fieldSelector: string): Promise<string> {
    return await this.page.locator(fieldSelector).inputValue();
  }

  /**
   * 全フィールドをクリア
   *
   * @returns Promise<void>
   */
  async clearAllFields(): Promise<void> {
    await this.page.locator(SELECTORS.emailInput).fill("");
    await this.page.locator(SELECTORS.passwordInput).fill("");
    await this.page.locator(SELECTORS.confirmPasswordInput).fill("");
    await this.page.locator(SELECTORS.usernameInput).fill("");
  }

  /**
   * ログインモードかどうかの判定
   *
   * @returns Promise<boolean>
   */
  async isLoginMode(): Promise<boolean> {
    const usernameField = this.page.locator(SELECTORS.usernameInput);
    const confirmPasswordField = this.page.locator(
      SELECTORS.confirmPasswordInput
    );

    const usernameVisible = await usernameField.isVisible();
    const confirmPasswordVisible = await confirmPasswordField.isVisible();

    return !usernameVisible && !confirmPasswordVisible;
  }

  /**
   * 登録モードかどうかの判定
   *
   * @returns Promise<boolean>
   */
  async isSignupMode(): Promise<boolean> {
    return !(await this.isLoginMode());
  }

  /**
   * 登録ボタンの有効性確認
   *
   * @returns Promise<boolean>
   */
  async isSignupButtonEnabled(): Promise<boolean> {
    const signupButton = this.page.locator(SELECTORS.signupButton);
    const isDisabled = await signupButton.getAttribute("disabled");
    return isDisabled === null;
  }
}

/**
 * テストデータベースのクリーンアップ
 *
 * @description テスト実行前後にテストデータを削除
 * @param testEmail - クリーンアップ対象のメールアドレス
 * @param testUsername - クリーンアップ対象のユーザー名
 * @returns Promise<void>
 */
export async function cleanupTestData(
  testEmail?: string,
  testUsername?: string
): Promise<void> {
  // 注意: 実際の実装では、SupabaseのAdmin APIまたは
  // テスト専用のクリーンアップエンドポイントを使用する
  console.log(
    `Cleanup test data for email: ${testEmail}, username: ${testUsername}`
  );

  // TODO: Supabaseテストデータベースからテストユーザーを削除する処理を実装
  // 例:
  // - auth.admin.deleteUser()
  // - profiles テーブルからレコード削除
}

/**
 * ランダムなテストデータ生成
 *
 * @returns テストデータオブジェクト
 */
export function generateRandomTestData() {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);

  return {
    email: `test-${timestamp}-${randomSuffix}@example.com`,
    username: `testuser-${timestamp}-${randomSuffix}`,
    password: `password123-${randomSuffix}`,
  };
}

/**
 * ネットワーク状態のシミュレーション
 *
 * @param page - Playwrightページオブジェクト
 * @param offline - オフライン状態にするか
 * @returns Promise<void>
 */
export async function simulateNetworkCondition(
  page: Page,
  offline: boolean = true
): Promise<void> {
  if (offline) {
    await page.context().setOffline(true);
  } else {
    await page.context().setOffline(false);
  }
}
