"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPopup = openPopup;
exports.closePopup = closePopup;
const error_1 = require("../core/error");
const POPUP_WIDTH = 420;
const POPUP_HEIGHT = 540;
// Window Management
function openPopup(url) {
    const left = (window.innerWidth - POPUP_WIDTH) / 2 + window.screenX;
    const top = (window.innerHeight - POPUP_HEIGHT) / 2 + window.screenY;
    const popup = window.open(url, 'Smart Wallet', `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${left}, top=${top}`);
    popup === null || popup === void 0 ? void 0 : popup.focus();
    if (!popup) {
        throw error_1.standardErrors.rpc.internal('Pop up window failed to open');
    }
    return popup;
}
function closePopup(popup) {
    if (popup && !popup.closed) {
        popup.close();
    }
}
/**
 * TODO: consolidate all UI related helper functions,
 * ones making window.xxx() document.yyy() calls.
 * e.g. WLMobileRelayUI, WalletLinkRelay, ...
 */
