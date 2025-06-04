import { verifyETHGlobalBrusselsPOAPOwnership } from "./poapVerification.ts";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import axios from "axios";

jest.mock("axios");

describe("POAP Verification", () => {
  const mockAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.POAP = "mock-api-key";
  });

  // Removed unused verifyPOAPOwnership test suite

  describe("verifyETHGlobalBrusselsPOAPOwnership", () => {
    it("should return { owned: true, imageUrl: string } if user owns any ETHGlobal Brussels 2024 POAP", async () => {
      axios.get.mockResolvedValueOnce({ data: [] }).mockResolvedValueOnce({ data: [{ some: "data" }] });
      const result = await verifyETHGlobalBrusselsPOAPOwnership(mockAddress);
      expect(result).toEqual({
        owned: true,
        imageUrl: expect.stringContaining("https://assets.poap.xyz/")
      });
    });

    it("should return { owned: false, imageUrl: null } if user does not own any ETHGlobal Brussels 2024 POAP", async () => {
      axios.get.mockResolvedValue({ data: [] });
      const result = await verifyETHGlobalBrusselsPOAPOwnership(mockAddress);
      expect(result).toEqual({
        owned: false,
        imageUrl: null
      });
    });
  });
});
