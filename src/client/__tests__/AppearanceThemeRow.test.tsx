/**
 * Строка «Тема»: состояния формы и запись через ConfigForm.
 *
 * React-рендерер без DOM: `react-test-renderer` позволяет вызвать обработчик
 * кнопки и увидеть, что выбор меняется только после подтверждения Host.
 * Пока запись висит, показывается «Сохраняем…»; отказ Host возвращает
 * последнее принятое значение и текст ошибки.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as React from "react";
import {
  act,
  create,
  type ReactTestInstance,
  type ReactTestRenderer,
} from "react-test-renderer";
import type {
  ConfigForm,
  ConfigFormSnapshot,
} from "@deepseek-ai/dsh-client-ui-settings/client";

import type { ThemeSettings } from "../../settings.ts";
import {
  AppearanceThemeRow,
  type RunlarkThemeRowProps,
} from "../AppearanceThemeRow.tsx";
import { ru } from "../locales.ts";

const t = (key: string): string => ru[key as keyof typeof ru] ?? key;

function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function snapshot(
  patch: Partial<ConfigFormSnapshot<ThemeSettings>> = {},
): ConfigFormSnapshot<ThemeSettings> {
  return {
    status: "ready",
    value: { selection: "default" },
    base: undefined,
    user: undefined,
    revision: 1,
    writable: true,
    ...patch,
  };
}

interface FakeForm {
  form: ConfigForm<ThemeSettings>;
  set: ReturnType<typeof vi.fn>;
  subscribe: ReturnType<typeof vi.fn>;
  unsubscribe: ReturnType<typeof vi.fn>;
  emit: (patch: Partial<ConfigFormSnapshot<ThemeSettings>>) => void;
  current: () => ConfigFormSnapshot<ThemeSettings>;
}

function fakeForm(initial: ConfigFormSnapshot<ThemeSettings>): FakeForm {
  let state = initial;
  const listeners = new Set<() => void>();
  const set = vi.fn<(field: string, value: unknown) => Promise<boolean>>();
  const unsubscribe = vi.fn((listener: () => void) => {
    listeners.delete(listener);
  });
  const subscribe = vi.fn((listener: () => void) => {
    listeners.add(listener);
    return () => {
      unsubscribe(listener);
    };
  });
  const form: ConfigForm<ThemeSettings> = {
    getSnapshot: () => state,
    subscribe,
    set,
    mutate: vi.fn(async () => true),
    unset: vi.fn(async () => true),
  };
  const emit = (patch: Partial<ConfigFormSnapshot<ThemeSettings>>): void => {
    state = { ...state, ...patch };
    for (const listener of [...listeners]) listener();
  };
  return {
    form,
    set,
    subscribe,
    unsubscribe,
    emit,
    current: () => state,
  };
}

function render(form: ConfigForm<ThemeSettings>): ReactTestRenderer {
  const props = { form, t } as unknown as RunlarkThemeRowProps;
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<AppearanceThemeRow {...props} />);
  });
  return renderer;
}

function allText(node: unknown): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(allText).join(" ");
  if (node !== null && typeof node === "object" && "children" in node) {
    return allText((node as { children: unknown }).children);
  }
  return "";
}

function text(renderer: ReactTestRenderer): string {
  return allText(renderer.toJSON());
}

function radio(renderer: ReactTestRenderer, label: string): ReactTestInstance {
  const buttons = renderer.root.findAll(
    (node) => node.type === "button" && allText(node.children) === label,
  );
  if (buttons.length !== 1) {
    throw new Error(`expected one ${label} button, got ${buttons.length}`);
  }
  return buttons[0]!;
}

function selected(renderer: ReactTestRenderer, label: string): boolean {
  return radio(renderer, label).props["aria-checked"] === true;
}

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
    true;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AppearanceThemeRow", () => {
  it("показывает загрузку, пока Host не прислал первое значение", () => {
    const fake = fakeForm(
      snapshot({ status: "loading", value: undefined, revision: undefined }),
    );

    const renderer = render(fake.form);

    expect(text(renderer)).toContain("Загружаем сохранённую тему…");
    expect(selected(renderer, "Стандартная")).toBe(true);
    act(() => {
      renderer.unmount();
    });
  });

  it("делает выбор недоступным, если namespace не опубликован", () => {
    const fake = fakeForm(
      snapshot({
        status: "unavailable",
        value: undefined,
        writable: false,
      }),
    );

    const renderer = render(fake.form);

    expect(text(renderer)).toContain("Настройки темы недоступны на этом Host.");
    expect(radio(renderer, "Стандартная").props.disabled).toBe(true);
    expect(radio(renderer, "Runlark").props.disabled).toBe(true);
    act(() => {
      renderer.unmount();
    });
  });

  it("во время записи показывает сохранение и не переключает выбор оптимистично", async () => {
    const fake = fakeForm(snapshot());
    const pending = deferred<boolean>();
    fake.set.mockReturnValue(pending.promise);

    const renderer = render(fake.form);

    act(() => {
      radio(renderer, "Runlark").props.onClick();
    });

    expect(fake.set).toHaveBeenCalledTimes(1);
    expect(fake.set).toHaveBeenCalledWith("selection", "runlark");
    expect(text(renderer)).toContain("Сохраняем тему…");
    expect(selected(renderer, "Стандартная")).toBe(true);
    expect(selected(renderer, "Runlark")).toBe(false);
    expect(radio(renderer, "Runlark").props.disabled).toBe(true);

    await act(async () => {
      fake.emit({ value: { selection: "runlark" }, revision: 2 });
      pending.resolve(true);
      await pending.promise;
    });

    expect(text(renderer)).not.toContain("Сохраняем тему…");
    expect(selected(renderer, "Runlark")).toBe(true);
    act(() => {
      renderer.unmount();
    });
  });

  it("при отказе Host показывает ошибку и оставляет последнее принятое значение", async () => {
    const fake = fakeForm(snapshot());
    const pending = deferred<boolean>();
    fake.set.mockReturnValue(pending.promise);

    const renderer = render(fake.form);

    act(() => {
      radio(renderer, "Runlark").props.onClick();
    });
    await act(async () => {
      pending.resolve(false);
      await pending.promise;
    });

    expect(text(renderer)).toContain("Не удалось сохранить выбор темы");
    expect(renderer.root.findAllByProps({ role: "alert" })).toHaveLength(1);
    expect(selected(renderer, "Стандартная")).toBe(true);
    expect(selected(renderer, "Runlark")).toBe(false);
    act(() => {
      renderer.unmount();
    });
  });

  it("при ошибке транспорта показывает то же сообщение и не применяет выбор", async () => {
    const fake = fakeForm(snapshot());
    const pending = deferred<boolean>();
    fake.set.mockReturnValue(pending.promise);

    const renderer = render(fake.form);

    act(() => {
      radio(renderer, "Runlark").props.onClick();
    });
    await act(async () => {
      pending.reject(new Error("transport down"));
      await pending.promise.catch(() => undefined);
    });

    expect(text(renderer)).toContain("Не удалось сохранить выбор темы");
    expect(selected(renderer, "Стандартная")).toBe(true);
    act(() => {
      renderer.unmount();
    });
  });

  it("применяет подтверждённое значение, пришедшее без клика", () => {
    const fake = fakeForm(snapshot());
    const renderer = render(fake.form);

    expect(selected(renderer, "Стандартная")).toBe(true);

    act(() => {
      fake.emit({ value: { selection: "runlark" }, revision: 2 });
    });

    expect(selected(renderer, "Runlark")).toBe(true);
    expect(fake.set).not.toHaveBeenCalled();
    act(() => {
      renderer.unmount();
    });
  });

  it("не пишет повторно уже выбранный вариант", () => {
    const fake = fakeForm(snapshot({ value: { selection: "runlark" } }));
    const renderer = render(fake.form);

    act(() => {
      radio(renderer, "Runlark").props.onClick();
    });

    expect(fake.set).not.toHaveBeenCalled();
    act(() => {
      renderer.unmount();
    });
  });

  it("снимает подписку на форму при размонтировании", () => {
    const fake = fakeForm(snapshot());
    const renderer = render(fake.form);

    expect(fake.subscribe).toHaveBeenCalledTimes(1);
    expect(fake.unsubscribe).not.toHaveBeenCalled();

    act(() => {
      renderer.unmount();
    });

    expect(fake.unsubscribe).toHaveBeenCalledTimes(1);
    expect(fake.unsubscribe).toHaveBeenCalledWith(expect.any(Function));
  });
});
