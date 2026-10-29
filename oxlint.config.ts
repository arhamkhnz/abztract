import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["**/.next/**", "**/next-env.d.ts", "**/dist/**", "**/out/**", "**/coverage/**"],
  plugins: ["react", "typescript", "oxc", "nextjs"],
  rules: {
    "react/rules-of-hooks": "error",
    "nextjs/no-img-element": "off",
  },
});
