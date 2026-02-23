// src/game/worldOps.ts
import type { GameState } from "./types";
import type { SceneDefId } from "@/domain/scene/types";
import { getSceneDef } from "@/domain/scene/registry";

/**
 * 让玩家旅行到某个固定场景（def）
 * - 更新 currentScene（SceneRef）
 * - 更新 presence：确保玩家在目标场景出现
 * - 可选：校验 connections（不可达则保持原状）
 */
export function travelToDef(state: GameState, nextDefId: SceneDefId): GameState {
  const playerId = state.playerId;

  // 当前 defId（如果未来是 instance，先退化到其 defId）
  const curRef = state.world.currentScene;
  const curDefId =
    curRef.kind === "def" ? curRef.id : state.world.instances[curRef.id]?.defId;

  // 可达校验（你不想限制就把这段删掉/注释）
  if (curDefId) {
    const curDef = getSceneDef(curDefId);
    const ok = (curDef.connections ?? []).includes(nextDefId);
    if (!ok) return state;
  }

  const nextRef = { kind: "def", id: nextDefId } as const;

  const nextPresence = state.world.presence[nextDefId] ?? [];
  const hasPlayer = nextPresence.includes(playerId);

  return {
    ...state,
    world: {
      ...state.world,
      currentScene: nextRef,
      presence: {
        ...state.world.presence,
        [nextDefId]: hasPlayer ? nextPresence : [...nextPresence, playerId],
      },
    },
  };
}