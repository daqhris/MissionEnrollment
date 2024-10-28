"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegExpString = exports.BigIntString = exports.AddressString = exports.HexString = void 0;
exports.OpaqueType = OpaqueType;
exports.IntNumber = IntNumber;
function OpaqueType() {
    return (value) => value;
}
exports.HexString = OpaqueType();
exports.AddressString = OpaqueType();
exports.BigIntString = OpaqueType();
function IntNumber(num) {
    return Math.floor(num);
}
exports.RegExpString = OpaqueType();
