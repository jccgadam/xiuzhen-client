import type { GameState } from "./types";
import { getSceneDef } from "@/domain/scene/registry";
import type { SceneRef } from "@/domain/scene/types";

export function getPlayer(state: GameState) {
  const p = state.characters[state.playerId];
  if (!p) throw new Error("Player not found");
  return p;
}

export function getCurrentSceneRef(state: GameState): SceneRef {
  return state.world.currentScene;
}

/** 当前场景的定义（UI 背景/名字/元素都从这里取） */
export function getCurrentSceneDef(state: GameState) {
  const ref = state.world.currentScene;

  if (ref.kind === "def") return getSceneDef(ref.id);

  const inst = state.world.instances[ref.id];
  if (!inst) throw new Error(`SceneInstance not found: ${ref.id}`);
  return getSceneDef(inst.defId);
}

/** 当前场景出镜角色列表 */
export function getCurrentSceneCharacterIds(state: GameState): string[] {
  const ref = state.world.currentScene;
  const key = ref.kind === "def" ? ref.id : ref.id;
  return state.world.presence[key] ?? [];
}
