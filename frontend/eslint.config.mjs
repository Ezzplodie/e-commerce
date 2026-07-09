import { defineConfig, globalIgnores } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "pages", pattern: "src/pages/**" },
        { type: "widgets", pattern: "src/widgets/*/**", capture: ["slice"] },
        { type: "features", pattern: "src/features/*/**", capture: ["slice"] },
        { type: "entities", pattern: "src/entities/*/**", capture: ["slice"] },
        { type: "shared", pattern: "src/shared/**" },
      ],
    },
    rules: {
      // Ensure every file belongs to some FSD element.
      "boundaries/no-unknown-dependencies": "error",
      // Enforce FSD import direction + slice isolation.
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            // Layer import direction (including same-layer internal imports).
            { from: ["app"], allow: ["app", "pages", "widgets", "features", "entities", "shared"] },
            { from: ["pages"], allow: ["pages", "widgets", "features", "entities", "shared"] },
            { from: ["widgets"], allow: ["widgets", "features", "entities", "shared"] },
            { from: ["features"], allow: ["features", "entities", "shared"] },
            { from: ["entities"], allow: ["entities", "shared"] },
            { from: ["shared"], allow: ["shared"] },
          ],
        },
      ],

      // Public API only (index.ts): forbid deep imports into slices/layer internals.
      // Allowed: "@/features/foo" (or "@/features/foo/index")
      // Forbidden: "@/features/foo/ui/Button"
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/app/*/*",
            "@/pages/*/*",
            "@/widgets/*/*",
            "@/features/*/*",
            "@/entities/*/*",
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
