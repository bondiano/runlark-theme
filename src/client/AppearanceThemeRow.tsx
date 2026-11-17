/**
 * Строка «Тема» в «Настройки → Общие → Внешний вид».
 *
 * Показывает подтверждённое Host-значение и пишет выбор только через
 * `ConfigForm.set('selection', …)`. Локальная тема применяется после
 * принятия записи: пока Host не подтвердил значение, слой не меняется.
 *
 * @module @dev-platform/runlark-theme/src/client/AppearanceThemeRow
 */

import * as React from "react";
import type { CSSProperties, ReactElement } from "react";
import type { ConfigForm } from "@deepseek-ai/dsh-client-ui-settings/client";
import type {
  InjectFace,
  PropsLocale,
  PropsRuntime,
} from "@deepseek-ai/dsh-client-ui-slots";

import type { ThemeSelection, ThemeSettings } from "../settings.ts";
import { NS } from "./locales.ts";

const { useCallback, useState, useSyncExternalStore } = React;

/** Внедрённая форма настроек namespace `runlark-theme`. */
export interface RunlarkThemeRowInjected {
  /** Общая Client-форма entry `runlark-theme`. */
  form: ConfigForm<ThemeSettings>;
}

/** Полные props строки. */
export type RunlarkThemeRowProps = PropsRuntime<"settings.general.item">
  & PropsLocale<typeof NS>
  & InjectFace<RunlarkThemeRowInjected>;

const ROW: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px 20px",
  width: "100%",
  padding: "14px 0",
};

const TEXT: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: "220px",
  flex: "1 1 260px",
};

const TITLE: CSSProperties = {
  color: "var(--dsw-alias-label-primary)",
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "20px",
};

const DESCRIPTION: CSSProperties = {
  color: "var(--dsw-alias-label-secondary)",
  fontSize: "12px",
  lineHeight: "18px",
};

const CONTROLS: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const SWATCH: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  width: "30px",
  height: "20px",
  overflow: "hidden",
  border: "0.5px solid var(--dsw-alias-border-l2)",
  borderRadius: "5px",
  background: "var(--dsw-alias-bg-layer-1)",
};

const GROUP: CSSProperties = {
  display: "inline-flex",
  padding: "2px",
  gap: "2px",
  borderRadius: "7px",
  background: "var(--dsw-alias-interactive-bg-hover)",
};

const OPTION: CSSProperties = {
  appearance: "none",
  border: "0.5px solid transparent",
  borderRadius: "5px",
  padding: "4px 10px",
  font: "inherit",
  fontSize: "12px",
  lineHeight: "18px",
  cursor: "pointer",
  color: "var(--dsw-alias-label-secondary)",
  background: "transparent",
};

const OPTION_SELECTED: CSSProperties = {
  ...OPTION,
  color: "var(--dsw-alias-label-primary-foreground)",
  background: "var(--dsw-alias-button-primary-fill)",
  borderColor: "var(--dsw-alias-button-primary-fill)",
};

const OPTION_DISABLED: CSSProperties = {
  cursor: "default",
  opacity: 0.55,
};

const ERROR: CSSProperties = {
  ...DESCRIPTION,
  color: "var(--dsw-alias-state-error-primary)",
};

/**
 * Отрисовать выбор темы.
 *
 * @param props - слот-пропсы, словарь и внедрённая форма.
 * @returns строка настроек.
 */
export function AppearanceThemeRow({
  form,
  t,
}: RunlarkThemeRowProps): ReactElement {
  const subscribe = useCallback(
    (onChange: () => void) => form.subscribe(onChange),
    [form],
  );
  const getSnapshot = useCallback(() => form.getSnapshot(), [form]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  const [pending, setPending] = useState<ThemeSelection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accepted = snapshot.value?.selection ?? "default";
  const busy = pending !== null;
  const writable = snapshot.writable && snapshot.status !== "unavailable";
  const disabled = !writable || busy;

  const choose = (next: ThemeSelection): void => {
    if (disabled || next === accepted) return;
    setPending(next);
    setError(null);
    void form
      .set("selection", next)
      .then((ok) => {
        if (!ok) setError(t("row.error"));
      })
      .catch(() => {
        setError(t("row.error"));
      })
      .finally(() => {
        setPending(null);
      });
  };

  const status: string | null = error
    ?? (snapshot.status === "loading"
      ? t("row.loading")
      : snapshot.status === "unavailable"
        ? t("row.unavailable")
        : busy
          ? t("row.saving")
          : null);

  const options: { value: ThemeSelection; label: string }[] = [
    { value: "default", label: t("row.standard") },
    { value: "runlark", label: t("row.runlark") },
  ];

  return (
    <div data-runlark-theme-row="" style={ROW}>
      <div style={TEXT}>
        <span style={TITLE}>{t("row.title")}</span>
        <span style={error === null ? DESCRIPTION : ERROR}
          role={error === null ? undefined : "alert"}
          aria-live={error === null ? "polite" : undefined}
        >
          {status ?? t("row.description")}
        </span>
      </div>
      <div style={CONTROLS}>
        <span style={SWATCH} role="img" aria-label={t("row.palette")}>
          <span style={{ flex: 1, alignSelf: "stretch", background: "#20232B" }} />
          <span style={{ flex: 1, alignSelf: "stretch", background: "#EDB830" }} />
          <span style={{ flex: 1, alignSelf: "stretch", background: "#F3F4F6" }} />
        </span>
        <div style={GROUP} role="radiogroup" aria-label={t("row.title")}>
          {options.map((option) => {
            const selected = option.value === accepted;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                style={{
                  ...(selected ? OPTION_SELECTED : OPTION),
                  ...(disabled ? OPTION_DISABLED : {}),
                }}
                onClick={() => {
                  choose(option.value);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
