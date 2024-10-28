import { BaseError } from "viem";
export class VerificationGasLimitTooLowError extends BaseError {
    constructor({ cause, verificationGasLimit, docsPath }) {
        super([
            `The smart account and paymaster verification exceeded the verificationGasLimit ${verificationGasLimit} set for the user operation.`,
            "",
            "Possible solutions:",
            "• Verify that the verificationGasLimit set for the user operation is high enough to cover the gas used during smart account and paymaster verification.",
            "• If you are using the eth_estimateUserOperationGas or pm_sponsorUserOperation method from bundler provider to set user operation gas limits and the EntryPoint throws this error during submission, reach out to them.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "VerificationGasLimitTooLowError"
        });
    }
}
Object.defineProperty(VerificationGasLimitTooLowError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa4[01]/
});
export class ActualGasCostTooHighError extends BaseError {
    constructor({ cause, docsPath }) {
        super([
            "The actual gas cost of the user operation ended up being higher than the funds paid by the smart account or the paymaster.",
            "",
            "Possible solutions:",
            "• If you encounter this error, try increasing the verificationGasLimit set for the user operation.",
            "• If you are using the eth_estimateUserOperationGas or pm_sponsorUserOperation method from bundler provider to set user operation gas limits and the EntryPoint throws this error during submission, reach out to them.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "ActualGasCostTooHighError"
        });
    }
}
Object.defineProperty(ActualGasCostTooHighError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa51/
});
export class GasValuesOverflowError extends BaseError {
    constructor({ cause, docsPath }) {
        super([
            "The gas limit values of the user operation overflowed, they must fit in uint160.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "GasValuesOverflowError"
        });
    }
}
Object.defineProperty(GasValuesOverflowError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa94/
});
export class BundlerOutOfGasError extends BaseError {
    constructor({ cause, docsPath }) {
        super([
            "The bundler tried to bundle the user operation with the gas limit set too low.",
            "",
            "Possible solutions:",
            "• If you are using your own bundler, configure it send gas limits properly.",
            "• If you are using a bundler provider, reach out to them.",
            "",
            docsPath ? `Docs: ${docsPath}` : ""
        ].join("\n"), {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "BundlerOutOfGasError"
        });
    }
}
Object.defineProperty(BundlerOutOfGasError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa95/
});
//# sourceMappingURL=gas.js.map