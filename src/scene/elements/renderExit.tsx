import React from "react";
import type { SceneExitDef } from "@/domain/scene/types";

type ElementContext = {
  loc: string;
  time: any;
  taskDisabled: boolean;
  enqueue?: (x: any) => void;
  onCommand?: (cmd: string) => void;
};

export function renderExit(exit: SceneExitDef, ctx: ElementContext) {
  switch (exit.kind) {
    case "physical":
      return <PhysicalExit key={exit.id} exit={exit} ctx={ctx} />;

    // 先立结构：未实现的先返回 null（不报错）
    case "narrative":
    case "cultivation":
    case "free":
    default:
      return null;
  }
}

function PhysicalExit({
  exit,
  ctx,
}: {
  exit: SceneExitDef;
  ctx: ElementContext;
}) {
  const size = exit.sizePx ?? 92;
  const glow = typeof exit.glow === "number" ? exit.glow : 0.6;

  return (
    <button
      type="button"
      className="scene-exit scene-exit-physical tap"
      style={
        {
          left: exit.x,
          top: exit.y,
          width: size,
          height: size,
          "--exit-glow": glow,
        } as React.CSSProperties
      }
      aria-label={exit.label ?? "离开"}
      title={exit.label ?? "离开"}
      disabled={ctx.taskDisabled}
      onClick={() => {
        if (!exit.to) return;

        // 轻提示（可选）
        ctx.enqueue?.({
          lines: ["你踏出一步。"],
          hint: exit.label ?? "离开",
        });

        // ✅ 统一走命令（你后端 / reducer 都能接）
        ctx.onCommand?.(`go ${exit.to}`);
      }}
    >
      <span className="scene-exit-core" aria-hidden="true" />
      <span className="scene-exit-ring" aria-hidden="true" />
      <span className="scene-exit-label" aria-hidden="true">
        {exit.label ?? "离开"}
      </span>
    </button>
  );
}