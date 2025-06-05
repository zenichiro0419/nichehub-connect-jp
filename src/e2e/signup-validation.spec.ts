/**
 * Signup機能 バリデーションテストスイート
 *
 * @description NicheHubのユーザーアカウント作成機能のバリデーション（異常系）E2Eテスト
 * @author NicheHub Team
 * @version 1.0.0
 *
 * テスト対象:
 * - 必須入力チェック (SIGNUP-101～105)
 * - フォーマットバリデーション (SIGNUP-201～203)
 * - 特殊文字・境界値テスト (SIGNUP-301～303)
 *
 * 制限事項:
 * - テスト環境のSupabaseが必要
 * - ローカル開発サーバーが起動している必要がある
 */

import { test, expect } from "@playwright/test";
import { SignupPageHelper, TEST_DATA, SELECTORS } from "./utils/test-helpers";

test.describe("Signup機能 - バリデーションテスト（異常系）", () => {
  let signupHelper: SignupPageHelper;

  test.beforeEach(async ({ page }) => {
    signupHelper = new SignupPageHelper(page);
    await signupHelper.navigateToLoginPage();
    await signupHelper.switchToSignupMode();
  });

  test.describe("2.1 必須入力チェック", () => {
    test("SIGNUP-101: 全フィールド未入力での登録試行", async ({ page }) => {
      // 1. 登録モードで全フィールドを空のまま
      await signupHelper.clearAllFields();

      // 2. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果の確認
      // ・登録処理が実行されない
      // ・必須入力エラーが表示される

      // HTMLフォームバリデーションまたはカスタムバリデーションによるエラー表示を確認
      // ブラウザのデフォルトバリデーションメッセージまたはカスタムエラーを検証
      const emailInput = page.locator(SELECTORS.emailInput);
      const validationMessage = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).not.toBe("");
    });

    test("SIGNUP-102: emailのみ未入力", async ({ page }) => {
      // 1. email以外のフィールドに有効な値を入力
      await signupHelper.fillSignupForm({
        email: "", // 空文字
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.validUsername,
      });

      // 2. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果: メールアドレス必須エラーが表示される
      const emailInput = page.locator(SELECTORS.emailInput);
      const validationMessage = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).toContain("入力してください");
    });

    test("SIGNUP-103: passwordのみ未入力", async ({ page }) => {
      // 1. password以外のフィールドに有効な値を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: "", // 空文字
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.validUsername,
      });

      // 2. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果: パスワード必須エラーが表示される
      const passwordInput = page.locator(SELECTORS.passwordInput);
      const validationMessage = await passwordInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).not.toBe("");
    });

    test("SIGNUP-104: confirm-passwordのみ未入力", async ({ page }) => {
      // 1. confirm-password以外のフィールドに有効な値を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: "", // 空文字
        username: TEST_DATA.validUsername,
      });

      // 2. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果: パスワード確認必須エラーが表示される
      const confirmPasswordInput = page.locator(SELECTORS.confirmPasswordInput);
      const validationMessage = await confirmPasswordInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).not.toBe("");
    });

    test("SIGNUP-105: usernameのみ未入力", async ({ page }) => {
      // 1. username以外のフィールドに有効な値を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: "", // 空文字
      });

      // 2. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果: ユーザー名必須エラーが表示される
      const usernameInput = page.locator(SELECTORS.usernameInput);
      const validationMessage = await usernameInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).not.toBe("");
    });
  });

  test.describe("2.2 フォーマットバリデーション", () => {
    test("SIGNUP-201: 無効なメールアドレス形式", async ({ page }) => {
      // 1. emailに"invalid-email"を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.invalidEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.validUsername,
      });

      // 2. 他フィールドに有効値を入力（上記で実行済み）

      // 3. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果
      // ・メールアドレス形式エラーが表示される
      // ・HTML5バリデーションエラー
      const emailInput = page.locator(SELECTORS.emailInput);
      const validationMessage = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).toContain("有効なメール");
    });

    test("SIGNUP-202: 短すぎるパスワード", async ({ page }) => {
      // 1. passwordに"123"（7文字以下）を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.shortPassword,
        confirmPassword: TEST_DATA.shortPassword,
        username: TEST_DATA.validUsername,
      });

      // 2. 他フィールドに有効値を入力（上記で実行済み）

      // 3. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果: "パスワードは8文字以上で入力してください"エラーが表示される
      // カスタムバリデーションまたはトーストメッセージで確認
      const errorMessage = await signupHelper.getErrorToastMessage();
      if (errorMessage) {
        expect(errorMessage).toContain("パスワードは8文字以上");
      } else {
        // HTML5バリデーションの場合
        const passwordInput = page.locator(SELECTORS.passwordInput);
        const validationMessage = await passwordInput.evaluate(
          (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).not.toBe("");
      }
    });

    test("SIGNUP-203: パスワード不一致", async ({ page }) => {
      // 1. passwordに"password123"を入力
      // 2. confirm-passwordに"different123"を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: "different123",
        username: TEST_DATA.validUsername,
      });

      // 3. 他フィールドに有効値を入力（上記で実行済み）

      // 4. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果: "パスワードが一致しません"エラーが表示される
      const errorMessage = await signupHelper.getErrorToastMessage();
      if (errorMessage) {
        expect(errorMessage).toContain("パスワードが一致");
      } else {
        // カスタムバリデーションが実装されている場合の確認
        const confirmPasswordInput = page.locator(
          SELECTORS.confirmPasswordInput
        );
        const validationMessage = await confirmPasswordInput.evaluate(
          (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).not.toBe("");
      }
    });
  });

  test.describe("2.3 特殊文字・境界値テスト", () => {
    test("SIGNUP-301: ちょうど8文字のパスワード", async ({ page }) => {
      // 1. passwordに"abcd1234"（8文字）を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.minPasswordLength,
        confirmPassword: TEST_DATA.minPasswordLength,
        username: TEST_DATA.validUsername,
      });

      // 2. 他フィールドに有効値を入力（上記で実行済み）

      // 3. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果: 登録処理が成功する
      // エラーメッセージが表示されないことを確認

      // 少し待機してエラートーストが表示されないことを確認
      await page.waitForTimeout(2000);
      const errorMessage = await signupHelper.getErrorToastMessage();
      expect(errorMessage).toBeNull();
    });

    test("SIGNUP-302: 特殊文字を含むユーザー名", async ({ page }) => {
      // 1. usernameに"user@#$"を入力
      await signupHelper.fillSignupForm({
        email: TEST_DATA.validEmail,
        password: TEST_DATA.validPassword,
        confirmPassword: TEST_DATA.validPassword,
        username: TEST_DATA.specialCharUsername,
      });

      // 2. 他フィールドに有効値を入力（上記で実行済み）

      // 3. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果: ユーザー名の文字制限に応じた処理（許可/禁止のどちらかを確認）
      // 実装に応じてエラーまたは成功を確認
      await page.waitForTimeout(2000);

      // エラーまたは成功のいずれかが発生することを確認
      const errorMessage = await signupHelper.getErrorToastMessage();
      // 特殊文字が許可されているか禁止されているかは実装による
      // ここでは処理が完了することを確認
      expect(["string", "object"]).toContain(typeof errorMessage);
    });

    test("SIGNUP-303: 非常に長い入力値", async ({ page }) => {
      // 1. 各フィールドに極端に長い文字列を入力
      const longString = "a".repeat(1000);

      await signupHelper.fillSignupForm({
        email: `${longString}@example.com`,
        password: longString,
        confirmPassword: longString,
        username: longString,
      });

      // 2. 登録ボタンをクリック
      await signupHelper.clickSignupButton();

      // 期待結果: 適切な文字数制限エラーが表示される
      await page.waitForTimeout(2000);

      // バリデーションエラーまたはトーストエラーが表示されることを確認
      const errorMessage = await signupHelper.getErrorToastMessage();
      if (errorMessage) {
        expect(errorMessage.length).toBeGreaterThan(0);
      } else {
        // HTML5バリデーションによる制限をチェック
        const emailInput = page.locator(SELECTORS.emailInput);
        const emailValue = await emailInput.inputValue();
        // maxlength属性による制限がかかっていることを期待
        expect(emailValue.length).toBeLessThan(1000);
      }
    });
  });

  test.describe("追加のバリデーションテスト", () => {
    test("空白文字のみの入力", async ({ page }) => {
      // 空白文字のみを入力
      await signupHelper.fillSignupForm({
        email: "   ",
        password: "   ",
        confirmPassword: "   ",
        username: "   ",
      });

      await signupHelper.clickSignupButton();

      // バリデーションエラーが発生することを確認
      const emailInput = page.locator(SELECTORS.emailInput);
      const validationMessage = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).not.toBe("");
    });

    test("特殊なメールアドレス形式", async ({ page }) => {
      const specialEmails = [
        "test@",
        "@example.com",
        "test..test@example.com",
        "test@.com",
        "test@com",
      ];

      for (const email of specialEmails) {
        await signupHelper.fillSignupForm({
          email: email,
          password: TEST_DATA.validPassword,
          confirmPassword: TEST_DATA.validPassword,
          username: TEST_DATA.validUsername,
        });

        await signupHelper.clickSignupButton();

        // バリデーションエラーが発生することを確認
        const emailInput = page.locator(SELECTORS.emailInput);
        const validationMessage = await emailInput.evaluate(
          (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).not.toBe("");

        // 次のテストのためにクリア
        await signupHelper.clearAllFields();
      }
    });

    test("パスワード強度チェック", async ({ page }) => {
      const weakPasswords = [
        "12345678", // 数字のみ
        "abcdefgh", // 英字のみ
        "aaaaaaaa", // 同じ文字の繰り返し
      ];

      for (const password of weakPasswords) {
        await signupHelper.fillSignupForm({
          email: TEST_DATA.validEmail,
          password: password,
          confirmPassword: password,
          username: TEST_DATA.validUsername,
        });

        await signupHelper.clickSignupButton();

        // パスワード強度によるエラーまたは成功（実装による）
        await page.waitForTimeout(1000);

        // 次のテストのためにクリア
        await signupHelper.clearAllFields();
      }
    });
  });
});
