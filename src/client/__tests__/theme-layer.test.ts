/**
 * Поведение слоя темы без React и DOM: автомат `theme.machine.ts` авторитарен.
 *
 * Каждый переход модели, эффекты слоя (ровно один `overrideTokens`, снятие при
 * уходе из runlark), идемпотентность повторного выбора и dispose и запрет
 * событий после dispose.
 */
import { describe, expect, it, vi } from "vitest";

import { THEME_LAYER_SOURCE, ThemeLayer } from "../theme-layer.ts";
import { themeLayerNext } from "../theme.machine.ts";
import { RUNLARK_TOKENS } from "../tokens.ts";

function fakeTheme() {
  let layers = 0;
  const dispose = vi.fn(() => {
    layers -= 1;
  });
  const overrideTokens = vi.fn(() => {
    layers += 1;
    return dispose;
  });
  return { theme: { overrideTokens }, overrideTokens, dispose, layers: () => layers };
}

describe("themeLayerMachine", () => {
  it("воспроизводит все переходы документированной модели", () => {
    expect(themeLayerNext("unloaded", "SELECT_RUNLARK")).toBe("runlark");
    expect(themeLayerNext("unloaded", "SELECT_DEFAULT")).toBe("default");
    expect(themeLayerNext("default", "SELECT_RUNLARK")).toBe("runlark");
    expect(themeLayerNext("default", "SELECT_DEFAULT")).toBe("default");
    expect(themeLayerNext("default", "DISPOSE")).toBe("disposed");
    expect(themeLayerNext("runlark", "SELECT_DEFAULT")).toBe("default");
    expect(themeLayerNext("runlark", "SELECT_RUNLARK")).toBe("runlark");
    expect(themeLayerNext("runlark", "DISPOSE")).toBe("disposed");
  });

  it("отклоняет переходы, которых нет в модели", () => {
    expect(() => themeLayerNext("unloaded", "DISPOSE")).toThrow(
      "illegal transition: unloaded --DISPOSE-->",
    );
    expect(() => themeLayerNext("disposed", "SELECT_RUNLARK")).toThrow(
      "illegal transition: disposed --SELECT_RUNLARK-->",
    );
    expect(() => themeLayerNext("disposed", "SELECT_DEFAULT")).toThrow(
      "illegal transition: disposed --SELECT_DEFAULT-->",
    );
    expect(() => themeLayerNext("disposed", "DISPOSE")).toThrow(
      "illegal transition: disposed --DISPOSE-->",
    );
  });
});

describe("ThemeLayer", () => {
  it("не создаёт слой для default и недоступной формы", () => {
    const fake = fakeTheme();
    const layer = new ThemeLayer(fake.theme);

    layer.apply(undefined);
    expect(layer.selection).toBe("default");

    layer.apply("default");
    expect(fake.overrideTokens).not.toHaveBeenCalled();
    expect(layer.selection).toBe("default");
  });

  it("создаёт один слой с полным набором токенов для runlark", () => {
    const fake = fakeTheme();
    const layer = new ThemeLayer(fake.theme);

    layer.apply("runlark");

    expect(fake.overrideTokens).toHaveBeenCalledTimes(1);
    expect(fake.overrideTokens).toHaveBeenCalledWith(
      THEME_LAYER_SOURCE,
      RUNLARK_TOKENS,
    );
    expect(fake.layers()).toBe(1);
    expect(layer.selection).toBe("runlark");
  });

  it("повторный тот же выбор не переустанавливает слой", () => {
    const fake = fakeTheme();
    const layer = new ThemeLayer(fake.theme);

    layer.apply("runlark");
    layer.apply("runlark");
    expect(fake.overrideTokens).toHaveBeenCalledTimes(1);
    expect(fake.dispose).not.toHaveBeenCalled();
    expect(fake.layers()).toBe(1);

    layer.apply("default");
    layer.apply("default");
    expect(fake.overrideTokens).toHaveBeenCalledTimes(1);
    expect(fake.dispose).toHaveBeenCalledTimes(1);
    expect(fake.layers()).toBe(0);
  });

  it("снимает слой при возврате к default и пропавшем значении", () => {
    const fake = fakeTheme();
    const layer = new ThemeLayer(fake.theme);

    layer.apply("runlark");
    layer.apply("default");
    expect(fake.dispose).toHaveBeenCalledTimes(1);
    expect(fake.layers()).toBe(0);
    expect(layer.selection).toBe("default");

    layer.apply("runlark");
    layer.apply(undefined);
    expect(fake.dispose).toHaveBeenCalledTimes(2);
    expect(fake.layers()).toBe(0);
    expect(layer.selection).toBe("default");
  });

  it("снимает слой и завершает автомат при dispose; dispose идемпотентен", () => {
    const fake = fakeTheme();
    const layer = new ThemeLayer(fake.theme);

    layer.apply("runlark");
    layer.dispose();
    expect(fake.dispose).toHaveBeenCalledTimes(1);
    expect(fake.layers()).toBe(0);
    expect(layer.selection).toBeUndefined();

    layer.dispose();
    expect(fake.dispose).toHaveBeenCalledTimes(1);
    expect(fake.overrideTokens).toHaveBeenCalledTimes(1);
  });

  it("dispose из default не трогает несуществующий слой", () => {
    const fake = fakeTheme();
    const layer = new ThemeLayer(fake.theme);

    layer.apply("default");
    layer.dispose();
    expect(fake.overrideTokens).not.toHaveBeenCalled();
    expect(fake.dispose).not.toHaveBeenCalled();
    expect(layer.selection).toBeUndefined();
  });

  it("запрещает выбор после dispose (терминальное состояние)", () => {
    const fake = fakeTheme();
    const layer = new ThemeLayer(fake.theme);

    layer.apply("runlark");
    layer.dispose();

    expect(() => layer.apply("runlark")).toThrow(
      "illegal transition: disposed --SELECT_RUNLARK-->",
    );
    expect(() => layer.apply("default")).toThrow(
      "illegal transition: disposed --SELECT_DEFAULT-->",
    );
    expect(fake.overrideTokens).toHaveBeenCalledTimes(1);
  });

  it("проходит полный жизненный цикл: unloaded → runlark → default → disposed", () => {
    const fake = fakeTheme();
    const layer = new ThemeLayer(fake.theme);

    expect(layer.selection).toBeUndefined();
    layer.apply("runlark");
    expect(fake.layers()).toBe(1);
    layer.apply("default");
    expect(fake.layers()).toBe(0);
    layer.apply("runlark");
    expect(fake.layers()).toBe(1);
    layer.dispose();
    expect(fake.layers()).toBe(0);
    expect(fake.overrideTokens).toHaveBeenCalledTimes(2);
    expect(fake.dispose).toHaveBeenCalledTimes(2);
  });
});
