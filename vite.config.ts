import { type Alias, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "node:path";
import fs from "node:fs/promises";

function parseConfigFileTextToJson(config: string): any {
  return JSON.parse(config.replace(/(\/\/.*|\/\*[^*]*\*\/)/g, ""));
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const tsconfig = parseConfigFileTextToJson(
    await fs.readFile("./tsconfig.json", { encoding: "utf-8" })
  );
  const { baseUrl, paths }: { baseUrl: string; paths: string[] } = tsconfig.compilerOptions;

  return {
    plugins: [react(), svgr()],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
    },
    // 3. to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.app/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],

    resolve: {
      alias: Object.entries(paths).map(
        ([key, dirs]) =>
          ({
            find: key.slice(0, -2),
            replacement: path.join(__dirname, baseUrl, dirs[0].slice(0, -2)),
          } satisfies Alias)
      ),
    },
  };
});
