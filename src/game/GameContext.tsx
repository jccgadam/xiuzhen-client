import React, { createContext, useReducer, useContext } from "react";
import type { GameState } from "./types";
import { createInitialGameState } from "./state";

type GameAction =
  | { type: "NEW_GAME" }
  | { type: "TRAVEL"; scene: string };

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "NEW_GAME":
      return createInitialGameState();

    case "TRAVEL":
      return {
        ...state,
        world: {
          ...state.world,
          currentScene: action.scene,
        },
      };

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    createInitialGameState
  );

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}