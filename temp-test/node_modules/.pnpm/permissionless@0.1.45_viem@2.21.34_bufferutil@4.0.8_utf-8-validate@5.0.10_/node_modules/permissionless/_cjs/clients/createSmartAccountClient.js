"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSmartAccountClient = void 0;
const viem_1 = require("viem");
const smartAccount_1 = require("./decorators/smartAccount.js");
function createSmartAccountClient(parameters) {
    const { key = "Account", name = "Smart Account Client", bundlerTransport } = parameters;
    const client = (0, viem_1.createClient)({
        ...parameters,
        key,
        name,
        transport: bundlerTransport,
        type: "smartAccountClient"
    });
    return client.extend((0, smartAccount_1.smartAccountActions)({
        middleware: parameters.middleware
    }));
}
exports.createSmartAccountClient = createSmartAccountClient;
//# sourceMappingURL=createSmartAccountClient.js.map