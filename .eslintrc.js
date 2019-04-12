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
    camelcase: 0,
    "vue/max-attributes-per-line": [2, {
      "singleline": 2,
      "multiline": {
        "max": 2,
        "allowFirstLine": false
      }
    }]
  },

  'extends': [
    'plugin:vue/strongly-recommended',
    'standard'
  ]
}
