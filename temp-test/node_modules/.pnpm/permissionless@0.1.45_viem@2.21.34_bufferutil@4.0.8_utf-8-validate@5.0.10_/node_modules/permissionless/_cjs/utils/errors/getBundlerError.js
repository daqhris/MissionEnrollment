"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBundlerError = void 0;
const viem_1 = require("viem");
const errors_1 = require("../../errors/index.js");
const account_1 = require("../../errors/account.js");
const paymaster_1 = require("../../errors/paymaster.js");
function getBundlerError(err, args) {
    const message = (err.details || "").toLowerCase();
    const executionRevertedError = err instanceof viem_1.BaseError
        ? err.walk((e) => e.code ===
            viem_1.ExecutionRevertedError.code)
        : err;
    if (executionRevertedError instanceof viem_1.BaseError) {
        return new viem_1.ExecutionRevertedError({
            cause: err,
            message: executionRevertedError.details
        });
    }
    if (args.userOperation.sender === undefined)
        return new viem_1.UnknownNodeError({ cause: err });
    if (args.userOperation.nonce === undefined)
        return new viem_1.UnknownNodeError({ cause: err });
    if (errors_1.SenderAlreadyDeployedError.message.test(message)) {
        return new errors_1.SenderAlreadyDeployedError({
            cause: err,
            sender: args.userOperation.sender,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa10"
        });
    }
    if (account_1.InitCodeRevertedError.message.test(message)) {
        return new account_1.InitCodeRevertedError({
            cause: err,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa13"
        });
    }
    if (account_1.SenderAddressMismatchError.message.test(message)) {
        return new account_1.SenderAddressMismatchError({
            cause: err,
            sender: args.userOperation.sender,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa14"
        });
    }
    if (account_1.InitCodeDidNotDeploySenderError.message.test(message)) {
        return new account_1.InitCodeDidNotDeploySenderError({
            cause: err,
            sender: args.userOperation.sender,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa15"
        });
    }
    if (account_1.SenderNotDeployedError.message.test(message)) {
        return new account_1.SenderNotDeployedError({
            cause: err,
            sender: args.userOperation.sender,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa20"
        });
    }
    if (account_1.SmartAccountInsufficientFundsError.message.test(message)) {
        return new account_1.SmartAccountInsufficientFundsError({
            cause: err,
            sender: args.userOperation.sender,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa21"
        });
    }
    if (account_1.SmartAccountSignatureValidityPeriodError.message.test(message)) {
        return new account_1.SmartAccountSignatureValidityPeriodError({
            cause: err,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa22"
        });
    }
    if (account_1.SmartAccountValidationRevertedError.message.test(message)) {
        return new account_1.SmartAccountValidationRevertedError({
            cause: err,
            sender: args.userOperation.sender,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa23"
        });
    }
    if (account_1.InvalidSmartAccountNonceError.message.test(message)) {
        return new account_1.InvalidSmartAccountNonceError({
            cause: err,
            sender: args.userOperation.sender,
            nonce: args.userOperation.nonce,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa25"
        });
    }
    if (paymaster_1.PaymasterNotDeployedError.message.test(message)) {
        return new paymaster_1.PaymasterNotDeployedError({
            cause: err,
            paymasterAndData: args.userOperation.paymasterAndData,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa30"
        });
    }
    if (paymaster_1.PaymasterDepositTooLowError.message.test(message)) {
        return new paymaster_1.PaymasterDepositTooLowError({
            cause: err,
            paymasterAndData: args.userOperation.paymasterAndData,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa31"
        });
    }
    if (paymaster_1.PaymasterValidityPeriodError.message.test(message)) {
        return new paymaster_1.PaymasterValidityPeriodError({
            cause: err,
            paymasterAndData: args.userOperation.paymasterAndData,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa32"
        });
    }
    if (paymaster_1.PaymasterValidationRevertedError.message.test(message)) {
        return new paymaster_1.PaymasterValidationRevertedError({
            cause: err,
            paymasterAndData: args.userOperation.paymasterAndData,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa33"
        });
    }
    if (paymaster_1.PaymasterDataRejectedError.message.test(message)) {
        return new paymaster_1.PaymasterDataRejectedError({
            cause: err,
            paymasterAndData: args.userOperation.paymasterAndData,
            docsPath: "https://docs.pimlico.io/bundler/reference/entrypoint-errors/aa34"
        });
    }
    return new viem_1.UnknownNodeError({ cause: err });
}
exports.getBundlerError = getBundlerError;
//# sourceMappingURL=getBundlerError.js.map