import jest from "eslint-plugin-jest";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  ignores: ["dist/*"],
}, ...compat.extends("plugin:jest/recommended", "plugin:jest/style"), {
  plugins: {
    jest,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...jest.environments.globals.globals,
    },

    parser: babelParser,
  },

  rules: {},
}];