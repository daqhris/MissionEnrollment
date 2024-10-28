"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSmartAccountNonceError = exports.InvalidSmartAccountSignatureError = exports.SmartAccountValidationRevertedError = exports.SmartAccountSignatureValidityPeriodError = exports.SmartAccountInsufficientFundsError = exports.SenderNotDeployedError = exports.InitCodeDidNotDeploySenderError = exports.SenderAddressMismatchError = exports.InitCodeRevertedError = exports.SenderAlreadyDeployedError = void 0;
const viem_1 = require("viem");
class SenderAlreadyDeployedError extends viem_1.BaseError {
    constructor({ cause, sender, docsPath } = {}) {
        super([
            `Smart account ${sender} is already deployed.`,
            "",
            "Possible solutions:",
            `• Remove the initCode from the user operation and set it to "0x"`,
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SenderAlreadyDeployedError"
        });
    }
}
exports.SenderAlreadyDeployedError = SenderAlreadyDeployedError;
Object.defineProperty(SenderAlreadyDeployedError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa10/
});
class InitCodeRevertedError extends viem_1.BaseError {
    constructor({ cause, docsPath } = {}) {
        super([
            "EntryPoint failed to create the smart account with the initCode provided.",
            "",
            "Possible reasons:",
            "• The initCode ran out of gas",
            "• The initCode reverted during the account deployment process",
            "",
            "Possible solutions:",
            "• Verify that the factory address in the initCode is correct (the factory address is the first 20 bytes of the initCode).",
            "• Verify that the initCode is correct.",
            "• Check whether the verificationGasLimit is sufficient for the initCode to complete without running out of gas.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InitCodeRevertedError"
        });
    }
}
exports.InitCodeRevertedError = InitCodeRevertedError;
Object.defineProperty(InitCodeRevertedError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa13/
});
class SenderAddressMismatchError extends viem_1.BaseError {
    constructor({ cause, sender, docsPath }) {
        super([
            "The initCode returned a different smart account address than expected.",
            `Expected: ${sender}`,
            "",
            "Possible reasons:",
            "• Account deployed with the initCode provided does not match match the sender address provided",
            "",
            "Possible solutions:",
            "• Verify that the sender address was generated deterministically from the initCode. (consider leveraging functions like getSenderAddress)",
            "• Verify that the factory address in the initCode is correct (the factory address is the first 20 bytes of the initCode)",
            "• Verify that the initCode is correct.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SenderAddressMismatchError"
        });
    }
}
exports.SenderAddressMismatchError = SenderAddressMismatchError;
Object.defineProperty(SenderAddressMismatchError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa14/
});
class InitCodeDidNotDeploySenderError extends viem_1.BaseError {
    constructor({ cause, sender, docsPath }) {
        super([
            `The initCode did not deploy the sender at the address ${sender}.`,
            "",
            "Possible reasons:",
            "• The initCode factory is not creating an account.",
            "• The initCode factory is creating an account, but is not implemented correctly as it is not deploying at the sender address",
            "",
            "Possible solutions:",
            "• Verify that the factory address in the initCode is correct (the factory address is the first 20 bytes of the initCode).",
            "• Verify that the initCode factory is implemented correctly. The factory must deploy the smart account at the sender address.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InitCodeDidNotDeploySenderError"
        });
    }
}
exports.InitCodeDidNotDeploySenderError = InitCodeDidNotDeploySenderError;
Object.defineProperty(InitCodeDidNotDeploySenderError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa15/
});
class SenderNotDeployedError extends viem_1.BaseError {
    constructor({ cause, sender, docsPath }) {
        super([
            `Smart account ${sender} is not deployed.`,
            "",
            "Possible reasons:",
            "• An initCode was not specified, but the sender address (i.e. the smart account) is not deployed.",
            "",
            "Possible solutions:",
            "• If this is the first transaction by this account, make sure the initCode is included in the user operation.",
            "• If the smart account is already supposed to be deployed, verify that you have selected the correct sender address for the user operation.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SenderNotDeployedError"
        });
    }
}
exports.SenderNotDeployedError = SenderNotDeployedError;
Object.defineProperty(SenderNotDeployedError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa20/
});
class SmartAccountInsufficientFundsError extends viem_1.BaseError {
    constructor({ cause, sender, docsPath }) {
        super([
            `You are not using a paymaster, and the ${sender} address did not have enough native tokens to cover the gas costs associated with the user operation.`,
            "",
            "Possible solutions:",
            "• If you are not using a paymaster, verify that the sender address has enough native tokens to cover the required prefund. Consider leveraging functions like getRequiredPrefund.",
            "• If you are looking to use a paymaster to cover the gas fees, verify that the paymasterAndData field is set.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SmartAccountInsufficientFundsError"
        });
    }
}
exports.SmartAccountInsufficientFundsError = SmartAccountInsufficientFundsError;
Object.defineProperty(SmartAccountInsufficientFundsError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa21/
});
class SmartAccountSignatureValidityPeriodError extends viem_1.BaseError {
    constructor({ cause, docsPath }) {
        super([
            "The signature used in the user operation is not valid, because it is outside of the time range it specified.",
            "",
            "Possible reasons:",
            "• This error occurs when the block.timestamp falls after the validUntil timestamp, or before the validAfter timestamp.",
            "",
            "Possible solutions:",
            "• If you are looking to use time-based signatures, verify that the validAfter and validUntil fields are set correctly and that the user operation is sent within the specified range.",
            "• If you are not looking to use time-based signatures, verify that the validAfter and validUntil fields are set to 0.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SmartAccountSignatureValidityPeriodError"
        });
    }
}
exports.SmartAccountSignatureValidityPeriodError = SmartAccountSignatureValidityPeriodError;
Object.defineProperty(SmartAccountSignatureValidityPeriodError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa22/
});
class SmartAccountValidationRevertedError extends viem_1.BaseError {
    constructor({ cause, sender, docsPath }) {
        super([
            `The smart account ${sender} reverted or ran out of gas during the validation of the user operation.`,
            "",
            "Possible solutions:",
            "• Verify that the verificationGasLimit is high enough to cover the validateUserOp function's gas costs.",
            "• Make sure validateUserOp returns uint(1) for invalid signatures, and MUST NOT REVERT when the signature is invalid",
            "• If you are not using a paymaster, verify that the sender address has enough native tokens to cover the required pre fund. Consider leveraging functions like getRequiredPrefund.",
            "• Verify that the validateUserOp function is implemented with the correct logic, and that the user operation is supposed to be valid.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SmartAccountValidationRevertedError"
        });
    }
}
exports.SmartAccountValidationRevertedError = SmartAccountValidationRevertedError;
Object.defineProperty(SmartAccountValidationRevertedError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa23/
});
class InvalidSmartAccountSignatureError extends viem_1.BaseError {
    constructor({ cause, sender, docsPath }) {
        super([
            `The smart account ${sender} signature is invalid.`,
            "",
            "Possible solutions:",
            "• Verify that the user operation was correctly signed, and that the signature was correctly encoded in the signature field of the user operation.",
            "• Most smart account implementations sign over the userOpHash. Make sure that the userOpHash is correctly computed. Consider leveraging functions like getUserOperationHash.",
            "• Make sure you have selected the correct chainId and entryPointAddress when computing the userOpHash.",
            "• Make sure the smart account signature verification function is correctly implemented.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidSmartAccountSignatureError"
        });
    }
}
exports.InvalidSmartAccountSignatureError = InvalidSmartAccountSignatureError;
Object.defineProperty(InvalidSmartAccountSignatureError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa24/
});
class InvalidSmartAccountNonceError extends viem_1.BaseError {
    constructor({ cause, sender, nonce, docsPath }) {
        const nonceKey = nonce >> BigInt(64);
        const nonceSequence = nonce & 0xffffffffffffffffn;
        super([
            `The smart account ${sender} nonce is invalid.`,
            `Nonce sent: ${nonce} (key: ${nonceKey}, sequence: ${nonceSequence})`,
            "",
            "Possible solutions:",
            "• Verify that you are using the correct nonce for the user operation. The nonce should be the current nonce of the smart account for the selected key. Consider leveraging functions like getAccountNonce.",
            "• Verify that the nonce is formatted correctly.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidSmartAccountNonceError"
        });
    }
}
exports.InvalidSmartAccountNonceError = InvalidSmartAccountNonceError;
Object.defineProperty(InvalidSmartAccountNonceError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa25/
});
//# sourceMappingURL=account.js.map