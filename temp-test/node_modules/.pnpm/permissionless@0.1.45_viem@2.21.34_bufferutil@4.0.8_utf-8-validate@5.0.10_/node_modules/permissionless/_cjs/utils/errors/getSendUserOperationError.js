"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSendUserOperationError = void 0;
const viem_1 = require("viem");
const errors_1 = require("../../errors/index.js");
const getBundlerError_1 = require("./getBundlerError.js");
function getSendUserOperationError(err, args) {
    const cause = (() => {
        const cause = (0, getBundlerError_1.getBundlerError)(err, args);
        if (cause instanceof viem_1.UnknownNodeError)
            return err;
        return cause;
    })();
    throw new errors_1.SendUserOperationError(cause, {
        ...args
    });
}
exports.getSendUserOperationError = getSendUserOperationError;
//# sourceMappingURL=getSendUserOperationError.js.map