# Происхождение темы Runlark

Пакет `@dev-platform/runlark-theme` — собственная реализация темы для
DeepSeek Harness. Он не является форком Runlark или Theme Studio: из Runlark
взяты только числовые значения цветов, весь код, слой токенов и иконка
написаны для этого пакета.

## Источники

| Источник | Ссылка | Фиксация |
| --- | --- | --- |
| Runlark (актуальные UI-токены) | https://github.com/bondiano/runlark-legacy | SHA `0adf036702f4a6164031caf723f0398707fef42a` |
| Runlark, файл токенов | `web/src/common/config/ui-tokens.ts` | извлечён через GitHub REST API |
| Theme Studio (пример механики) | https://github.com/marselarts/dsh-theme-studio | SHA `7234b6177748a76a7367993ee13658e8bcfe5dbd`, MIT |
| DSH rc.3 (имена и потребители токенов) | установленный `@deepseek-ai/dsh-client-ui-theme@0.2.2-rc.3` | `src/styles/design-platform.css`, `src/client/index.ts` |

### Как извлечены цвета

```bash
gh api 'repos/bondiano/runlark-legacy/contents/web/src/common/config/ui-tokens.ts?ref=0adf036702f4a6164031caf723f0398707fef42a' \
  --jq '.content' | base64 -d
```

В `data/runlark-ui-tokens.json` сохранены только цветовые значения из
объектов `color` (25 ключей) и `palette` (10 шагов). Радиусы, отступы,
типографика и семейства шрифтов не копировались и не переносились в тему:
Harness сохраняет собственную геометрию и шрифты.

Историческая палитра `docs/brand/tokens/runlark.json` **не** использовалась и
не выдаётся за актуальную: единственный источник — файл `ui-tokens.ts` по
указанному SHA.

### Лицензия Runlark

Запрос `gh api repos/bondiano/runlark-legacy/license` возвращает **HTTP 404
Not Found**. Это означает, что GitHub не определил лицензию репозитория; это
не разрешение на копирование кода. Поэтому здесь нет кода Runlark: только
числовые значения цветов как факты палитры, собственная реализация и
оригинальная иконка. При распространении темы стоит отдельно уточнить
условия у автора Runlark.

### Роль Theme Studio

Theme Studio использован как пример того, как сторонний пакет общается с
`ctx.theme.overrideTokens`, `ctx.configForms` и слотом
`settings.general.item`. Код Theme Studio (MIT) не копировался; совпадают
только публичные имена API Harness, которые задаёт сам Harness.

## Сопоставление токенов

Столбец «статус» относится к конкретному значению:

- **точный** —hex совпадает с `data/runlark-ui-tokens.json` (`color.*` или
  `palette[]`);
- **производный** — значение получено смешением/осветлением исходного цвета
  для контраста или тёмной схемы; формула указана в примечании.

