module.exports = {
  presets: [
    ["@babel/preset-env", {
      "targets": {
        "node": "current",
        "browsers": ["last 2 versions", "not dead"]
      }
    }],
    ["@babel/preset-react", {
      "runtime": "automatic"
    }],
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-transform-private-methods"
  ]
};
