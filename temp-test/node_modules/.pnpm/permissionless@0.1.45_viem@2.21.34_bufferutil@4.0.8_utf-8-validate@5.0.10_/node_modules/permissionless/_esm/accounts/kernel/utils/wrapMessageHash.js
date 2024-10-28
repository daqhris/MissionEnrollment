import { concatHex, encodeAbiParameters, keccak256, stringToHex } from "viem";
import { domainSeparator } from "viem";
export const wrapMessageHash = (messageHash, { accountAddress, accountVersion, chainId }) => {
    const _domainSeparator = domainSeparator({
        domain: {
            name: "Kernel",
            version: accountVersion,
            chainId,
            verifyingContract: accountAddress
        }
    });
    const wrappedMessageHash = keccak256(encodeAbiParameters([{ type: "bytes32" }, { type: "bytes32" }], [keccak256(stringToHex("Kernel(bytes32 hash)")), messageHash]));
    const digest = keccak256(concatHex(["0x1901", _domainSeparator, wrappedMessageHash]));
    return digest;
};
//# sourceMappingURL=wrapMessageHash.js.map