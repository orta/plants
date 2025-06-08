import { defineConfig } from "vite";
export default defineConfig({
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: `import { h } from './svgJSX.ts'`,
  },
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "plants",
      fileName: (format) => `plants.${format}.js`,
    },
  },
});
