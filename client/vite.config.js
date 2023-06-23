import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";

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
    plugins: [react(), jsconfigPaths()],
  };
});
