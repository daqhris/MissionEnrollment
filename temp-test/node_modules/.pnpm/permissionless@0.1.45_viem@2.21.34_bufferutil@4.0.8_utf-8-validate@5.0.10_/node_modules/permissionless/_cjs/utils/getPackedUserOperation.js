"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackedUserOperation = exports.unpackPaymasterAndData = exports.getPaymasterAndData = exports.unpackGasLimits = exports.getGasLimits = exports.unpackAccountGasLimits = exports.getAccountGasLimits = exports.unPackInitCode = exports.getInitCode = void 0;
const viem_1 = require("viem");
function getInitCode(unpackedUserOperation) {
    return unpackedUserOperation.factory
        ? (0, viem_1.concat)([
            unpackedUserOperation.factory,
            unpackedUserOperation.factoryData || "0x"
        ])
        : "0x";
}
exports.getInitCode = getInitCode;
function unPackInitCode(initCode) {
    if (initCode === "0x") {
        return {
            factory: null,
            factoryData: null
        };
    }
    return {
        factory: (0, viem_1.getAddress)((0, viem_1.slice)(initCode, 0, 20)),
        factoryData: (0, viem_1.slice)(initCode, 20)
    };
}
exports.unPackInitCode = unPackInitCode;
function getAccountGasLimits(unpackedUserOperation) {
    return (0, viem_1.concat)([
        (0, viem_1.pad)((0, viem_1.toHex)(unpackedUserOperation.verificationGasLimit), {
            size: 16
        }),
        (0, viem_1.pad)((0, viem_1.toHex)(unpackedUserOperation.callGasLimit), { size: 16 })
    ]);
}
exports.getAccountGasLimits = getAccountGasLimits;
function unpackAccountGasLimits(accountGasLimits) {
    return {
        verificationGasLimit: BigInt((0, viem_1.slice)(accountGasLimits, 0, 16)),
        callGasLimit: BigInt((0, viem_1.slice)(accountGasLimits, 16))
    };
}
exports.unpackAccountGasLimits = unpackAccountGasLimits;
function getGasLimits(unpackedUserOperation) {
    return (0, viem_1.concat)([
        (0, viem_1.pad)((0, viem_1.toHex)(unpackedUserOperation.maxPriorityFeePerGas), {
            size: 16
        }),
        (0, viem_1.pad)((0, viem_1.toHex)(unpackedUserOperation.maxFeePerGas), { size: 16 })
    ]);
}
exports.getGasLimits = getGasLimits;
function unpackGasLimits(gasLimits) {
    return {
        maxPriorityFeePerGas: BigInt((0, viem_1.slice)(gasLimits, 0, 16)),
        maxFeePerGas: BigInt((0, viem_1.slice)(gasLimits, 16))
    };
}
exports.unpackGasLimits = unpackGasLimits;
function getPaymasterAndData(unpackedUserOperation) {
    return unpackedUserOperation.paymaster
        ? (0, viem_1.concat)([
            unpackedUserOperation.paymaster,
            (0, viem_1.pad)((0, viem_1.toHex)(unpackedUserOperation.paymasterVerificationGasLimit ||
                BigInt(0)), {
                size: 16
            }),
            (0, viem_1.pad)((0, viem_1.toHex)(unpackedUserOperation.paymasterPostOpGasLimit || BigInt(0)), {
                size: 16
            }),
            unpackedUserOperation.paymasterData || "0x"
        ])
        : "0x";
}
exports.getPaymasterAndData = getPaymasterAndData;
function unpackPaymasterAndData(paymasterAndData) {
    if (paymasterAndData === "0x") {
        return {
            paymaster: null,
            paymasterVerificationGasLimit: null,
            paymasterPostOpGasLimit: null,
            paymasterData: null
        };
    }
    return {
        paymaster: (0, viem_1.getAddress)((0, viem_1.slice)(paymasterAndData, 0, 20)),
        paymasterVerificationGasLimit: BigInt((0, viem_1.slice)(paymasterAndData, 20, 36)),
        paymasterPostOpGasLimit: BigInt((0, viem_1.slice)(paymasterAndData, 36, 52)),
        paymasterData: (0, viem_1.slice)(paymasterAndData, 52)
    };
}
exports.unpackPaymasterAndData = unpackPaymasterAndData;
const getPackedUserOperation = (userOperation) => {
    return {
        sender: userOperation.sender,
        nonce: userOperation.nonce,
        initCode: getInitCode(userOperation),
        callData: userOperation.callData,
        accountGasLimits: getAccountGasLimits(userOperation),
        preVerificationGas: userOperation.preVerificationGas,
        gasFees: getGasLimits(userOperation),
        paymasterAndData: getPaymasterAndData(userOperation),
        signature: userOperation.signature
    };
};
exports.getPackedUserOperation = getPackedUserOperation;
//# sourceMappingURL=getPackedUserOperation.js.map