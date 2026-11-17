/**
 * Client-подключение темы: слот, подписка на форму и жизненный цикл слоя.
 *
 * Проверяется без DOM: фейковый Cordis-контекст запоминает эффекты, форму и
 * регистрации слотов. Подтверждённый `runlark` создаёт ровно один слой
 * `overrideTokens`, `default` его снимает, а очистка эффектов при
 * disable/unload/HMR снимает подписку, слой и вклад в слот.
 */
import { describe, expect, it, vi } from "vitest";
import type { Context as ClientContext } from "@deepseek-ai/cordis";
import type {
  ConfigForm,
  ConfigFormSnapshot,
} from "@deepseek-ai/dsh-client-ui-settings/client";

import type { ThemeSettings } from "../../settings.ts";
import {
  AppearanceThemeRow,
  type RunlarkThemeRowInjected,
} from "../AppearanceThemeRow.tsx";
import { ENTRY_ID, apply, inject } from "../index.ts";
import { NS, en, ru } from "../locales.ts";
import { THEME_LAYER_SOURCE } from "../theme-layer.ts";
import { RUNLARK_TOKENS } from "../tokens.ts";

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

interface Harness {
  ctx: ClientContext;
  form: ConfigForm<ThemeSettings>;
  emit: (patch: Partial<ConfigFormSnapshot<ThemeSettings>>) => void;
  unsubscribe: ReturnType<typeof vi.fn>;
  themeDispose: ReturnType<typeof vi.fn>;
  slotDispose: ReturnType<typeof vi.fn>;
  cleanups: Array<() => void>;
  overrideTokens: ReturnType<typeof vi.fn>;
  register: ReturnType<typeof vi.fn>;
  injectSlot: ReturnType<typeof vi.fn>;
}

function harness(initial: ConfigFormSnapshot<ThemeSettings> = snapshot()): Harness {
  let state = initial;
  const listeners = new Set<() => void>();
  const cleanups: Array<() => void> = [];
  const unsubscribe = vi.fn((listener: () => void) => {
    listeners.delete(listener);
  });
  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      unsubscribe(listener);
    };
  };
  const form = {
    getSnapshot: () => state,
    subscribe,
    set: vi.fn(async () => true),
    mutate: vi.fn(async () => true),
    unset: vi.fn(async () => true),
  } as ConfigForm<ThemeSettings>;

  const themeDispose = vi.fn();
  const overrideTokens = vi.fn(() => themeDispose);
  const slotDispose = vi.fn();
  const register = vi.fn(() => slotDispose);

  const ctx = {
    effect(callback: () => unknown, _label?: string) {
      const dispose = callback();
      const cleanup =
        typeof dispose === "function" ? (dispose as () => void) : () => {};
      cleanups.push(cleanup);
      return () => {
        cleanup();
      };
    },
    locale: {
      register: vi.fn(() => () => {}),
    },
    configForms: {
      get: vi.fn(() => form),
    },
    theme: {
      overrideTokens,
    },
    slots: {
      inject: vi.fn((_key: string, callback: () => () => void) => {
        const disposeRegistration = callback();
        return ctx.effect(() => disposeRegistration, "slots.inject");
      }),
      register,
    },
  };

  return {
    ctx: ctx as unknown as ClientContext,
    form,
    emit: (patch) => {
      state = { ...state, ...patch };
      for (const listener of [...listeners]) listener();
    },
    unsubscribe,
    themeDispose,
    slotDispose,
    cleanups,
    overrideTokens,
    register,
    injectSlot: ctx.slots.inject,
  };
}

describe("runlark-theme client apply", () => {
  it("объявляет сервисы и регистрирует словари и строку настроек", () => {
    expect(inject).toEqual(["theme", "slots", "locale", "configForms"]);

    const h = harness();
    apply(h.ctx);

    expect(h.ctx.locale.register).toHaveBeenCalledWith(NS, "ru", ru);
    expect(h.ctx.locale.register).toHaveBeenCalledWith(NS, "en", en);
    expect(h.ctx.configForms.get).toHaveBeenCalledWith(ENTRY_ID);
    expect(h.injectSlot).toHaveBeenCalledWith(
      "settings.general.item",
      expect.any(Function),
    );
    expect(h.register).toHaveBeenCalledTimes(1);

    const [options, component] = h.register.mock.calls[0] as [
      Record<string, unknown> & {
        inject?: () => RunlarkThemeRowInjected;
      },
      unknown,
    ];
    expect(component).toBe(AppearanceThemeRow);
    expect(options.name).toBe("settings.general.item");
    expect(options.id).toBe("runlark-theme");
    expect(options.order).toBe(10.5);
    expect(options.locale).toBe(NS);
    expect(options.inject?.()).toEqual({ form: h.form });
  });

  it("не создаёт слой до подтверждения и для штатной палитры", () => {
    const h = harness(snapshot({ status: "loading", value: undefined }));
    apply(h.ctx);

    expect(h.overrideTokens).not.toHaveBeenCalled();

    h.emit({ status: "ready", value: { selection: "default" }, revision: 2 });
    expect(h.overrideTokens).not.toHaveBeenCalled();
  });

  it("создаёт ровно один слой на подтверждённый runlark и снимает его", () => {
    const h = harness(snapshot({ status: "loading", value: undefined }));
    apply(h.ctx);

    h.emit({ status: "ready", value: { selection: "runlark" }, revision: 2 });
    h.emit({ revision: 3 });

    expect(h.overrideTokens).toHaveBeenCalledTimes(1);
    expect(h.overrideTokens).toHaveBeenCalledWith(
      THEME_LAYER_SOURCE,
      RUNLARK_TOKENS,
    );

    h.emit({ value: { selection: "default" }, revision: 4 });
    expect(h.themeDispose).toHaveBeenCalledTimes(1);

    h.emit({ value: { selection: "runlark" }, revision: 5 });
    expect(h.overrideTokens).toHaveBeenCalledTimes(2);
  });

  it("снимает слой, если namespace стал недоступен", () => {
    const h = harness(snapshot({ value: { selection: "runlark" } }));
    apply(h.ctx);

    expect(h.overrideTokens).toHaveBeenCalledTimes(1);

    h.emit({ status: "unavailable", value: undefined, writable: false });
    expect(h.themeDispose).toHaveBeenCalledTimes(1);
    expect(h.overrideTokens).toHaveBeenCalledTimes(1);
  });

  it("при выгрузке снимает подписку, слой и вклад в слот", () => {
    const h = harness(snapshot({ value: { selection: "runlark" } }));
    apply(h.ctx);

    expect(h.overrideTokens).toHaveBeenCalledTimes(1);
    expect(h.unsubscribe).not.toHaveBeenCalled();
    expect(h.slotDispose).not.toHaveBeenCalled();

    for (const cleanup of h.cleanups.splice(0)) cleanup();

    expect(h.unsubscribe).toHaveBeenCalledTimes(1);
    expect(h.themeDispose).toHaveBeenCalledTimes(1);
    expect(h.slotDispose).toHaveBeenCalledTimes(1);

    // После снятия подписки позднее подтверждение уже не поднимает слой.
    h.emit({ value: { selection: "runlark" }, revision: 9 });
    expect(h.overrideTokens).toHaveBeenCalledTimes(1);
  });
});
