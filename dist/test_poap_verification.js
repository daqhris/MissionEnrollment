"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var POAP_API_KEY = process.env.POAP_API_KEY || '81BDT3A1kc2mfQE2edNqymulkmMUvXCBnlF1X5yxcuYXByNVbbU78IZ9ls2nUc15S9HMV4kdrTT1GxlGVgHMg1o5UF0b7zETZyuPJeQannunkcqYtTUUfUDcCEiiihy2';
var POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';
var POAP_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
    'function tokenURI(uint256 tokenId) view returns (string)'
];
function verifyPOAPOwnership(walletAddress, poapId) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, poapContract, balance, i, tokenId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    provider = new ethers_1.ethers.providers.JsonRpcProvider('https://rpc.gnosischain.com');
                    poapContract = new ethers_1.ethers.Contract(POAP_CONTRACT_ADDRESS, POAP_ABI, provider);
                    return [4 /*yield*/, poapContract.balanceOf(walletAddress)];
                case 1:
                    balance = _a.sent();
                    console.log("POAP balance for ".concat(walletAddress, ": ").concat(balance.toString()));
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < balance.toNumber())) return [3 /*break*/, 5];
                    return [4 /*yield*/, poapContract.tokenOfOwnerByIndex(walletAddress, i)];
                case 3:
                    tokenId = _a.sent();
                    console.log("Token ID: ".concat(tokenId.toString()));
                    if (tokenId.toString() === poapId) {
                        console.log("POAP with ID ".concat(poapId, " found for wallet ").concat(walletAddress));
                        return [2 /*return*/, true];
                    }
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("POAP with ID ".concat(poapId, " not found for wallet ").concat(walletAddress));
                    return [2 /*return*/, false];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error verifying POAP ownership:', error_1);
                    return [2 /*return*/, false];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var walletAddress, poapId, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    walletAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
                    poapId = '7169394';
                    return [4 /*yield*/, verifyPOAPOwnership(walletAddress, poapId)];
                case 1:
                    result = _a.sent();
                    console.log("POAP verification result: ".concat(result));
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);