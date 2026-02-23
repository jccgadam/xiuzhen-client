import type { CharacterBase, CharacterId } from "../domain/character";
import type { SceneRef, SceneInstanceId } from "../domain/scene/types";

export type WorldTime = { year: number; month: number; day: number };

/**
 * 场景出镜表：
 * - key 可以是 defId（如 "cave"）
 * - 未来也可以是 instanceId（如 "inst_123"）
 */
export type ScenePresence = Record<string, CharacterId[]>;

/** 未来副本实例（先埋接口，当前可不用） */
export type SceneInstance = {
  id: SceneInstanceId;
  defId: string;
  seed: number;
  createdAtMs: number;
  state: Record<string, unknown>;
};

export type WorldState = {
  currentScene: SceneRef;
  time: WorldTime;

  presence: ScenePresence;

  /** 未来随机副本/秘境：实例容器（现在空对象即可） */
  instances: Record<SceneInstanceId, SceneInstance>;
};

export type MemoryRecord = {
  id: string;
  atMs: number;
  lines: string[];
  tags?: string[];
  scene?: string;
  activity?: string;
};

export type GameState = {
  characters: Record<CharacterId, CharacterBase>;
  playerId: CharacterId;
  world: WorldState;
  memory: MemoryRecord[];
};
