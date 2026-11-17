import z from "@deepseek-ai/schemastery";
// src/settings.ts
/** Допустимые значения выбора темы. */
const THEME_SELECTIONS = ["default", "runlark"];
/** Namespace настроек; совпадает с id записи в cordis.patch.yml. */
const SETTINGS_NAMESPACE = "runlark-theme";
/** Поле выбора темы внутри namespace. */
const SELECTION_FIELD = "selection";
/** Значение по умолчанию — штатная палитра. */
const DEFAULT_SELECTION = "default";
/**
* Schemastery-схема конфигурации.
*
* Тип схемы выводится, а не аннотируется `z<Config>`: Cordis сам разворачивает
* `volatile()` в `Volatile<T>` на Host-стороне, а Client-форма получает по
* проводу уже разрешённое JSON-значение `selection`.
*/
const Config = z.object({ selection: z.union([...THEME_SELECTIONS]).default(DEFAULT_SELECTION).volatile() });
// src/index.ts
/** Имя Cordis-плагина для диагностики загрузчика. */
const name = "runlark-theme";
/**
* Зарегистрировать политику формы настроек.
*
* `auto: false` оставляет namespace доступным для Client-формы, но не даёт
* UI сгенерировать отдельную страницу. Как в установленном DSH rc.3,
* настройки подключаются через `ctx.inject`, а не статическим `inject`.
*
* @param ctx - Host-контекст плагина.
*/
function apply(ctx) {
	ctx.inject(["settings"], (child) => {
		child.effect(() => child.settings.configure({ auto: false }, ctx.fiber), "runlark-theme: settings presentation");
	});
}
export { Config, DEFAULT_SELECTION, SELECTION_FIELD, SETTINGS_NAMESPACE, THEME_SELECTIONS, apply, name };
