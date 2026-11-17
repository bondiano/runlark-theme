/**
 * Слой темы как отдельное состояние, не привязанное к открытым настройкам.
 *
 * Авторитет состояний — автомат `theme.machine.ts` (зеркало модели
 * `extensions/dsh/machines/machines/runlark-theme.mjs`): подтверждённый
 * Host-значением выбор `runlark` ставит ровно один слой
 * `ctx.theme.overrideTokens`, `default` и пропавшее значение (SELECT_DEFAULT)
 * снимают его, повторный тот же выбор — законный само-переход без переустановки,
 * dispose терминален и идемпотентен. События после dispose бросают.
 *
 * @module @dev-platform/runlark-theme/src/client/theme-layer
 */

import type { ThemeRuntime } from "@deepseek-ai/dsh-client-ui-theme/client";

import type { ThemeSelection } from "../settings.ts";
import { themeLayerNext, type ThemeLayerState } from "./theme.machine.ts";
import { RUNLARK_TOKENS } from "./tokens.ts";

/** Идентификатор слоя в ThemeRuntime и в диагностике. */
export const THEME_LAYER_SOURCE = "@dev-platform/runlark-theme";

/** Минимальная часть ThemeRuntime, нужная слою (удобно подменять в тестах). */
export type ThemeLayerHost = Pick<ThemeRuntime, "overrideTokens">;

/** Состояние применённого слоя; им управляет только автомат. */
export class ThemeLayer {
  private state: ThemeLayerState = "unloaded";
  private disposeLayer: (() => void) | undefined;

  /**
   * @param theme - сервис темы Harness.
   * @param source - идентификатор слоя; по умолчанию package id.
   */
  constructor(
    private readonly theme: ThemeLayerHost,
    private readonly source: string = THEME_LAYER_SOURCE,
  ) {}

  /**
   * Привести слой в соответствие подтверждённому выбору.
   *
   * @param selection - принятое Host-значение; `undefined` (форма ещё
   *   недоступна/значение пропало) трактуется как `default`.
   * @throws Error после `dispose()` — терминальное состояние.
   */
  apply(selection: ThemeSelection | undefined): void {
    this.moveTo(
      themeLayerNext(
        this.state,
        selection === "runlark" ? "SELECT_RUNLARK" : "SELECT_DEFAULT",
      ),
    );
  }

  /** Снять слой и завершить автомат (disable/unload/HMR); идемпотентен. */
  dispose(): void {
    if (this.state === "disposed" || this.state === "unloaded") return;
    this.moveTo(themeLayerNext(this.state, "DISPOSE"));
  }

  /** Текущий применённый выбор (для тестов и диагностики). */
  get selection(): ThemeSelection | undefined {
    return this.state === "runlark" || this.state === "default"
      ? this.state
      : undefined;
  }

  /** Применить новое состояние автомата к слою токенов. */
  private moveTo(state: ThemeLayerState): void {
    const previous = this.state;
    this.state = state;
    if (state === "runlark" && previous !== "runlark") {
      this.disposeLayer = this.theme.overrideTokens(this.source, RUNLARK_TOKENS);
    } else if (state !== "runlark" && previous === "runlark") {
      this.disposeLayer?.();
      this.disposeLayer = undefined;
    }
  }
}
