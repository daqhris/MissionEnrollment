import { algorithms } from "./fixtures/algorithms.js";
import { expect } from "chai";
import hre from "hardhat";

algorithms.forEach(([algo, vector]) => {
  async function fixture() {
    const algorithm = await hre.viem.deployContract(algo, []);
    return { algorithm };
  }
  describe(algo, () => {
    it("should return true for valid signatures", async () => {
      const { algorithm } = await fixture();
      await expect(algorithm.read.verify([vector[0], vector[1], vector[2]])).resolves.toBe(true);
    });
    it("should return false for invalid signatures", async () => {
      const { algorithm } = await fixture();
      const invalidVector1 = `${vector[1]}00`;
      await expect(algorithm.read.verify([vector[0], invalidVector1, vector[2]])).resolves.toBe(false);
    });
  });
});
