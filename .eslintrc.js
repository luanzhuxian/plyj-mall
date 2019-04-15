// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint'
  },

  env: {
    browser: true
  },

  // required to lint *.vue files
  plugins: [
    'vue'
  ],

  // add your custom rules here
  rules: {
    'generator-star-spacing': 'off',
    'no-debugger': 'off',
    'no-underscore-dangle': 0,
    camelcase: 0
  },
  'extends': [
    'plugin:vue/strongly-recommended',
    'standard'
  ]
}
