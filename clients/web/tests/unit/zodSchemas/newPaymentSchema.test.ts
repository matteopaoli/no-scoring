import { describe, it, expect } from "vitest";
import validateNewPayment from "../../../app/formSchemas/newPaymentSchema";

describe("validateNewPayment", () => {
  const createFormData = (amount: string, includeCommission?: string) => {
    const formData = new FormData();
    formData.append("amount", amount);
    if (includeCommission !== undefined) {
      formData.append("includeCommission", includeCommission);
    }
    return formData;
  };

  it("should pass with a valid amount and includeCommission checked", async () => {
    const formData = createFormData("1234,56", "true");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(true);
  });

  it("should pass with a valid amount and includeCommission unchecked", async () => {
    const formData = createFormData("2500,00", "false");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(true);
  });

  it("should pass with a valid amount and includeCommission not provided", async () => {
    const formData = createFormData("500,00");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(true);
  });

  it("should fail with an empty amount", async () => {
    const formData = createFormData("");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(false);
    expect(result.error?.format().amount?._errors).toContain(
      "L'importo è obbligatorio"
    );
  });

  it("should fail with an invalid amount format (thousands separator)", async () => {
    const formData = createFormData("1.234,56");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(false);
    expect(result.error?.format().amount?._errors).toContain(
      "L'importo deve essere un numero valido (es. 1000,00)"
    );
  });

  it("should fail if amount exceeds 5000", async () => {
    const formData = createFormData("5001,00");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(false);
    expect(result.error?.format().amount?._errors).toContain(
      "L'importo deve essere maggiore di 0 e non superare 5000"
    );
  });

  it("should pass with the maximum allowed amount (5000)", async () => {
    const formData = createFormData("5000,00");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(true);
  });

  it("should fail with a non-numeric amount input", async () => {
    const formData = createFormData("abcd");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(false);
    expect(result.error?.format().amount?._errors).toContain(
      "L'importo deve essere un numero valido (es. 1000,00)"
    );
  });

  it("should fail with a negative amount", async () => {
    const formData = createFormData("-100,00");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(false);
    expect(result.error?.format().amount?._errors).toContain(
      "L'importo deve essere maggiore di 0 e non superare 5000"
    );
  })

  it("should return a numeric amount", async () => {
    const formData = createFormData("1000,00");
    const result = await validateNewPayment(formData);
    expect(result.success).toBe(true);
    expect(result.data!.amount).toBe(1000);
  });
});
