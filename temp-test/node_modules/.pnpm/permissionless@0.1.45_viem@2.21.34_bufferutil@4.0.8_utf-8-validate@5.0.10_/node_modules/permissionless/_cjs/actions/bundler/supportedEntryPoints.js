"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedEntryPoints = void 0;
const supportedEntryPoints = async (client) => {
    return client.request({
        method: "eth_supportedEntryPoints",
        params: []
    });
};
exports.supportedEntryPoints = supportedEntryPoints;
//# sourceMappingURL=supportedEntryPoints.js.map