"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accounts = void 0;
const accounts = async (client, { entryPoint: entryPointAddress }) => {
    const response = await client.request({
        method: "pm_accounts",
        params: [entryPointAddress]
    });
    return response;
};
exports.accounts = accounts;
//# sourceMappingURL=accounts.js.map