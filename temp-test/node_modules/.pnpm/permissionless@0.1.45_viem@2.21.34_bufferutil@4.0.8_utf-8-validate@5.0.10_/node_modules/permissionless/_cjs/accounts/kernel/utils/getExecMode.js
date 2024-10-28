"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecMode = void 0;
const viem_1 = require("viem");
const getExecMode = ({ callType, execType }) => {
    return (0, viem_1.concatHex)([
        callType,
        execType,
        "0x00000000",
        "0x00000000",
        (0, viem_1.pad)("0x00000000", { size: 22 })
    ]);
};
exports.getExecMode = getExecMode;
//# sourceMappingURL=getExecMode.js.map