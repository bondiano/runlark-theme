# Тема Runlark для DeepSeek Harness

Плагин добавляет в **Настройки → Общие → Внешний вид** отдельную строку
«Тема» с выбором **Стандартная / Runlark**. Выбор сохраняется на Host и
восстанавливается после перезагрузки страницы.

Тема построена на цветах Runlark (чернила, бумага, тёплые поверхности,
золотой акцент) и накладывается на штатную светлую или тёмную схему через
`ctx.theme.overrideTokens`. Светлая/тёмная/системная схема, размер шрифта и
семейства шрифтов остаются штатными настройками Appearance и продолжают
работать независимо.

- Исходные цвета и формулы: [PROVENANCE.md](./PROVENANCE.md).
- Как проверялось: [VERIFICATION.md](./VERIFICATION.md).

## Что видит пользователь

```
Настройки → Общие → Внешний вид
  Внешний вид          [Светлая | Тёмная | Система]
  Тема                 [Стандартная | Runlark]
  Размер шрифта        ...
```

Строка «Тема» появляется сразу после штатного Appearance. Пока Host
загружает сохранённое значение, кнопки показывают состояние загрузки; во
время записи — «Сохраняем…»; при отказе Host — сообщение об ошибке, а слой
темы остаётся на последнем **принятом** значении. Неподтверждённый выбор
никогда не применяется.

## Установка в профиль

Пакет — обычный bundle-плагин DSH. Сначала соберите его из корня монорепы:

```bash
pnpm install
pnpm --filter @dev-platform/runlark-theme run build
```

Затем установите каталог `packages/runlark-theme` как bundle:

- в Web UI: **Плагины → Добавить плагин → локальный каталог** и укажите
  абсолютный путь к `packages/runlark-theme`;
- агенту с инструментом `plugin_manager`: `action: "install_bundle"`,
  `target: "/абсолютный/путь/packages/runlark-theme"`.

Установщик читает `dsh.bundle.patch: "./cordis.patch.yml"` и сам добавляет
запись bundle в профиль:

```yaml
- insert:
    - id: runlark-theme
      name: "@dev-platform/runlark-theme"
```

После установки перезапустите web-профиль (или перезагрузите страницу, если
профиль подхватывает плагины без рестарта) и откройте
**Настройки → Общие → Внешний вид**.

Не используйте `dsh plugin --profile web add …` для установки bundle: эта
команда только пересылает аргументы в `pnpm` внутри профиля и не добавляет
bundle в `dsh.profile.bundles` и не применяет patch. Для ручной проверки
пакета в изолированном профиле используйте `plugin_manager` или UI.

Отключить тему, не удаляя пакет, можно переопределением записи в
`cordis.patch.yml` профиля:

```yaml
- id: runlark-theme
  disabled: true
```

## Как это устроено

| Половина | Файл | Роль |
| --- | --- | --- |
| Host | `src/index.ts` | объявляет `Config` и вызывает `settings.configure({ auto: false })`, чтобы не появлялась вторая автоматическая страница |
| Host | `src/settings.ts` | схема `selection: 'default' \| 'runlark'`, volatile-поле с дефолтом `default` |
| Client | `src/client/index.ts` | регистрирует словари, слот `settings.general.item` и постоянную подписку на форму |
| Client | `src/client/AppearanceThemeRow.tsx` | сегментированный выбор, состояния loading/saving/error |
| Client | `src/client/theme-layer.ts` | ровно один слой на подтверждённый `runlark`, снятие при `default`/unload |
| Client | `src/client/tokens.ts` | 27 цветовых токенов, у каждого light и dark |

Host пишет настройку в пользовательский документ настроек, Client читает её
через `ctx.configForms.get('runlark-theme')`. Слой создаётся в
`ctx.effect`, поэтому disable, unload и HMR снимают и подписку, и слой.
Строка настроек только отображает состояние и вызывает `form.set`; она не
управляет слоем напрямую.

## Сборка и проверки

```bash
pnpm --filter @dev-platform/runlark-theme run build      # tsdown + проверка артефактов
pnpm --filter @dev-platform/runlark-theme run typecheck  # tsc --noEmit
pnpm --filter @dev-platform/runlark-theme run test       # build + vitest
```

Сборка обязана дать:

- `lib/index.js` — Host ESM без вендоринга зависимостей;
- `lib/client.js` — один ленивый модуль
  `window.__ModuleLoader__.load({id:"@dev-platform/runlark-theme",…})`;
- `lib/client.graph.json` — внешние только `react` и `react-dom`, один чанк,
  без dynamic import.

## Ограничения

- Тема меняет только цвета. Радиусы, отступы, размеры и шрифты не
  переопределяются.
- Тёмная схема — адаптация палитры Runlark, а не её исходный дизайн: Runlark
  исторически светлый.
- Пакет фиксирован на DSH `0.2.2-rc.3`; API `overrideTokens`,
  `configForms` и слотов проверен на этой версии.
