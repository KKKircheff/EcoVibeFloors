import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Allow 'any' types during development - change to 'error' when ready for strict typing
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Allow unused variables and imports with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],
      
      // Allow anonymous default exports (useful for Firebase collections)
      "import/no-anonymous-default-export": "off",
      
      // Be more lenient with unused imports during development
      "no-unused-vars": "off" // Let TypeScript handle this
    },
  },
];

export default eslintConfig;
