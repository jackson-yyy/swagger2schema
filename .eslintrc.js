module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // common
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "arrow-parens": ["error", "as-needed"],
    // note you must disable the base rule as it can report incorrect errors
    // use '@typescript-eslint/brace-style': ['error', '1tbs']
    "brace-style": "off",
    curly: ["error", "all"],
    camelcase: ["error", { properties: "never" }],
    "comma-style": ["error", "last"],
    "comma-dangle": ["error", "always-multiline"],
    "eol-last": "error",
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],

    "prefer-const": ["error", { destructuring: "all" }],

    // ts
    "@typescript-eslint/brace-style": ["error", "1tbs"],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "none",
          requireLast: false,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
      },
    ],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
};
