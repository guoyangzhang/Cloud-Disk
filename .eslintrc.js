/*
* "off" 或者 0    //关闭规则
* "warn" 或者 1    //作为警告
* "error" 或者 2    //作为一个错误
*/
module.exports = {
  root: true,
  env: {
    browser: true
  },
  'extends': [
    'plugin:vue/essential',
    'standard'
    // 'eslint:recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
     // allow async-await
     'generator-star-spacing': 'off',
     // allow debugger during development
     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
     // allow paren-less arrow functions
     'arrow-parens': 0,
     'no-mixed-spaces-and-tabs': 0,
     'eol-last': 0,
     'no-irregular-whitespace': 0,
     'no-unused-vars': [0, {'vars': 'all', 'args': 'after-used'}],
     'no-multi-spaces': 0,
     'no-trailing-spaces': 0,
     'indent': [0, 2],
     'no-alert': 1,
     'no-tabs': 'off',
     'no-new': 'off',
     'comma-dangle': [2, 'only-multiline'],    // 多一行运行逗号结尾，单行不允许
     'semi':[1,'always'],    //语句分号结尾提示
      // 关闭函数括号前的空格验证
      'space-before-function-paren': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
