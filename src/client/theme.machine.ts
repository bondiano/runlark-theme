/**
 * Конечный автомат слоя темы — зеркало модели
 * `extensions/dsh/machines/machines/runlark-theme.mjs`.
 *
 * Единственный вход — подтверждённый Host-выбор: `runlark` ставит ровно один
 * слой токенов, `default` (и пропавшее значение) снимает его, dispose
 * терминален. Переходы только через `themeLayerNext`: запрещённое событие
 * бросает, а не игнорируется.
 *
 * @module @dev-platform/runlark-theme/src/client/theme.machine
 */

import { createMachine, transition } from "xstate";

/** Состояния автомата; совпадают с states модели machines/runlark-theme.mjs. */
export type ThemeLayerState = "unloaded" | "default" | "runlark" | "disposed";

/** События автомата; совпадают с event-именами модели. */
export type ThemeLayerEvent = "SELECT_RUNLARK" | "SELECT_DEFAULT" | "DISPOSE";

/** Автомат жизненного цикла слоя темы. */
export const themeLayerMachine = createMachine({
  id: "themeLayer",
  initial: "unloaded",
  description:
    "Runlark theme override: at most one layer, driven by the confirmed form snapshot.",
  states: {
    unloaded: { on: { SELECT_RUNLARK: "runlark", SELECT_DEFAULT: "default" } },
    default: {
      on: {
        SELECT_RUNLARK: "runlark",
        SELECT_DEFAULT: "default",
        DISPOSE: "disposed",
      },
    },
    runlark: {
      on: {
        SELECT_DEFAULT: "default",
        SELECT_RUNLARK: "runlark",
        DISPOSE: "disposed",
      },
    },
    disposed: { type: "final" },
  },
});

/**
 * Чистый строгий переход по автомату.
 *
 * @param state - текущее состояние.
 * @param event - имя события автомата.
 * @returns следующее состояние.
 * @throws Error, если событие не определено в текущем состоянии.
 */
export function themeLayerNext(
  state: ThemeLayerState,
  event: ThemeLayerEvent,
): ThemeLayerState {
  const snapshot = themeLayerMachine.resolveState({ value: state });
  const eventObject = { type: event };
  if (!snapshot.can(eventObject)) {
    throw new Error(`illegal transition: ${state} --${event}-->`);
  }
  return transition(themeLayerMachine, snapshot, eventObject)[0]
    .value as ThemeLayerState;
}
