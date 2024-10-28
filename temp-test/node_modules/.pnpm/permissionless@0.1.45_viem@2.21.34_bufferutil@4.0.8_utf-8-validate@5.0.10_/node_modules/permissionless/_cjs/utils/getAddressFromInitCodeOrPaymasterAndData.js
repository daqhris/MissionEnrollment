"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressFromInitCodeOrPaymasterAndData = void 0;
const viem_1 = require("viem");
function getAddressFromInitCodeOrPaymasterAndData(data) {
    if (!data) {
        return undefined;
    }
    if (data.length >= 42) {
        return (0, viem_1.getAddress)(data.slice(0, 42));
    }
    return undefined;
}
exports.getAddressFromInitCodeOrPaymasterAndData = getAddressFromInitCodeOrPaymasterAndData;
//# sourceMappingURL=getAddressFromInitCodeOrPaymasterAndData.js.map