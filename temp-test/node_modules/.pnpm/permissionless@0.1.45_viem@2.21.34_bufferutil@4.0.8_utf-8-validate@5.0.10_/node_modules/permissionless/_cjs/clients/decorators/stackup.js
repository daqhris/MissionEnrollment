"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stackupPaymasterActions = void 0;
const accounts_1 = require("../../actions/stackup/accounts.js");
const sponsorUserOperation_1 = require("../../actions/stackup/sponsorUserOperation.js");
const stackupPaymasterActions = (entryPointAddress) => (client) => ({
    sponsorUserOperation: async (args) => (0, sponsorUserOperation_1.sponsorUserOperation)(client, {
        ...args,
        entryPoint: entryPointAddress
    }),
    accounts: async (args) => (0, accounts_1.accounts)(client, args)
});
exports.stackupPaymasterActions = stackupPaymasterActions;
//# sourceMappingURL=stackup.js.map