import React from "react";
import type { SceneExitDef } from "@/domain/scene/types";
import "./exit.css";
import { useFeedback } from "@/feedback/useFeedback";
import { NARRATIVE_TYPES } from "@/types/feedbacks";

export function PhysicalExit({
  config,
  context,
}: {
  config: SceneExitDef;
  context: {
    taskDisabled?: boolean;
    enqueue?: (x: any) => void;
    onCommand?: (cmd: string) => void;
  };
}) {
  const size = config.sizePx ?? 92;
  const glow = typeof config.glow === "number" ? config.glow : 0.6;
  const { emit } = useFeedback();

  return (
    <button
      type="button"
      className="scene-exit scene-exit-physical tap"
      style={
        {
          left: config.x,
          top: config.y,
          width: size,
          height: size,
          "--exit-glow": glow,
        } as React.CSSProperties
      }
      aria-label={config.label ?? "离开"}
      title={config.label ?? "离开"}
      disabled={!!context.taskDisabled}
      onClick={() => {
        if (!config.to) return;
        emit({
          scene: "scene_cave",
          activity: "activity_exit",
          type: NARRATIVE_TYPES.TRAVEL_START,
          data: { label: config.label ?? "离开" },
          intensity: 1,
        });
        context.onCommand?.(`go ${config.to}`);
      }}
    >
      <span className="scene-exit-core" aria-hidden="true" />
      <span className="scene-exit-ring" aria-hidden="true" />
      {/* <span className="scene-exit-label" aria-hidden="true">
        {config.label ?? "离开"}
      </span> */}
    </button>
  );
}