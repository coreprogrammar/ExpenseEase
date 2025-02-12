import js from "@eslint/js";
import globals from "globals";
import node from "eslint-plugin-node";

export default [
  { ignores: ["node_modules", "dist"] },
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: { node },
    rules: {
      ...js.configs.recommended.rules,
      ...node.configs.recommended.rules,
      "no-console": "warn",
      "no-unused-vars": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
  },
];
