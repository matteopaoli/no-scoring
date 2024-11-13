import { test, expect } from "@playwright/test";

test("create/delete product", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.getByTestId("mt-email-field").click();
    await page.getByTestId("mt-email-field").fill("merchant7@gmail.com");
    await page.getByTestId("mt-email-field").press("Tab");
    await page.getByTestId("mt-password-field").fill("PayTomorrow!2024");
    await page.getByTestId("mt-login-button").click();
    await page.getByRole("link", { name: "Prodotti" }).click();
    await page.getByRole("button", { name: "Crea nuovo prodotto" }).click();
    await page.getByPlaceholder("Nome del prodotto").click();
    await page.getByPlaceholder("Nome del prodotto").fill("Test suite product");
    await page.getByPlaceholder("Nome del prodotto").press("Tab");
    await page.getByPlaceholder("Prezzo").fill("123,99");
    await page.getByPlaceholder("Prezzo").press("Tab");
    await page.getByPlaceholder("Prezzo").press("Tab");
    await page.getByPlaceholder("Descrizione del prodotto").click();
    await page.getByPlaceholder("Descrizione del prodotto").fill("Descrizione");
    await page.getByRole("button", { name: "Salva Prodotto" }).click();
    await page.goto("http://localhost:3000/app/products");
    await page
      .getByRole("row", { name: "Product Image Test suite" })
      .getByRole("paragraph")
      .nth(2)
      .click();
    await page.getByTestId('copy-payment-link-button').click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Scarica QR Code" }).click();
    const download = await downloadPromise;
    const download1Promise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Scarica Etichetta" }).click();
    const download1 = await download1Promise;
    await page.getByRole("button", { name: "Elimina" }).click();
    await page.getByRole("button", { name: "Elimina" }).first().click();
  });
  