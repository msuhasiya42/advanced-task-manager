import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path"

export default defineConfig(() => {
  return {
    define: {
      'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:5000'),
    },
    server: {
      port: 4000,
    },

    build: {
      outDir: "build",
    },
    plugins: [react(), tsconfigPaths()],
    resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
   },
  };
});
