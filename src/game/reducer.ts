// src/game/reducer.ts
import type { GameState } from "./types";
import type { GameAction } from "./actions";
import { createInitialGameState } from "./state";
import { travelToDef } from "./worldOps";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "NEW_GAME": {
      // 如果未来你想用 seed 影响副本生成，可从 action.payload.seed 取
      return createInitialGameState();
    }

    case "TRAVEL_TO_DEF": {
      return travelToDef(state, action.payload.sceneId);
    }

    case "ADD_MEMORY": {
      return {
        ...state,
        memory: [...state.memory, action.payload.record],
      };
    }

    case "CLEAR_MEMORY": {
      return { ...state, memory: [] };
    }

    default: {
      // TS 穷尽检查（如果 action 新增但 reducer 没处理，会报错）
      const _exhaustive: never = action;
      return state;
    }
  }
}