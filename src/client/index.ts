/**
 * Client-половина плагина темы Runlark.
 *
 * Регистрирует словари, строку «Тема» в `settings.general.item` и постоянную
 * подписку на форму `runlark-theme`. Слой `ctx.theme.overrideTokens`
 * создаётся только из подтверждённого Host-значения и живёт независимо от
 * того, открыты ли настройки; при выгрузке плагина эффект снимает подписку и
 * слой.
 *
 * @module @dev-platform/runlark-theme/src/client
 */

import type { Context as ClientContext } from "@deepseek-ai/cordis";
import type {} from "@deepseek-ai/dsh-client-locale/client";
import type {} from "@deepseek-ai/dsh-client-ui-renderer/client";
import type {} from "@deepseek-ai/dsh-client-ui-settings/client";
import type {} from "@deepseek-ai/dsh-client-ui-theme/client";

import type { ThemeSettings } from "../settings.ts";
import {
  AppearanceThemeRow,
  type RunlarkThemeRowInjected,
} from "./AppearanceThemeRow.tsx";
import { en, NS, ru } from "./locales.ts";
import { ThemeLayer } from "./theme-layer.ts";

/** Id записи настроек и слота; совпадает с id в cordis.patch.yml. */
export const ENTRY_ID = "runlark-theme";

/** Сервисы, необходимые до первого обращения. */
export const inject = ["theme", "slots", "locale", "configForms"];

/**
 * Подключить тему к клиенту Harness.
 *
 * @param ctx - клиентский Cordis-контекст.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(
    () => ctx.locale.register(NS, "ru", ru),
    "runlark-theme: Russian dictionary",
  );
  ctx.effect(
    () => ctx.locale.register(NS, "en", en),
    "runlark-theme: English dictionary",
  );

  const form = ctx.configForms.get<ThemeSettings>(ENTRY_ID);
  const layer = new ThemeLayer(ctx.theme);

  // Подписка живёт на fiber плагина: она не зависит от смонтированной строки
  // настроек и восстанавливает тему после загрузки формы и после reload.
  ctx.effect(() => {
    const sync = (): void => {
      const snapshot = form.getSnapshot();
      layer.apply(
        snapshot.status === "unavailable"
          ? undefined
          : snapshot.value?.selection,
      );
    };
    const unsubscribe = form.subscribe(sync);
    sync();
    return () => {
      unsubscribe();
      layer.dispose();
    };
  }, "runlark-theme: accepted theme layer");

  // Строка сразу после штатного Appearance (order 10), до размеров шрифта.
  ctx.slots.inject("settings.general.item", () =>
    ctx.slots.register(
      {
        name: "settings.general.item",
        id: ENTRY_ID,
        order: 10.5,
        locale: NS,
        inject: (): RunlarkThemeRowInjected => ({ form }),
      },
      AppearanceThemeRow,
    ));
}
