/**
 * Контракт слоя токенов Runlark.
 *
 * 27 ключей должны иметь обе палитры и оставаться цветами: никакой геометрии,
 * размеров, отступов и шрифтов. Точные значения сверяются с извлечёнными
 * цветами Runlark, производные перечислены отдельно.
 */
import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { RUNLARK_TOKEN_NAMES, RUNLARK_TOKENS } from "../tokens.ts";

const EXPECTED = [
  "--dsw-alias-bg-base",
  "--dsw-alias-bg-layer-1",
  "--dsw-alias-bg-layer-2",
  "--dsw-alias-bg-overlay",
  "--dsw-alias-bg-document-selection",
  "--dsw-alias-label-primary",
  "--dsw-alias-label-secondary",
  "--dsw-alias-label-primary-inverted",
  "--dsw-alias-border-l1",
  "--dsw-alias-border-l2",
  "--dsw-alias-brand-primary",
  "--dsw-alias-brand-text",
  "--dsw-alias-state-error-primary",
  "--dsw-alias-state-idle-primary",
  "--dsw-alias-state-success-primary",
  "--dsw-alias-state-warn-primary",
  "--dsw-alias-state-business-primary",
  "--dsw-specific-sidebar-fill",
  "--dsw-specific-sidebar-nav-item-active",
  "--dsw-specific-sidebar-nav-item-active-accent",
  "--dsw-alias-button-primary-fill",
  "--dsw-alias-button-primary-hover",
  "--dsw-alias-interactive-bg-hover",
  "--dsw-alias-interactive-bg-hover-solid",
  "--dsw-alias-interactive-bg-hover-accent",
  "--dsw-alias-interactive-bg-active",
  "--dsw-focus-ring-color",
].sort();

const data = JSON.parse(
  await readFile(
    new URL("../../../data/runlark-ui-tokens.json", import.meta.url),
    "utf8",
  ),
) as { color: Record<string, string>; palette: string[] };

describe("RUNLARK_TOKENS", () => {
  it("содержит ровно заявленные 27 токенов", () => {
    expect([...RUNLARK_TOKEN_NAMES].sort()).toEqual(EXPECTED);
  });

  it("даёт обе палитры для каждого токена", () => {
    for (const name of EXPECTED) {
      const pair = RUNLARK_TOKENS[name];
      expect(pair, name).toBeDefined();
      expect(pair.light, `${name} light`).toMatch(
        /^(#[0-9A-F]{6}|rgba\(\d{1,3}, \d{1,3}, \d{1,3}, [\d.]+\))$/i,
      );
      expect(pair.dark, `${name} dark`).toMatch(
        /^(#[0-9A-F]{6}|rgba\(\d{1,3}, \d{1,3}, \d{1,3}, [\d.]+\))$/i,
      );
    }
  });

  it("не подменяет геометрию, отступы и семейства шрифтов", () => {
    for (const name of RUNLARK_TOKEN_NAMES) {
      expect(name.startsWith("--dsw-")).toBe(true);
      expect(name).not.toMatch(/radius|space|font-family|font-size|line-height/i);
    }
  });

  it("использует точные цвета Runlark там, где заявлен точный источник", () => {
    expect(RUNLARK_TOKENS["--dsw-alias-bg-base"].light).toBe(data.color.ground);
    expect(RUNLARK_TOKENS["--dsw-alias-bg-layer-1"].light).toBe(data.color.paper);
    expect(RUNLARK_TOKENS["--dsw-alias-label-primary"].light).toBe(data.color.ink);
    expect(RUNLARK_TOKENS["--dsw-alias-label-secondary"].light).toBe(data.color.muted);
    expect(RUNLARK_TOKENS["--dsw-alias-border-l1"].light).toBe(data.color.rule);
    expect(RUNLARK_TOKENS["--dsw-alias-border-l2"].light).toBe(data.color.controlBorder);
    expect(RUNLARK_TOKENS["--dsw-alias-state-error-primary"].light).toBe(data.color.danger);
    expect(RUNLARK_TOKENS["--dsw-alias-state-success-primary"].light).toBe(data.color.success);
    expect(RUNLARK_TOKENS["--dsw-specific-sidebar-fill"].light).toBe(data.color.ground);
    expect(RUNLARK_TOKENS["--dsw-alias-label-primary"].dark).toBe(data.color.sidebarText);
    expect(RUNLARK_TOKENS["--dsw-alias-label-secondary"].dark).toBe(data.color.sidebarMuted);
    expect(RUNLARK_TOKENS["--dsw-alias-bg-layer-2"].dark).toBe(data.color.sidebarSurface);
    expect(RUNLARK_TOKENS["--dsw-specific-sidebar-fill"].dark).toBe(data.color.sidebar);
  });

  it("берёт золотые акценты из палитры Runlark", () => {
    expect(data.palette).toContain(data.color.accent);
    expect(data.palette).toContain("#B88A1F");
    expect(data.palette).toContain("#916C18");
    expect(data.palette).toContain("#F3D77A");
    expect(RUNLARK_TOKENS["--dsw-alias-state-business-primary"].dark).toBe(data.color.accent);
    expect(RUNLARK_TOKENS["--dsw-alias-state-warn-primary"].light).toBe("#B88A1F");
    expect(RUNLARK_TOKENS["--dsw-focus-ring-color"].light).toBe("#916C18");
    expect(RUNLARK_TOKENS["--dsw-alias-button-primary-hover"].dark).toBe("#F3D77A");
  });
});
