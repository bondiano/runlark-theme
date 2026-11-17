/**
 * Host-половина плагина темы Runlark.
 *
 * Плагин не пишет профиль и не создаёт вторую страницу настроек: он только
 * объявляет схему `selection` и выключает автоматическую страницу для этой
 * записи. Строку «Тема: Стандартная / Runlark» регистрирует Client-половина
 * в слоте `settings.general.item`, поэтому переключение доступно в
 * «Настройки → Общие → Внешний вид».
 *
 * @module @dev-platform/runlark-theme
 */

import type { Context } from "@deepseek-ai/cordis";
import type {} from "@deepseek-ai/dsh-settings";

import { Config } from "./settings.ts";

export {
  Config,
  DEFAULT_SELECTION,
  SELECTION_FIELD,
  SETTINGS_NAMESPACE,
  THEME_SELECTIONS,
  type ThemeSelection,
} from "./settings.ts";

/** Имя Cordis-плагина для диагностики загрузчика. */
export const name = "runlark-theme";

/**
 * Зарегистрировать политику формы настроек.
 *
 * `auto: false` оставляет namespace доступным для Client-формы, но не даёт
 * UI сгенерировать отдельную страницу. Как в установленном DSH rc.3,
 * настройки подключаются через `ctx.inject`, а не статическим `inject`.
 *
 * @param ctx - Host-контекст плагина.
 */
export function apply(ctx: Context): void {
  ctx.inject(["settings"], (child) => {
    child.effect(
      () => child.settings.configure({ auto: false }, ctx.fiber),
      "runlark-theme: settings presentation",
    );
  });
}
