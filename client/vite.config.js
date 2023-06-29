import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    define: {
      "process.env": {},
    },
    server: {
      port: 4000,
    },

    build: {
      outDir: "build",
    },
    plugins: [react(), tsconfigPaths()],
  };
});
