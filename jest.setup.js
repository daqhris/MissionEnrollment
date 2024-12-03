const { TextEncoder, TextDecoder } = require("util");
require('@testing-library/jest-dom');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add BigInt polyfill for environments that don't support it
if (typeof BigInt === "undefined") {
  global.BigInt = function (value) {
    return Number(value);
  };
}

// Polyfill for BigInt.prototype.toJSON
if (BigInt.prototype.toJSON === undefined) {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: {
    isMetaMask: true,
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
});
