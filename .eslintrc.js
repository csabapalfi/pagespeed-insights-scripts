module.exports = {
    env: {
        "es6": true,
        "node": true,
        "mocha": true,
    },
    extends: [ 
        "eslint:recommended",
        "plugin:jest/recommended",
    ],
    parserOptions: {
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    rules: {},
    plugins: ["jest"],
};