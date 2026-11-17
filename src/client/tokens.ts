/**
 * Слой токенов Runlark для `ctx.theme.overrideTokens`.
 *
 * Каждый ключ обязан иметь обе палитры: ThemeRuntime выбирает `light` или
 * `dark` по активной схеме пользователя и не умеет достраивать второе
 * значение. Значения взяты из `data/runlark-ui-tokens.json` (точные цвета
 * Runlark) либо выведены из них для контраста и тёмной схемы; разметка
 * «точный/производный» — в PROVENANCE.md.
 *
 * Геометрия, размеры, отступы и семейства шрифтов не переопределяются:
 * слой меняет только цвета.
 *
 * @module @dev-platform/runlark-theme/src/client/tokens
 */

import type { ThemeTokenOverrides } from "@deepseek-ai/dsh-client-ui-theme/client";

/** Полный слой темы: 27 alias/specific-токенов, у каждого обе схемы. */
export const RUNLARK_TOKENS: ThemeTokenOverrides = {
  // Поверхности.
  "--dsw-alias-bg-base": { light: "#F3F4F6", dark: "#1B1E25" },
  "--dsw-alias-bg-layer-1": { light: "#FFFFFF", dark: "#20232B" },
  "--dsw-alias-bg-layer-2": { light: "#FFFCF3", dark: "#2B2F39" },
  "--dsw-alias-bg-overlay": { light: "#FFFFFF", dark: "#30343E" },
  "--dsw-alias-bg-document-selection": {
    light: "rgba(237, 184, 48, 0.35)",
    dark: "rgba(237, 184, 48, 0.3)",
  },

  // Текст.
  "--dsw-alias-label-primary": { light: "#20232B", dark: "#E0E4EB" },
  "--dsw-alias-label-secondary": { light: "#646B79", dark: "#AEB7C7" },
  "--dsw-alias-label-primary-inverted": { light: "#FFFFFF", dark: "#20232B" },

  // Границы.
  "--dsw-alias-border-l1": { light: "#DFE2E8", dark: "#30343E" },
  "--dsw-alias-border-l2": { light: "#D4D8E0", dark: "#41444D" },

  // Бренд и состояния.
  "--dsw-alias-brand-primary": { light: "#B88A1F", dark: "#EDB830" },
  "--dsw-alias-brand-text": { light: "#20232B", dark: "#E0E4EB" },
  "--dsw-alias-state-error-primary": { light: "#C0392B", dark: "#D67E75" },
  "--dsw-alias-state-idle-primary": { light: "#5B6475", dark: "#848B98" },
  "--dsw-alias-state-success-primary": { light: "#2E7D4F", dark: "#77AB8D" },
  "--dsw-alias-state-warn-primary": { light: "#B88A1F", dark: "#EDB830" },
  "--dsw-alias-state-business-primary": { light: "#916C18", dark: "#EDB830" },

  // Боковая панель.
  "--dsw-specific-sidebar-fill": { light: "#F3F4F6", dark: "#20232B" },
  "--dsw-specific-sidebar-nav-item-active": { light: "#FBF2D8", dark: "#2B2F39" },
  "--dsw-specific-sidebar-nav-item-active-accent": {
    light: "#FBF2D8",
    dark: "#4E4837",
  },

  // Кнопки и интерактивные заливки.
  "--dsw-alias-button-primary-fill": { light: "#20232B", dark: "#EDB830" },
  "--dsw-alias-button-primary-hover": { light: "#2B2F39", dark: "#F3D77A" },
  "--dsw-alias-interactive-bg-hover": {
    light: "rgba(32, 35, 43, 0.06)",
    dark: "rgba(224, 228, 235, 0.08)",
  },
  "--dsw-alias-interactive-bg-hover-solid": { light: "#DFE2E8", dark: "#2B2F39" },
  "--dsw-alias-interactive-bg-hover-accent": {
    light: "rgba(237, 184, 48, 0.16)",
    dark: "rgba(237, 184, 48, 0.22)",
  },
  "--dsw-alias-interactive-bg-active": {
    light: "rgba(32, 35, 43, 0.1)",
    dark: "rgba(224, 228, 235, 0.14)",
  },

  // Кольцо фокуса: тот же контрастный акцент, что и у ссылок.
  "--dsw-focus-ring-color": { light: "#916C18", dark: "#F3D77A" },
};

/** Имена токенов в стабильном порядке (для проверок и документации). */
export const RUNLARK_TOKEN_NAMES = Object.freeze(Object.keys(RUNLARK_TOKENS));