| # | Токен DSH | Light | Dark | Статус и источник |
| --- | --- | --- | --- | --- |
| 1 | `--dsw-alias-bg-base` | `#F3F4F6` | `#1B1E25` | light — точный `ground`; dark — производный: `ink` смешан с чёрным 15% |
| 2 | `--dsw-alias-bg-layer-1` | `#FFFFFF` | `#20232B` | light — точный `paper`; dark — точный `ink` |
| 3 | `--dsw-alias-bg-layer-2` | `#FFFCF3` | `#2B2F39` | light — точный `decisionPaper`; dark — точный `sidebarSurface` |
| 4 | `--dsw-alias-bg-overlay` | `#FFFFFF` | `#30343E` | light — точный `paper`; dark — точный `sidebarBorder` |
| 5 | `--dsw-alias-bg-document-selection` | `rgba(237, 184, 48, 0.35)` | `rgba(237, 184, 48, 0.3)` | производный: `accent` с прозрачностью 35% / 30% |
| 6 | `--dsw-alias-label-primary` | `#20232B` | `#E0E4EB` | light — точный `ink`; dark — точный `sidebarText` |
| 7 | `--dsw-alias-label-secondary` | `#646B79` | `#AEB7C7` | light — точный `muted`; dark — точный `sidebarMuted` |
| 8 | `--dsw-alias-label-primary-inverted` | `#FFFFFF` | `#20232B` | light — точный `paper`; dark — точный `ink` |
| 9 | `--dsw-alias-border-l1` | `#DFE2E8` | `#30343E` | light — точный `rule`; dark — точный `sidebarBorder` |
| 10 | `--dsw-alias-border-l2` | `#D4D8E0` | `#41444D` | light — точный `controlBorder`; dark — производный: `sidebarBorder` + 8% белого |
| 11 | `--dsw-alias-brand-primary` | `#B88A1F` | `#EDB830` | light — точный `palette[7]`; dark — точный `accent` |
| 12 | `--dsw-alias-brand-text` | `#20232B` | `#E0E4EB` | light — точный `ink`; dark — точный `sidebarText` |
| 13 | `--dsw-alias-state-error-primary` | `#C0392B` | `#D67E75` | light — точный `danger`; dark — производный: `danger` + 35% белого |
| 14 | `--dsw-alias-state-idle-primary` | `#5B6475` | `#848B98` | light — точный `unknown`; dark — производный: `unknown` + 25% белого |
| 15 | `--dsw-alias-state-success-primary` | `#2E7D4F` | `#77AB8D` | light — точный `success`; dark — производный: `success` + 35% белого |
| 16 | `--dsw-alias-state-warn-primary` | `#B88A1F` | `#EDB830` | light — точный `palette[7]`; dark — точный `accent` |
| 17 | `--dsw-alias-state-business-primary` | `#916C18` | `#EDB830` | light — точный `palette[8]` (контрастный золотой для ссылок); dark — точный `accent` |
| 18 | `--dsw-specific-sidebar-fill` | `#F3F4F6` | `#20232B` | light — точный `ground`; dark — точный `sidebar` |
| 19 | `--dsw-specific-sidebar-nav-item-active` | `#FBF2D8` | `#2B2F39` | light — точный `attentionWash`; dark — точный `sidebarSurface` |
| 20 | `--dsw-specific-sidebar-nav-item-active-accent` | `#FBF2D8` | `#4E4837` | light — точный `attentionWash`; dark — производный: `sidebarSurface` + 18% `accent` |
| 21 | `--dsw-alias-button-primary-fill` | `#20232B` | `#EDB830` | light — точный `ink` (белый текст штатной кнопки остаётся контрастным); dark — точный `accent` |
| 22 | `--dsw-alias-button-primary-hover` | `#2B2F39` | `#F3D77A` | light — точный `sidebarSurface`; dark — точный `palette[3]` |
| 23 | `--dsw-alias-interactive-bg-hover` | `rgba(32, 35, 43, 0.06)` | `rgba(224, 228, 235, 0.08)` | производный: `ink` 6% / `sidebarText` 8% |
| 24 | `--dsw-alias-interactive-bg-hover-solid` | `#DFE2E8` | `#2B2F39` | light — точный `rule`; dark — точный `sidebarSurface` |
| 25 | `--dsw-alias-interactive-bg-hover-accent` | `rgba(237, 184, 48, 0.16)` | `rgba(237, 184, 48, 0.22)` | производный: `accent` 16% / 22% |
| 26 | `--dsw-alias-interactive-bg-active` | `rgba(32, 35, 43, 0.1)` | `rgba(224, 228, 235, 0.14)` | производный: `ink` 10% / `sidebarText` 14% |
| 27 | `--dsw-focus-ring-color` | `#916C18` | `#F3D77A` | light — точный `palette[8]`; dark — точный `palette[3]` |

### Почему часть значений производная

Runlark — светлая тема с тёмным сайдбаром и золотым акцентом. Переносить её
цвета один-к-одному в обе схемы Harness нельзя:

- светлый `ink` на тёмном фоне нечитаем, поэтому тёмная схема использует
  `sidebarText`/`sidebarMuted` и осветлённые состояния;
- чистый `accent` как текст ссылки на белом фоне даёт низкий контраст,
  поэтому в светлой схеме ссылки и фокус используют тёмные шаги палитры
  (`#916C18`, `#B88A1F`), а чистый `accent` остаётся акцентом тёмной схемы;
- прозрачные hover/active-заливки и selection выводятся из `ink` и `accent`
  с указанными процентами;
- `bg-base` тёмной схемы чуть темнее `ink`, чтобы боковая панель и основная
  поверхность не сливались.

Слой не трогает `--dsw-static-*`, геометрию, радиусы, размеры и шрифты.
Поэтому тема совместима с отдельными настройками светлой/тёмной схемы,
размера и семейства шрифтов.

## Иконка

`icon.svg` нарисована для этого пакета: тёмный квадрат, золотое солнце и
стилизованная птица. Никакие SVG-ресурсы Runlark или Theme Studio не
копировались.
