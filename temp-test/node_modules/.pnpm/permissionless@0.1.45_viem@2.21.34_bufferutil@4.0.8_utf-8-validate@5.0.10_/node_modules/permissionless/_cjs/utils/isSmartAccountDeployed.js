"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSmartAccountDeployed = void 0;
const actions_1 = require("viem/actions");
const isSmartAccountDeployed = async (client, address) => {
    const contractCode = await (0, actions_1.getBytecode)(client, {
        address: address
    });
    if ((contractCode?.length ?? 0) > 2) {
        return true;
    }
    return false;
};
exports.isSmartAccountDeployed = isSmartAccountDeployed;
//# sourceMappingURL=isSmartAccountDeployed.js.map