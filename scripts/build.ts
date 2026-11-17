/**
 * Сборка темы: очистка `lib`, запуск tsdown и проверка контракта bundle.
 *
 * Проверка нужна до установки в профиль: Client-половина должна быть одним
 * ленивым модулем Harness с внешними только `react`/`react-dom`, а Host-
 * половина — обычным ESM без вендоринга зависимостей.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const lib = join(packageRoot, "lib");

await rm(lib, { recursive: true, force: true });

const result = spawnSync("pnpm", ["exec", "tsdown"], {
  cwd: packageRoot,
  stdio: "inherit",
});

if (result.status !== 0) {
  throw new Error(
    `tsdown failed with exit code ${String(result.status ?? "signal")}`,
  );
}

const required = ["index.js", "client.js", "client.graph.json"] as const;
const missing = required.filter((file) => !existsSync(join(lib, file)));

if (missing.length > 0) {
  throw new Error(`release build is missing artifacts: ${missing.join(", ")}`);
}

const client = await readFile(join(lib, "client.js"), "utf8");

if (!client.startsWith("window.__ModuleLoader__.load(")) {
  throw new Error("client.js is not a Harness lazy-module bundle");
}

if (client.includes('require("@deepseek-ai/')) {
  throw new Error("client.js must not require another DSH client package");
}

const graph = JSON.parse(
  await readFile(join(lib, "client.graph.json"), "utf8"),
) as {
  externals: string[];
  modules: string[];
  dynamicImports: string[];
  chunks: string[];
};

const allowedExternals = new Set(["react", "react-dom"]);

if (
  !graph.externals.includes("react") ||
  graph.externals.some((name) => !allowedExternals.has(name))
) {
  throw new Error(
    `client externals must be a subset of react/react-dom, got ${graph.externals.join(", ")}`,
  );
}

if (graph.chunks.length !== 1 || graph.chunks[0] !== "client.js") {
  throw new Error(`client chunks must be [client.js], got ${graph.chunks.join(", ")}`);
}

if (graph.dynamicImports.length !== 0) {
  throw new Error("client bundle must not use dynamic imports");
}

if (!graph.modules.includes("src/client/index.ts")) {
  throw new Error("client graph is missing src/client/index.ts");
}

console.log(
  `built @dev-platform/runlark-theme: ${required.join(", ")} (client externals: ${graph.externals.join(", ")})`,
);
