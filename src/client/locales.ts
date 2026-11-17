/**
 * Словари строки «Тема» в настройках.
 *
 * Клиентский locale-сервис принимает namespace и плоские ключи; английский
 * словарь — fallback для языков, которых нет в пакете. `locale/*.json`
 * рядом с пакетом содержат только `meta` для Plugin Manager.
 *
 * @module @dev-platform/runlark-theme/src/client/locales
 */

import type {} from "@deepseek-ai/dsh-client-ui-slots";

/** Namespace строки в клиентском locale-реестре. */
export const NS = "runlark-theme";

/** Английский словарь. */
export const en = {
  "row.title": "Theme",
  "row.description":
    "Runlark colors on top of the light or dark scheme. Light, dark and system stay in Appearance.",
  "row.standard": "Standard",
  "row.runlark": "Runlark",
  "row.loading": "Loading the saved theme…",
  "row.saving": "Saving the theme…",
  "row.error": "Could not save the theme selection. Check the Host settings and try again.",
  "row.unavailable": "Theme settings are unavailable on this Host.",
  "row.palette": "Runlark ink and gold palette",
} as const;

/** Ключи словаря строки. */
export type ThemeLocaleKey = keyof typeof en;

/** Русский словарь. */
export const ru: Record<ThemeLocaleKey, string> = {
  "row.title": "Тема",
  "row.description":
    "Оформление Runlark поверх светлой или тёмной схемы. Светлая, тёмная и системная остаются в «Внешнем виде».",
  "row.standard": "Стандартная",
  "row.runlark": "Runlark",
  "row.loading": "Загружаем сохранённую тему…",
  "row.saving": "Сохраняем тему…",
  "row.error": "Не удалось сохранить выбор темы. Проверьте настройки Host и повторите.",
  "row.unavailable": "Настройки темы недоступны на этом Host.",
  "row.palette": "Палитра Runlark: чернила и золото",
};

declare module "@deepseek-ai/dsh-client-ui-slots" {
  interface LocaleNamespaceMap {
    /** Строка выбора темы Runlark. */
    "runlark-theme": ThemeLocaleKey;
  }
}
