"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainId = void 0;
const chainId = async (client) => {
    return Number(await client.request({
        method: "eth_chainId",
        params: []
    }));
};
exports.chainId = chainId;
//# sourceMappingURL=chainId.js.map