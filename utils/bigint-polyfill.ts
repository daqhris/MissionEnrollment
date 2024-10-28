// Polyfill for BigInt serialization
if (typeof BigInt !== 'undefined') {
  // @ts-ignore - Adding custom serialization method to BigInt prototype
  BigInt.prototype.toJSON = function() {
    return this.toString();
  };
}

export {};
