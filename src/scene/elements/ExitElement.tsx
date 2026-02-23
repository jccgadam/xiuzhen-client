import React from "react";
import type { SceneExitDef } from "@/domain/scene/types";
import { PhysicalExit } from "./PhysicalExit";

export function ExitElement({
  config,
  context,
}: {
  config: SceneExitDef;
  context: any;
}) {
  return renderExit(config, context);
}

function renderExit(exit: SceneExitDef, context: any) {
  console.log("[renderExit]", exit);
  switch (exit.kind) {
    case "physical":
      return <PhysicalExit key={exit.id} config={exit} context={context} />;

    case "narrative":
      return null;

    case "cultivation":
      return null;

    case "free":
      return null;

    default:
      return null;
  }
}