export type SceneExitKind = "physical" | "narrative" | "cultivation" | "free";

export type CushionElementDef = {
  type: "cushion";
  id: string;
  image: string;
  className?: string;
};

export type SceneExitDef = {
  type: "exit";
  id: string;

  kind: SceneExitKind;

  to?: string;
  label?: string;

  x: string; // 百分比推荐
  y: string;

  sizePx?: number;
  glow?: number;
};

export type SceneElementDef =
  | CushionElementDef
  | SceneExitDef;

export type SceneDef = {
  id: string;
  name: string;
  connections: string[];
  bg: string;
  elements: SceneElementDef[];
};