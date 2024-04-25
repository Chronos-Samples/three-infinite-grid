import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "gh-dist",
  },
  server: {
    fs: {
      deny: [".env", ".env.*", "*.{crt,pem}", ".git"],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
