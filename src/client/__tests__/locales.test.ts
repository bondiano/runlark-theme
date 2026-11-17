/**
 * Словари строки «Тема».
 *
 * Оба языка обязаны покрывать один и тот же набор ключей: иначе в русском
 * интерфейсе появятся английские ключи или пустые подписи.
 */
import { describe, expect, it } from "vitest";

import { en, NS, ru } from "../locales.ts";

describe("runlark-theme dictionaries", () => {
  it("использует namespace, совпадающий с id строки", () => {
    expect(NS).toBe("runlark-theme");
  });

  it("покрывает одинаковые ключи в ru и en", () => {
    expect(Object.keys(ru).sort()).toEqual(Object.keys(en).sort());
  });

  it("не содержит пустых подписей", () => {
    for (const [key, value] of [...Object.entries(en), ...Object.entries(ru)]) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("называет оба варианта выбора на обоих языках", () => {
    expect(en["row.standard"]).toBe("Standard");
    expect(en["row.runlark"]).toBe("Runlark");
    expect(ru["row.standard"]).toBe("Стандартная");
    expect(ru["row.runlark"]).toBe("Runlark");
  });
});
