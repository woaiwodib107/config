module.exports = {
    "extends": "standard",
    "parser": "babel-eslint",
    "plugins": [
        "standard",
        "promise",
    ],
    "rules": {
        "indent": ["warn", 4],
        "no-unused-vars": ["warn", { "vars": "all", "args": "after-used" }],
        "no-trailing-spaces": ["warn", {"skipBlankLines":false}]
    }
};