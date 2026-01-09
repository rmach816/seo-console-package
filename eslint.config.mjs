// ESLint config for Next.js with TypeScript support
// Note: Disabled react-hooks plugin due to ESLint 9 compatibility issues
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "**/.next/**",
      "node_modules/**",
      "**/node_modules/**",
      "dist/**",
      "**/dist/**",
      "build/**",
      "**/build/**",
      ".turbo/**",
      "**/.turbo/**",
      "apps/demo/.next/**",
      "packages/seo-console/dist/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  }
);
