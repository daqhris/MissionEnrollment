module.exports = {
  presets: [
    ["@babel/preset-env", {
      "modules": "commonjs",
      "targets": {
        "node": "current"
      }
    }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-private-methods"
  ]
};
