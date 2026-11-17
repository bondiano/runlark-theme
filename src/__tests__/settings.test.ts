/**
 * Схема Host-настроек темы.
 *
 * Проверяем, что `selection` — именно volatile-поле с дефолтом `default`:
 * значение принимает только два варианта и не требует отдельной страницы.
 */
import { describe, expect, it } from "vitest";

import {
  Config,
  DEFAULT_SELECTION,
  SETTINGS_NAMESPACE,
  THEME_SELECTIONS,
} from "../settings.ts";

describe("runlark-theme settings schema", () => {
  it("объявляет namespace, совпадающий с id записи bundle", () => {
    expect(SETTINGS_NAMESPACE).toBe("runlark-theme");
    expect(THEME_SELECTIONS).toEqual(["default", "runlark"]);
    expect(DEFAULT_SELECTION).toBe("default");
  });

  it("по умолчанию выбирает штатную палитру", () => {
    expect(Config({}).selection.get()).toBe("default");
  });

  it("принимает Runlark и отвергает неизвестный id", () => {
    expect(Config({ selection: "runlark" }).selection.get()).toBe("runlark");
    expect(() => Config({ selection: "midnight" as never })).toThrow();
  });

  it("сериализуется в форму с volatile-полем", () => {
    const wire = JSON.parse(JSON.stringify(Config.toJSON())) as {
      refs: Record<string, {
        type?: string;
        dict?: Record<string, number>;
        meta?: Record<string, unknown>;
      }>;
    };
    const root = Object.values(wire.refs).find(
      (node) => node.dict?.selection !== undefined,
    );

    expect(root?.type).toBe("object");
    const field = wire.refs[String(root?.dict?.selection)];

    expect(field?.meta?.volatile).toBe(true);
    expect(field?.meta?.default).toBe("default");
  });
});
