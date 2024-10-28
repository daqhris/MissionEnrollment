import { BaseError } from "viem";
export class InvalidBeneficiaryAddressError extends BaseError {
    constructor({ cause, docsPath }) {
        super([
            "The bundler did not set a beneficiary address when bundling the user operation.",
            "",
            "Possible solutions:",
            "• If you encounter this error when running self-hosted bundler, make sure you have configured the bundler correctly.",
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
            value: "InvalidBeneficiaryAddressError"
        });
    }
}
Object.defineProperty(InvalidBeneficiaryAddressError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa9[01]/
});
export class InvalidAggregatorError extends BaseError {
    constructor({ cause, docsPath }) {
        super([
            "The bundler tried to bundle the user operation with an invalid aggregator.",
            "",
            "Possible solutions:",
            "• If you are using your own bundler, configure it to use a valid aggregator.",
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
            value: "InvalidAggregatorError"
        });
    }
}
Object.defineProperty(InvalidAggregatorError, "message", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /aa96/
});
//# sourceMappingURL=bundler.js.map