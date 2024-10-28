"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPaymasterAndDataError = exports.PaymasterPostOpRevertedError = exports.PaymasterDataRejectedError = exports.PaymasterValidationRevertedError = exports.PaymasterValidityPeriodError = exports.PaymasterDepositTooLowError = exports.PaymasterNotDeployedError = void 0;
const viem_1 = require("viem");
const utils_1 = require("../utils/index.js");
class PaymasterNotDeployedError extends viem_1.BaseError {
    constructor({ cause, paymasterAndData, docsPath } = {}) {
        const paymaster = paymasterAndData
            ? (0, utils_1.getAddressFromInitCodeOrPaymasterAndData)(paymasterAndData)
            : "0x";
        super([
            `Paymaster ${paymaster} is not deployed.`,
            "",
            "Possible solutions:",
            "• Verify that the paymasterAndData field is correct, and that the first 20 bytes are the address of the paymaster contract you intend to use.",
            "• Verify that the paymaster contract is deployed on the network you are using.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "PaymasterNotDeployedError"
        });
    }
}
exports.PaymasterNotDeployedError = PaymasterNotDeployedError;
Object.defineProperty(PaymasterNotDeployedError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa30/
});
class PaymasterDepositTooLowError extends viem_1.BaseError {
    constructor({ cause, paymasterAndData, docsPath } = {}) {
        const paymaster = paymasterAndData
            ? (0, utils_1.getAddressFromInitCodeOrPaymasterAndData)(paymasterAndData)
            : "0x";
        super([
            `Paymaster ${paymaster} contract does not have enough funds deposited into the EntryPoint contract to cover the required funds for the user operation.`,
            "",
            "Possible solutions:",
            "• If you are using your own paymaster contract, deposit more funds into the EntryPoint contract through the deposit() function of the paymaster contract.",
            "• Verify that the paymasterAndData field is correct, and that the first 20 bytes are the address of the paymaster contract you intend to useVerify that the paymasterAndData field is correct, and that the first 20 bytes are the address of the paymaster contract you intend to use.",
            "• If you are using a paymaster service, reach out to them.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "PaymasterDepositTooLowError"
        });
    }
}
exports.PaymasterDepositTooLowError = PaymasterDepositTooLowError;
Object.defineProperty(PaymasterDepositTooLowError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa31/
});
class PaymasterValidityPeriodError extends viem_1.BaseError {
    constructor({ cause, paymasterAndData, docsPath }) {
        const paymaster = paymasterAndData
            ? (0, utils_1.getAddressFromInitCodeOrPaymasterAndData)(paymasterAndData)
            : "0x";
        super([
            `Paymaster ${paymaster}'s data used in the paymasterAndData field of the user operation is not valid, because it is outside of the time range it specified.`,
            "",
            "Possible reasons:",
            "• This error occurs when the block.timestamp falls after the validUntil timestamp, or before the validAfter timestamp.",
            "",
            "Possible solutions:",
            "• If you are using your own paymaster contract and using time-based signatures, verify that the validAfter and validUntil fields are set correctly and that the user operation is sent within the specified range.",
            "• If you are using your own paymaster contract and not looking to use time-based signatures, verify that the validAfter and validUntil fields are set to 0.",
            "• If you are using a service, contact your service provider for their paymaster's validity.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "PaymasterValidityPeriodError"
        });
    }
}
exports.PaymasterValidityPeriodError = PaymasterValidityPeriodError;
Object.defineProperty(PaymasterValidityPeriodError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa32/
});
class PaymasterValidationRevertedError extends viem_1.BaseError {
    constructor({ cause, paymasterAndData, docsPath }) {
        const paymaster = paymasterAndData
            ? (0, utils_1.getAddressFromInitCodeOrPaymasterAndData)(paymasterAndData)
            : "0x";
        super([
            `The validatePaymasterUserOp function of the paymaster ${paymaster} either reverted or ran out of gas.`,
            "",
            "Possible solutions:",
            "• Verify that the verificationGasLimit is high enough to cover the validatePaymasterUserOp function's gas costs.",
            "• If you are using your own paymaster contract, verify that the validatePaymasterUserOp function is implemented with the correct logic, and that the user operation is supposed to be valid.",
            "• If you are using a paymaster service, and the user operation is well formed with a high enough verificationGasLimit, reach out to them.",
            "• If you are not looking to use a paymaster to cover the gas fees, verify that the paymasterAndData field is not set.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "PaymasterValidationRevertedError"
        });
    }
}
exports.PaymasterValidationRevertedError = PaymasterValidationRevertedError;
Object.defineProperty(PaymasterValidationRevertedError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa33/
});
class PaymasterDataRejectedError extends viem_1.BaseError {
    constructor({ cause, paymasterAndData, docsPath }) {
        const paymaster = paymasterAndData
            ? (0, utils_1.getAddressFromInitCodeOrPaymasterAndData)(paymasterAndData)
            : "0x";
        super([
            `The validatePaymasterUserOp function of the paymaster ${paymaster} rejected paymasterAndData.`,
            "",
            "Possible solutions:",
            "• If you are using your own paymaster contract, verify that the user operation was correctly signed according to your implementation, and that the paymaster signature was correctly encoded in the paymasterAndData field of the user operation.",
            "• If you are using a paymaster service, make sure you do not modify any of the fields of the user operation after the paymaster signs over it (except the signature field).",
            "• If you are using a paymaster service and you have not modified any of the fields except the signature but you are still getting this error, reach out to them.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "PaymasterDataRejectedError"
        });
    }
}
exports.PaymasterDataRejectedError = PaymasterDataRejectedError;
Object.defineProperty(PaymasterDataRejectedError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa34/
});
class PaymasterPostOpRevertedError extends viem_1.BaseError {
    constructor({ cause, paymasterAndData, docsPath }) {
        const paymaster = paymasterAndData
            ? (0, utils_1.getAddressFromInitCodeOrPaymasterAndData)(paymasterAndData)
            : "0x";
        super([
            `The postOp function of the paymaster ${paymaster} reverted.`,
            "",
            "Possible solutions:",
            "• If you are using your own paymaster contract, verify that that you have correctly implemented the postOp function (if you are using one). If you do not intent to make use of the postOp function, make sure you do not set the context parameter in the paymaster's validatePaymasterUserOp function.",
            "• If you are using a paymaster service and you see this error, reach out to them.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "PaymasterPostOpRevertedError"
        });
    }
}
exports.PaymasterPostOpRevertedError = PaymasterPostOpRevertedError;
Object.defineProperty(PaymasterPostOpRevertedError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa50/
});
class InvalidPaymasterAndDataError extends viem_1.BaseError {
    constructor({ cause, docsPath }) {
        super([
            "The paymasterAndData field of the user operation is invalid.",
            "",
            "Possible solutions:",
            "• Make sure you have either not set a value for the paymasterAndData, or that it is at least 20 bytes long.",
            "• If you are using a paymaster service, reach out to them.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidPaymasterAndDataError"
        });
    }
}
exports.InvalidPaymasterAndDataError = InvalidPaymasterAndDataError;
Object.defineProperty(InvalidPaymasterAndDataError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa93/
});
//# sourceMappingURL=paymaster.js.map