import type { SceneDef } from "../../scene/types";

export const SCENE_DEFS: Record<string, SceneDef> = {
  cave: {
    id: "cave",
    name: "洞府",
    connections: ["garden", "market"],
    bg: "/images/dongfu_portrait.jpg",
    elements: [
      {
        type: "cushion",
        id: "cushion",
        image: "/images/putuan-removed.png",
        className: "prop-cushion-btn",
      },
      {
        type: "exit",
        id: "exit_cave_to_market",
        kind: "physical",
        to: "market",
        label: "出洞",
        x: "95%",
        y: "90%",
        sizePx: 60,
        glow: 0.65,
      },
    ],
  },

  garden: {
    id: "garden",
    name: "药园",
    connections: ["cave", "market"],
    bg: "/images/yaoyuan.jpg",
    elements: [],
  },

  market: {
    id: "market",
    name: "坊市",
    connections: ["cave", "garden"],
    bg: "/images/fangshi.png",
    elements: [],
  },

  lawHall: {
    id: "lawHall",
    name: "戒律堂",
    connections: ["market"],
    bg: "/images/jielutang.svg",
    elements: [],
  },
} as const;

/** 取 def（带保护） */
export function getSceneDef(id: string): SceneDef {
  const def = (SCENE_DEFS as Record<string, SceneDef>)[id];
  if (!def) throw new Error(`Unknown SceneDefId: ${id}`);
  return def;
}
