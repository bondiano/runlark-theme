/**
 * Контракт устанавливаемого bundle темы Runlark.
 *
 * Проверяем манифест, patch-файл, ресурсы и реальные артефакты сборки:
 * Host ESM, один Client-чанк с внешними только react/react-dom, словари
 * Plugin Manager и данные токенов.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const read = (path: string): Promise<string> => readFile(join(packageRoot, path), "utf8");
const json = async <T>(path: string): Promise<T> => JSON.parse(await read(path)) as T;

interface Manifest {
  name: string;
  version: string;
  type: string;
  icon?: string;
  engines?: Record<string, string>;
  exports: Record<string, unknown>;
  files: string[];
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  meta?: { title?: string; description?: string };
  dsh?: {
    bundle?: { patch?: string };
    client?: { platform?: string; inject?: string[]; immediately?: boolean };
  };
}

describe("release package @dev-platform/runlark-theme", () => {
  let manifest: Manifest;

  beforeAll(async () => {
    manifest = await json<Manifest>("package.json");
    const build = spawnSync("pnpm", ["run", "build"], {
      cwd: packageRoot,
      encoding: "utf8",
    });

    if (build.status !== 0) throw new Error(`build failed: ${build.stderr}`);
  }, 120_000);

  it("объявляет имя, версию и совместимость с DSH rc.3", () => {
    expect(manifest.name).toBe("@dev-platform/runlark-theme");
    expect(manifest.version).toBe("0.1.0");
    expect(manifest.type).toBe("module");
    expect(manifest.engines?.dsh).toBe("0.2.2-rc.3");
    expect(manifest.engines?.node).toBe(">=24");
    expect(manifest.dsh?.bundle?.patch).toBe("./cordis.patch.yml");
    expect(manifest.dsh?.client).toMatchObject({
      platform: "web",
      immediately: true,
    });
    expect(manifest.dsh?.client?.inject).toEqual([
      "@deepseek-ai/dsh-client-ui-theme",
      "@deepseek-ai/dsh-client-ui-settings",
      "@deepseek-ai/dsh-client-ui-renderer",
      "@deepseek-ai/dsh-client-locale",
    ]);
    expect(manifest.meta?.title).toBe("Runlark Theme");
    expect(manifest.meta?.description?.length).toBeGreaterThan(20);
  });

  it("держит схемастер и Cordis на собственных версиях", () => {
    expect(manifest.dependencies["@deepseek-ai/schemastery"]).toBe("3.19.0");
    expect(manifest.peerDependencies["@deepseek-ai/cordis"]).toBe("4.1.0");
    expect(manifest.devDependencies["@deepseek-ai/cordis"]).toBe("4.1.0");
    expect(manifest.peerDependencies.react).toBe("18.3.1");
    expect(manifest.peerDependencies["@deepseek-ai/dsh-client-ui-theme"]).toBe(
      "0.2.2-rc.3",
    );
    // Вендорная копия живёт вне pnpm-workspace апстрима: версии тулчейна
    // закреплены конкретно, чтобы пакет ставился и npm, и pnpm.
    expect(manifest.devDependencies.typescript).toBe("7.0.2");
    expect(manifest.devDependencies.vitest).toBe("3.2.7");
    expect(manifest.dependencies.xstate).toBe("5.33.4");
  });

  it("экспортирует Host, Client и ресурсы существующими файлами", async () => {
    const exports = manifest.exports as Record<
      string,
      { default?: string } | string
    >;
    const targets: string[] = [];

    for (const entry of Object.values(exports)) {
      if (typeof entry === "string") targets.push(entry.replace("./", ""));
      else if (entry.default !== undefined) {
        targets.push(entry.default.replace("./", ""));
      }
    }

    for (const target of targets.filter((target) => !target.includes("*"))) {
      expect(existsSync(join(packageRoot, target)), target).toBe(true);
    }

    expect(manifest.exports["./client"]).toBe("./lib/client.js");
    expect(manifest.icon).toBe("./icon.svg");
    expect(existsSync(join(packageRoot, "icon.svg"))).toBe(true);
    expect(existsSync(join(packageRoot, "README.md"))).toBe(true);
    expect(existsSync(join(packageRoot, "PROVENANCE.md"))).toBe(true);
    expect(existsSync(join(packageRoot, "VERIFICATION.md"))).toBe(true);
    expect(existsSync(join(packageRoot, "data/runlark-ui-tokens.json"))).toBe(true);
  });

  it("перечисляет только файлы, которые действительно есть", async () => {
    for (const entry of manifest.files) {
      if (entry.includes("*")) {
        const directory = entry.slice(0, entry.lastIndexOf("/"));
        const files = await readdir(join(packageRoot, directory));
        expect(files.length, entry).toBeGreaterThan(0);
        continue;
      }
      expect(existsSync(join(packageRoot, entry)), entry).toBe(true);
    }
  });

  it("собирает Host ESM и ровно один Client-чанк", async () => {
    const host = await read("lib/index.js");
    const client = await read("lib/client.js");
    const graph = await json<{
      externals: string[];
      modules: string[];
      dynamicImports: string[];
      chunks: string[];
    }>("lib/client.graph.json");

    expect(host).toContain("export {");
    expect(host).toContain("configure");
    expect(host).toContain("settings");
    expect(host).not.toContain("from \"react\"");

    expect(client.startsWith("window.__ModuleLoader__.load({")).toBe(true);
    expect(graph.externals).toContain("react");
    expect(
      graph.externals.every((name) => name === "react" || name === "react-dom"),
    ).toBe(true);
    expect(graph.chunks).toEqual(["client.js"]);
    expect(graph.dynamicImports).toEqual([]);
    expect(graph.modules).toContain("src/client/index.ts");
    expect(graph.modules).toContain("src/client/AppearanceThemeRow.tsx");
    expect(graph.modules).toContain("src/client/tokens.ts");
    expect(client).not.toMatch(/require\("@deepseek-ai\//);

    const chunks = (await readdir(join(packageRoot, "lib"))).filter((file) =>
      file.endsWith(".js"),
    );
    expect(chunks.sort()).toEqual(["client.js", "index.js"]);
  });

  it("монтирует отдельную запись runlark-theme", async () => {
    const patch = await read("cordis.patch.yml");

    expect(patch).toMatch(/^- insert:/m);
    expect(patch).toMatch(/^ {4}- id: runlark-theme$/m);
    expect(patch).toContain('name: "@dev-platform/runlark-theme"');
    expect(patch).not.toMatch(/^ {0,2}- id: runlark-theme$/m);
  });

  it("содержит meta обоих языков для Plugin Manager", async () => {
    const ru = await json<{ meta: { title: string; description: string } }>("locale/ru.json");
    const en = await json<{ meta: { title: string; description: string } }>("locale/en.json");

    expect(ru.meta.title).toBe("Тема Runlark");
    expect(ru.meta.description.length).toBeGreaterThan(20);
    expect(en.meta.title).toBe("Runlark Theme");
    expect(en.meta.description.length).toBeGreaterThan(20);
  });

  it("хранит только цвета Runlark", async () => {
    const data = await json<Record<string, unknown>>("data/runlark-ui-tokens.json");

    expect(Object.keys(data).sort()).toEqual(["color", "palette"]);
    expect(Object.keys(data.color as object)).toHaveLength(25);
    expect(data.palette as string[]).toHaveLength(10);
  });
});
