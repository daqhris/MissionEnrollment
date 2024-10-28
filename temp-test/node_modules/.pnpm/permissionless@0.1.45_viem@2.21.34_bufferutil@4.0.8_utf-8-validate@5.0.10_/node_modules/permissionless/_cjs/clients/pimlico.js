"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPimlicoPaymasterClient = exports.createPimlicoBundlerClient = void 0;
const viem_1 = require("viem");
const bundler_1 = require("./decorators/bundler.js");
const pimlico_1 = require("./decorators/pimlico.js");
const createPimlicoBundlerClient = (parameters) => {
    const { key = "public", name = "Pimlico Bundler Client" } = parameters;
    const client = (0, viem_1.createClient)({
        ...parameters,
        key,
        name,
        type: "pimlicoBundlerClient"
    });
    return client
        .extend((0, bundler_1.bundlerActions)(parameters.entryPoint))
        .extend((0, pimlico_1.pimlicoBundlerActions)(parameters.entryPoint));
};
exports.createPimlicoBundlerClient = createPimlicoBundlerClient;
const createPimlicoPaymasterClient = (parameters) => {
    const { key = "public", name = "Pimlico Paymaster Client" } = parameters;
    const client = (0, viem_1.createClient)({
        ...parameters,
        key,
        name,
        type: "pimlicoPaymasterClient"
    });
    return client.extend((0, pimlico_1.pimlicoPaymasterActions)(parameters.entryPoint));
};
exports.createPimlicoPaymasterClient = createPimlicoPaymasterClient;
//# sourceMappingURL=pimlico.js.map