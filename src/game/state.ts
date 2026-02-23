import { createCharacterBase } from "@/domain/character/base.js";
import { SCENE_DEFS } from "../domain/scene/registry";
import { GameState } from "./types";

export function createInitialGameState(): GameState {
  const playerId = "player_1";

  const player = createCharacterBase({
    id: playerId,
    name: "明月",
    role: "player",
  });

  const initialScene = SCENE_DEFS.cave;

  return {
    characters: {
      [playerId]: player,
    },
    playerId,
    world: {
        currentScene: initialScene.id,
        time: { year: 1, month: 1, day: 1 },
        presence: {
            [initialScene.id]: [playerId],
        },
        instances: {},
    },
    memory: [],
  };
}