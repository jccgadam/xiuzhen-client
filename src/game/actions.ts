// src/game/actions.ts
import type { MemoryRecord } from "./types";
import type { SceneDefId } from "@/domain/scene/types";

export type GameAction =
  | { type: "NEW_GAME"; payload?: { seed?: number } }
  | { type: "TRAVEL_TO_DEF"; payload: { sceneId: SceneDefId } }
  | { type: "ADD_MEMORY"; payload: { record: MemoryRecord } }
  | { type: "CLEAR_MEMORY" };

// —— action creators（可选但推荐，减少手写错误）——

export const GameActions = {
  newGame: (payload?: { seed?: number }): GameAction => ({
    type: "NEW_GAME",
    payload,
  }),

  travelToDef: (sceneId: SceneDefId): GameAction => ({
    type: "TRAVEL_TO_DEF",
    payload: { sceneId },
  }),

  addMemory: (record: MemoryRecord): GameAction => ({
    type: "ADD_MEMORY",
    payload: { record },
  }),

  clearMemory: (): GameAction => ({ type: "CLEAR_MEMORY" }),
} as const;