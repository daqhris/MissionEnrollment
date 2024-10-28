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
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-modules-commonjs"
  ]
};
