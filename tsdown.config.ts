import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsdown";

const root = fileURLToPath(new URL(".", import.meta.url));

const { name } = JSON.parse(
  readFileSync(new URL("package.json", import.meta.url), "utf8"),
) as { name: string };

/**
 * Host-сборка: ESM для Node без бандлинга зависимостей.
 *
 * Client-сборка: один CJS-чанк в формате ленивой таблицы модулей Harness.
 * React и react-dom остаются внешними; `jsx: "react"` не даёт появиться
 * `react/jsx-runtime`, которого нет в таблице модулей клиента. Автомат темы
 * (`theme.machine.ts`) живёт в клиенте, поэтому `xstate` бандлится в чанк,
 * а не тянется внешним `require` — таблица модулей его не предоставляет.
 */
export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    platform: "node",
    format: "esm",
    target: "es2022",
    tsconfig: "tsconfig.host.json",
    outDir: "lib",
    outExtensions: () => ({ js: ".js" }),
    clean: false,
    dts: false,
    deps: { neverBundle: true },
  },
  {
    entry: { client: "src/client/index.ts" },
    platform: "browser",
    format: "cjs",
    target: "es2022",
    tsconfig: "tsconfig.client.json",
    outDir: "lib",
    outExtensions: () => ({ js: ".js" }),
    clean: false,
    dts: false,
    deps: { neverBundle: ["react", "react-dom"], alwaysBundle: ["xstate"] },
    inputOptions: { platform: "browser" },
    banner: `window.__ModuleLoader__.load({id:${JSON.stringify(name)},factory(require){const exports = {}; const module = { exports };`,
    footer: "return module.exports; }});",
    outputOptions: { exports: "named", codeSplitting: false },
    plugins: [
      {
        name: "verify-runlark-client-graph",
        generateBundle(_options, bundle) {
          const externals: string[] = [];
          const modules: string[] = [];

          for (const id of this.getModuleIds()) {
            const info = this.getModuleInfo(id)!;

            if (info.code === null) {
              if (id !== "react" && id !== "react-dom") {
                throw new Error(`Unsupported Client external: ${id}`);
              }
              externals.push(id);
            } else {
              const local = relative(root, id).replaceAll("\\", "/");

              // `xstate` бандлится в чанк (см. deps.alwaysBundle), поэтому
              // его файлы лежат внутри node_modules (в т.ч. через симлинки
              // пакетного стора); остальные внешние модули запрещены выше.
              const bundledDependency = local.includes("/node_modules/xstate/");
              if (
                (!bundledDependency && !local.startsWith("src/client/")) ||
                local.includes("/__tests__/")
              ) {
                throw new Error(`Non-Client module in browser graph: ${id}`);
              }

              modules.push(local);
            }
          }

          const chunks = Object.values(bundle).filter(
            (item) => item.type === "chunk",
          );
          const dynamicImports = chunks.flatMap((chunk) => chunk.dynamicImports);

          if (chunks.length !== 1 || dynamicImports.length !== 0) {
            throw new Error("Client must be one self-contained chunk");
          }

          this.emitFile({
            type: "asset",
            fileName: "client.graph.json",
            source:
              JSON.stringify(
                {
                  externals: externals.sort(),
                  modules: modules.sort(),
                  dynamicImports,
                  chunks: chunks.map((chunk) => chunk.fileName),
                },
                null,
                2,
              ) + "\n",
          });
        },
      },
    ],
  },
]);
