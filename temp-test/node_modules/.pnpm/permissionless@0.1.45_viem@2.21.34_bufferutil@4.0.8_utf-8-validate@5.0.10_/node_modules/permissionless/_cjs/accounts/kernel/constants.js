"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATOR_MODE = exports.VALIDATOR_TYPE = exports.EXEC_TYPE = exports.CALL_TYPE = exports.ROOT_MODE_KERNEL_V2 = exports.DUMMY_ECDSA_SIGNATURE = void 0;
exports.DUMMY_ECDSA_SIGNATURE = "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
exports.ROOT_MODE_KERNEL_V2 = "0x00000000";
var CALL_TYPE;
(function (CALL_TYPE) {
    CALL_TYPE["SINGLE"] = "0x00";
    CALL_TYPE["BATCH"] = "0x01";
    CALL_TYPE["DELEGATE_CALL"] = "0xFF";
})(CALL_TYPE || (exports.CALL_TYPE = CALL_TYPE = {}));
var EXEC_TYPE;
(function (EXEC_TYPE) {
    EXEC_TYPE["DEFAULT"] = "0x00";
    EXEC_TYPE["TRY_EXEC"] = "0x01";
})(EXEC_TYPE || (exports.EXEC_TYPE = EXEC_TYPE = {}));
exports.VALIDATOR_TYPE = {
    ROOT: "0x00",
    VALIDATOR: "0x01",
    PERMISSION: "0x02"
};
var VALIDATOR_MODE;
(function (VALIDATOR_MODE) {
    VALIDATOR_MODE["DEFAULT"] = "0x00";
    VALIDATOR_MODE["ENABLE"] = "0x01";
})(VALIDATOR_MODE || (exports.VALIDATOR_MODE = VALIDATOR_MODE = {}));
//# sourceMappingURL=constants.js.map