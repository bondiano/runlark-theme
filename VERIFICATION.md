# Проверка темы Runlark

Дата проверки: 2026-11-16. Окружение: Node `v26.13.1`, pnpm `10.33.0`,
DSH `0.2.2-rc.3`, Linux x64.

## Автоматические проверки

Все команды выполнялись из корня репозитория.

### 1. Установка монорепы

```bash
pnpm install
```

Результат: `Done in 39.1s using pnpm v10.33.0`. В `pnpm-lock.yaml` три
importer'а — корень `.`, `packages/code-mode` и `packages/runlark-theme`;
store, cache и state лежат в `.pnpm-store`, `.pnpm-cache`, `.pnpm-state`
внутри репозитория.

Повторная проверка lockfile:

```bash
pnpm install --frozen-lockfile
```

Результат: успешно, lockfile не менялся.

### 2. Типы

```bash
pnpm --filter @dev-platform/runlark-theme run typecheck
pnpm --filter @dev-platform/code-mode run typecheck
```

Результат: обе команды завершились с кодом 0 (`tsc --noEmit`).

### 3. Сборка

```bash
pnpm --filter @dev-platform/runlark-theme run build
```

Результат:

```
lib/index.js            1.92 kB
lib/client.js          12.96 kB
lib/client.graph.json   0.27 kB
built @dev-platform/runlark-theme: index.js, client.js, client.graph.json (client externals: react)
```

`lib/client.js` начинается с
`window.__ModuleLoader__.load({id:"@dev-platform/runlark-theme",factory(require){…`,
содержит только `require("react")` и не содержит
`require("@deepseek-ai/…")`. `lib/client.graph.json`:

```json
{
  "externals": ["react"],
  "modules": [
    "src/client/AppearanceThemeRow.tsx",
    "src/client/index.ts",
    "src/client/locales.ts",
    "src/client/theme-layer.ts",
    "src/client/tokens.ts"
  ],
  "dynamicImports": [],
  "chunks": ["client.js"]
}
```

react-dom не импортируется, потому что компонент не использует порталы;
внешние модули ограничены разрешённым набором `react`/`react-dom`.

### 4. Тесты

```bash
pnpm --filter @dev-platform/runlark-theme run test
```

Результат: `7` test files, `38` tests passed:

- `src/client/__tests__/tokens.test.ts` — 27 токенов, обе палитры, только
  цвета, точные значения сверены с `data/runlark-ui-tokens.json`;
- `src/client/__tests__/theme-layer.test.ts` — один слой на `runlark`,
  идемпотентность, снятие на `default`/`undefined`/dispose;
- `src/client/__tests__/AppearanceThemeRow.test.tsx` — loading/unavailable,
  «Сохраняем…» во время записи, отказ Host и ошибка транспорта, применение
  только подтверждённого значения, отсутствие оптимистичного переключения,
  снятие подписки при размонтировании;
- `src/client/__tests__/apply.test.ts` — состав `inject`, регистрация
  словарей и строки `settings.general.item` (`id`, `order: 10.5`, `locale`,
  inject-форма), ровно один слой на подтверждённый `runlark`, снятие на
  `default`/`unavailable`, очистка подписки, слоя и слота при unload;
- `src/__tests__/settings.test.ts` — дефолт `default`, приём `runlark`,
  отказ неизвестному значению, volatile-поле в wire-схеме;
- `src/client/__tests__/locales.test.ts` — одинаковый набор ключей ru/en,
  непустые подписи и оба варианта выбора;
- `scripts/__tests__/release-package.test.ts` — manifest, exports, files,
  patch, meta локалей, артефакты и graph.

```bash
pnpm --filter @dev-platform/code-mode run test:unit
```

Результат: `8` test files, `63` tests passed — перенос в
`packages/code-mode` не изменил поведение Code Mode.

### 5. Проверка пакетов

```bash
pnpm verify:packages
```

Результат: `verify:packages ok — …/packages/code-mode and …/packages/runlark-theme`.

Проверяются: имя/версия, ESM, `engines`, `dsh.bundle.patch`,
`dsh.client`, exports, files, patch-строки, 27 токенов, состав
`data/runlark-ui-tokens.json`, meta локалей и контракт Client-бандла обоих
пакетов.

## 6. Установка в изолированный профиль

