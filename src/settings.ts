/**
 * Настройки темы Runlark на Host-половине.
 *
 * Значение `selection` — volatile-поле: оно живёт в пользовательском
 * документе настроек и проецируется в браузер, но не участвует в
 * композиционном слое профиля. Автоматическая страница отключена в `apply`
 * через `settings.configure({ auto: false })`: строку в разделе «Общие»
 * рисует Client-половина, второй страницы не нужно.
 *
 * @module @dev-platform/runlark-theme/src/settings
 */

import type { Volatile } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";

/** Допустимые значения выбора темы. */
export const THEME_SELECTIONS = ["default", "runlark"] as const;

/** Выбор темы: штатная палитра DSH или слой Runlark. */
export type ThemeSelection = (typeof THEME_SELECTIONS)[number];

/** Namespace настроек; совпадает с id записи в cordis.patch.yml. */
export const SETTINGS_NAMESPACE = "runlark-theme";

/** Поле выбора темы внутри namespace. */
export const SELECTION_FIELD = "selection";

/** Значение по умолчанию — штатная палитра. */
export const DEFAULT_SELECTION: ThemeSelection = "default";

/**
 * Живая конфигурация плагина.
 *
 * `Volatile` означает предпочтение браузера, а не поле профиля: Host
 * принимает его через форму настроек и не пишет в cordis.patch.yml.
 */
export interface Config {
  /** Выбранная тема. */
  selection: Volatile<ThemeSelection>;
}

/**
 * Schemastery-схема конфигурации.
 *
 * Тип схемы выводится, а не аннотируется `z<Config>`: Cordis сам разворачивает
 * `volatile()` в `Volatile<T>` на Host-стороне, а Client-форма получает по
 * проводу уже разрешённое JSON-значение `selection`.
 */
export const Config = z.object({
  selection: z.union([...THEME_SELECTIONS]).default(DEFAULT_SELECTION).volatile(),
});

/** Значение, которое Client-форма читает по проводу из namespace. */
export interface ThemeSettings {
  /** Разрешённое JSON-значение volatile-поля. */
  selection: ThemeSelection;
}
