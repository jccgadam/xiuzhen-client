/**
 * 轻量场景状态机（兼容版）
 * - 旧模式：resolveScene(location: string)  // location 可能是 "洞府"
 * - 新模式：resolveSceneRef(sceneRef)       // {kind:"def", id:"cave"} 或 instance
 *
 * 说明：
 * - 场景定义来自 domain/scene/registry（SCENE_DEFS）
 * - 旧的 sceneConfig 仍可保留，但不再作为权威来源
 */

import { getSceneDef } from "@/domain/scene/registry";

// 旧 location（中文） -> defId（英文）映射
const LEGACY_LOCATION_TO_DEF_ID = {
  洞府: "cave",
  药园: "garden",
  坊市: "market",
  戒律堂: "lawHall",
};

// 兼容：如果传进来已经是 defId，就直接用
function normalizeLocationToDefId(location) {
  if (!location) return "cave";

  // 已经是 defId（英文）
  if (typeof location === "string" && getMaybeSceneDef(location)) return location;

  // 中文映射
  return LEGACY_LOCATION_TO_DEF_ID[location] ?? "cave";
}

// 不 throw 的版本：用于 normalize 判断
function getMaybeSceneDef(id) {
  try {
    return getSceneDef(id);
  } catch {
    return null;
  }
}

/**
 * 旧入口：用 location（中文/旧值）拿 SceneDef，并适配为 CinematicScene 需要的结构
 * @param {string} location
 * @returns {{ id: string, name: string, bg: string, elements: any[] }}
 */
export function resolveScene(location) {
  const defId = normalizeLocationToDefId(location);
  const def = getSceneDef(defId);

  // ✅ 保持你 CinematicScene 现有用法：scene.bg / scene.elements
  return {
    id: def.id,
    name: def.name,
    bg: def.bg ?? "",
    elements: def.elements ?? [],
    connections: def.connections ?? [],
  };
}

/**
 * 新入口：用 SceneRef（GameState.world.currentScene）拿 SceneDef
 * @param {{kind:"def", id:string} | {kind:"instance", id:string}} sceneRef
 * @param {object} [opts]
 * @param {(instanceId:string)=>({defId:string}|undefined)} [opts.getInstance]  // 未来副本用
 * @returns {{ id: string, name: string, bg: string, elements: any[] }}
 */
export function resolveSceneRef(sceneRef, opts = {}) {
  if (!sceneRef) return null;
  if (!sceneRef || sceneRef.kind === "def") {
    const defId = sceneRef?.id ?? "cave";
    const def = getSceneDef(defId);
    return {
      id: def.id,
      name: def.name,
      bg: def.bg ?? "",
      elements: def.elements ?? [],
      connections: def.connections ?? [],
    };
  }

  // 未来：instance
  const inst = opts.getInstance?.(sceneRef.id);
  const def = getSceneDef(inst?.defId ?? "cave");
  return {
    id: def.id,
    name: def.name,
    bg: def.bg ?? "",
    elements: def.elements ?? [],
    connections: def.connections ?? [],
  };
}