Живой профиль `web` находится вне workspace, а файловая политика разрешает
запись только внутри `/home/alexxuss/coding/dsh-code-mode`. Установка в него
не выполнялась. Вместо этого проверка проведена на изолированном `DSH_HOME`
внутри `.artifacts`, без изменения рабочего профиля.

Профиль `uicheck` собран так же, как это делает `install_bundle`:

- `dsh.profile.bundles`: `@deepseek-ai/dsh-base`, `@deepseek-ai/dsh-web-app`,
  `@dev-platform/runlark-theme`;
- зависимость профиля:
  `"@dev-platform/runlark-theme": "link:/home/alexxuss/coding/dsh-code-mode/packages/runlark-theme"`;
- `pnpm install` в каталоге профиля → `Already up to date`;
- пользовательский `cordis.patch.yml` профиля пуст (`[]`): запись
  `runlark-theme` уже приходит из `dsh.bundle.patch` самого пакета.

Важно: если вручную продублировать `insert` в пользовательском
`cordis.patch.yml`, получаются две entry с одним id; запись настройки в такой
конфигурации отклоняется. При штатной установке через
`plugin_manager`/**Плагины → Добавить плагин** вклад пакета должен остаться
один.

Дополнительно содержимое `pnpm pack`-tarball сверено с `files`-whitelist
(`lib/index.js`, `lib/client.js`, `lib/client.graph.json`, `src/index.ts`,
`src/settings.ts`, `cordis.patch.yml`, локали, иконка, README, PROVENANCE,
VERIFICATION, JSON токенов) и не содержит тестов и исходников Client.

## 7. End-to-end проверка UI

Изолированный профиль запущен как web-сервер на `127.0.0.1:3099`; страница и
Client-бандл проверены headless Chromium (Playwright):

```bash
DSH_HOME=$PWD/.artifacts/uicheck-home \
  dsh --profile uicheck --host 127.0.0.1 --port 3099 --no-open
```

Сценарий на чистом профиле (светлая схема по умолчанию):

- в boot-манифесте страницы присутствует
  `@dev-platform/runlark-theme/client.js`, сервер отдаёт его с HTTP 200;
- **Настройки → Общие → Внешний вид**: сразу после Appearance есть строка
  «Theme» с подписью и выбором `Standard` / `Runlark`; по умолчанию выбран
  `Standard`, `--dsw-alias-bg-base = #fff`;
- отдельной автоматически сгенерированной страницы Runlark в навигации нет:
  видны только General / Models / Built-in plugins / Agent presets;
- клик **Runlark** → запись принята, `--dsw-alias-bg-base = #F3F4F6`,
  кнопка Runlark имеет `aria-checked=true`, ошибок нет;
- переключение штатной схемы на **Dark** → слой остаётся, значение становится
  `#1B1E25`, `--dsw-alias-label-primary = #E0E4EB`, Runlark всё ещё выбран;
- reload страницы → Runlark остаётся выбранным, `--dsw-alias-bg-base = #1B1E25`
  (тёмная схема тоже сохранилась) без открытия настроек;
- клик **Standard** → слой снят, фон возвращается к штатному тёмному
  `#151517`, выбран `Standard`;
- ошибок `pageerror`/`console.error` за время сценария нет.

Скриншоты сценария: `.artifacts/pw/e2e-settings.png` (строка темы),
`.artifacts/pw/e2e-runlark-light.png` (светлая схема),
`.artifacts/pw/e2e-runlark-dark.png` (тёмная схема),
`.artifacts/pw/e2e-standard.png` (возврат к Standard).

## Ограничения проверки

- Рабочий профиль `web` не изменялся из-за sandbox-политики: файловая запись
  разрешена только внутри workspace. Поэтому фактическая строка в живом
  **Настройки → Общие → Внешний вид** этим прогоном не подтверждена.
  Недостающий шаг — установить каталог `packages/runlark-theme` в профиль
  `web` через **Плагины → Добавить плагин** (или `plugin_manager`
  `install_bundle` с абсолютным путём) и перепроверить тот же сценарий в
  живом GUI. Установка и UI проверены на изолированном профиле с теми же
  bundle-плагинами и тем же Client-бандлом.
- Тёмная схема — производная адаптация, а не исходный дизайн Runlark
  (Runlark светлый). Формулы и статусы «точный/производный» перечислены в
  [PROVENANCE.md](./PROVENANCE.md).
- Лицензия Runlark через GitHub API — HTTP 404; код Runlark не копировался.
