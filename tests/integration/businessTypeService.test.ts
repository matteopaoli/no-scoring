import { describe, it, expect, beforeEach, vi } from "vitest";
import { BusinessTypeService } from "../../app/services/businessTypeService";

describe("getAll", () => {
  it("fetches all business types with their respective commission rules", async () => {
    const businessTypes = await BusinessTypeService.getAll();

    expect(businessTypes.length).toBeGreaterThan(0);

    const businessType1 = businessTypes.find((type) => type.id === 3);
    const businessType2 = businessTypes.find((type) => type.id === 4);

    expect(businessType1).toBeDefined();
    expect(businessType2).toBeDefined();
  });
});


describe("getAllAsComponent", () => {

  it("returns an array of React option elements with the correct data", async () => {
    const options = await BusinessTypeService.getAllAsComponent();
    expect(Array.isArray(options)).toBe(true);
    expect(options.length).toBeGreaterThan(0)
    expect(options.every(x => x.type === 'option')).toBe(true)
  });
});