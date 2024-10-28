"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBundlerClient = void 0;
const viem_1 = require("viem");
const bundler_1 = require("./decorators/bundler.js");
const createBundlerClient = (parameters) => {
    const { key = "public", name = "Bundler Client" } = parameters;
    const client = (0, viem_1.createClient)({
        ...parameters,
        key,
        name,
        type: "bundlerClient"
    });
    return client.extend((0, bundler_1.bundlerActions)(parameters.entryPoint));
};
exports.createBundlerClient = createBundlerClient;
//# sourceMappingURL=createBundlerClient.js.map