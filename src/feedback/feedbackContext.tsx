import React, { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import type { FeedbackTheme, NarrativeEvent, FeedbackItem } from "@/types/types";
import { feedbackReducer, initialFeedbackState, type FeedbackAction, type FeedbackState } from "./feedbackReducer";
import { resolveVisual } from "./feedbackResolver";

export interface FeedbackAPI {
  emit: (event: NarrativeEvent) => string;
  interrupt: (event: NarrativeEvent) => string;
  clear: () => void;
  state: { current: FeedbackItem | null; queueSize: number };
  theme: FeedbackTheme;
}

export const FeedbackContext = React.createContext<FeedbackAPI | null>(null);
const FEEDBACK_DEBUG = true;
const defaultTheme: FeedbackTheme = {
  fadeInMs: 400,
  fadeOutMs: 600,
  defaultTtlMs: 2200,
  fontFamily:
    'system-ui, -apple-system, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial',
  color: "rgba(234,230,218,0.92)",
  letterSpacingEm: 0.05,
  lineHeight: 1.6,
  safePaddingPx: 18,
};

function createItem(event: NarrativeEvent, theme: FeedbackTheme): FeedbackItem {
  const id = crypto.randomUUID();
  const createdAtMs = Date.now();
  const visual = resolveVisual(event, theme);

  return {
    id,
    narrative: event,
    visual,
    createdAtMs,
    priority: event.intensity,
    cooldownMs: undefined,
  };
}

export function FeedbackProvider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: Partial<FeedbackTheme>;
}) {
  const mergedTheme = useMemo(() => ({ ...defaultTheme, ...theme }), [theme]);
  const [state, dispatch] = useReducer<
  React.Reducer<FeedbackState, FeedbackAction>
>(feedbackReducer, initialFeedbackState);
  const timerRef = useRef<number | null>(null);
  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();
    if (!state.current) return;

    const ttl = state.current.visual.ttlMs ?? mergedTheme.defaultTtlMs;
    const totalMs = mergedTheme.fadeInMs + ttl + mergedTheme.fadeOutMs;

    timerRef.current = window.setTimeout(() => {
      dispatch({ type: "NEXT" });
    }, totalMs);

    return clearTimer;
  }, [state.current, mergedTheme.fadeInMs, mergedTheme.fadeOutMs, mergedTheme.defaultTtlMs]);

  const emit = useCallback(
    (event: NarrativeEvent) => {
      if (FEEDBACK_DEBUG) {
        console.log("[Feedback] emit:", event);
      }
  
      const item = createItem(event, mergedTheme);
  
      if (FEEDBACK_DEBUG) {
        console.log("[Feedback] resolved visual:", item.visual);
      }
  
      dispatch({ type: "ENQUEUE", item });
  
      return item.id;
    },
    [mergedTheme]
  );
  const interrupt = useCallback(
    (event: NarrativeEvent) => {
      const item = createItem(event, mergedTheme);
      dispatch({ type: "INTERRUPT", item });
      return item.id;
    },
    [mergedTheme]
  );

  const clear = useCallback(() => {
    clearTimer();
    dispatch({ type: "CLEAR" });
  }, []);

  const api: FeedbackAPI = useMemo(
    () => ({
      emit,
      interrupt,
      clear,
      state: { current: state.current, queueSize: state.queue.length },
      theme: mergedTheme,
    }),
    [emit, interrupt, clear, state.current, state.queue.length, mergedTheme]
  );

  return <FeedbackContext.Provider value={api}>{children}</FeedbackContext.Provider>;
}