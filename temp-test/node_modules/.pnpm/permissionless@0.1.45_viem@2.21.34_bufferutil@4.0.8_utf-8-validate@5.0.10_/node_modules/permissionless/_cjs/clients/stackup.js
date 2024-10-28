"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStackupPaymasterClient = void 0;
const viem_1 = require("viem");
const bundler_1 = require("./decorators/bundler.js");
const stackup_1 = require("./decorators/stackup.js");
const createStackupPaymasterClient = (parameters) => {
    const { key = "public", name = "Stackup Paymaster Client" } = parameters;
    const client = (0, viem_1.createClient)({
        ...parameters,
        key,
        name,
        type: "stackupPaymasterClient"
    });
    return client
        .extend((0, bundler_1.bundlerActions)(parameters.entryPoint))
        .extend((0, stackup_1.stackupPaymasterActions)(parameters.entryPoint));
};
exports.createStackupPaymasterClient = createStackupPaymasterClient;
//# sourceMappingURL=stackup.js.map