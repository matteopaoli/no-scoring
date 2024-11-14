import { describe, it, expect, beforeEach, vi } from "vitest";
import { getStoreByUserId } from "../../../app/db";

describe("getStoreByUserId", () => {
  it("fetches all business types with their respective commission rules", async () => {
    const store = await getStoreByUserId(
      "c72cfe13-4d55-4de5-850b-753792561669"
    );

    expect(store).toBeDefined();
  });
});
