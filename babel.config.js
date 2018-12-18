module.exports = {
  presets: [
    '@vue/app',
    ["@babel/preset-env", {
      "useBuiltIns": "entry"
    }]
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-runtime",
    "transform-vue-jsx", 
    "transform-es2015-modules-commonjs"
  ]
}
