"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstimateUserOperationGasError = void 0;
const viem_1 = require("viem");
const estimateUserOperationGas_1 = require("../../errors/estimateUserOperationGas.js");
const getBundlerError_1 = require("./getBundlerError.js");
function getEstimateUserOperationGasError(error, args) {
    const cause = (() => {
        const cause = (0, getBundlerError_1.getBundlerError)(error, args);
        if (cause instanceof viem_1.UnknownNodeError)
            return error;
        return cause;
    })();
    throw new estimateUserOperationGas_1.EstimateUserOperationGasError(cause, {
        ...args
    });
}
exports.getEstimateUserOperationGasError = getEstimateUserOperationGasError;
//# sourceMappingURL=getEstimateUserOperationGasError.js.map