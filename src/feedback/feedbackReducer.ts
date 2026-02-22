import type { FeedbackItem } from "@/types/types";

export interface FeedbackState {
  queue: FeedbackItem[];
  current: FeedbackItem | null;
}

export type FeedbackAction =
  | { type: "ENQUEUE"; item: FeedbackItem }
  | { type: "INTERRUPT"; item: FeedbackItem }
  | { type: "NEXT" }
  | { type: "CLEAR" };

export const initialFeedbackState: FeedbackState = {
  queue: [],
  current: null,
};

export function feedbackReducer(state: FeedbackState, action: FeedbackAction): FeedbackState {
  switch (action.type) {
    case "ENQUEUE": {
      if (!state.current) return { ...state, current: action.item };
      return { ...state, queue: [...state.queue, action.item] };
    }

    case "INTERRUPT": {
      const nextQueue = state.current ? [state.current, ...state.queue] : state.queue;
      return { current: action.item, queue: nextQueue };
    }

    case "NEXT": {
      const [next, ...rest] = state.queue;
      return { current: next ?? null, queue: rest };
    }

    case "CLEAR":
      return { current: null, queue: [] };

    default:
      return state;
  }
}