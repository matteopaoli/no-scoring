import { test, expect } from "@playwright/test";

test.describe("Login Page End-to-End Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/partner"); 
  });

  // 1. Page Load Assertions
  test("should display login form elements", async ({ page }) => {
    await expect(page.url()).toContain("/partner/login");
    await expect(page).toHaveTitle(/PayTomorrow/);
    await expect(page.getByTestId("pr-email-field")).toBeVisible();
    await expect(page.getByTestId("pr-password-field")).toBeVisible();
    await expect(page.getByTestId("pr-login-button")).toBeVisible();

    await page.getByTestId("pr-email-field").click();
    await page.getByTestId("pr-email-field").fill("primopartner@gmail.com");
    await page.getByTestId("pr-email-field").press("Tab");
    await page.getByTestId("pr-password-field").fill("Secret12!");
    await page.getByTestId("pr-login-button").click();
  });

  // 2. Form Validation Assertions
  test("should not submit the form with empty required fields", async ({ page }) => {
    let requestIntercepted = false;

    await page.route("**/partner/login", (route) => {
      requestIntercepted = true;
      route.continue();
    });

    await page.getByTestId("pr-login-button").click();

    expect(requestIntercepted).toBeFalsy();
    await expect(page.url()).toContain("/partner/login");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.getByTestId("pr-email-field").fill("primopartner@gmail.com");
    await page.getByTestId("pr-password-field").fill("wrong_password");
    await page.getByTestId("pr-login-button").click();
    await expect(page.getByText("E-mail o password errata")).toBeVisible();
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    await page.getByTestId("pr-email-field").fill("primopartner@gmail.com");
    await page.getByTestId("pr-password-field").fill("Secret12!");
    await page.getByTestId("pr-login-button").click();
    await page.waitForURL("http://localhost:3000/partner");
    await expect(page.url()).toContain("/partner");
  });

  // 3. Password Security Assertions
  test("should mask the password input", async ({ page }) => {
    await expect(await page.getByTestId("pr-password-field")).toHaveAttribute(
      "type",
      "password"
    );
  });

  // 4. UI and Accessibility Assertions
  // test('should toggle "Remember me" checkbox', async ({ page }) => {
  //   const rememberMeCheckbox = page.locator('input[name="remember"]');
  //   await expect(rememberMeCheckbox).toBeVisible();
  //   await rememberMeCheckbox.check();
  //   await expect(rememberMeCheckbox).toBeChecked();
  // });

  // test("should navigate to Forgot Password page", async ({ page }) => {
  //   const forgotPasswordLink = page.locator("a.forgot-password");
  //   await expect(forgotPasswordLink).toBeVisible();
  //   await forgotPasswordLink.click();
  //   await expect(page).toHaveURL("/forgot-password");
  // });

  // 5. Security Assertions
  // test("should show error after multiple failed login attempts", async ({
  //   page,
  // }) => {
  //   for (let i = 0; i < 5; i++) {
  //     await page.fill('input[name="username"]', "valid_user");
  //     await page.fill('input[name="password"]', "wrong_password");
  //     await page.click('button[type="submit"]');
  //   }
  //   await expect(page.locator(".error-message")).toContainText(
  //     "Too many failed login attempts"
  //   );
  // });

  // 6. Redirection Assertions
  test("should not allow navigation back to login page after successful login", async ({ page }) => {
    await page.goto("http://localhost:3000/partner/login");
    await page.getByTestId("pr-email-field").fill("primopartner@gmail.com");
    await page.getByTestId("pr-password-field").fill("Secret12!");
    await page.getByTestId("pr-login-button").click();
    await page.waitForURL("http://localhost:3000/partner");
    await page.goto("http://localhost:3000/partner/login");
    await expect(page.url()).not.toContain("/partner/login");
    await expect(page.url()).toContain("/partner");
  });
});
