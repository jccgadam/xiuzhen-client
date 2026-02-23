import React, { useMemo, useState, useCallback } from "react";
import { SystemScreen, type SystemTabId } from "./SystemScreen";
import { useGame } from "../game/GameContext";

import { resolveSceneRef } from "../scene/sceneMachine";
import { getSceneDef } from "@/domain/scene/registry";

import { ProfilePanel, BagPanel, MemoryPanel} from "./panels";
import { TechniquePanel } from "./panels/TechniquePanel";
export function SystemScreenContainer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state } = useGame();

  /** ✅ 三个tab：人物(=功法页)、行囊、回忆 */
  const [tab, setTab] = useState<SystemTabId>("technique");

  const player = state.characters?.[state.playerId] ?? null;

  const scene = useMemo(
    () => resolveSceneRef(state.world.currentScene),
    [state.world.currentScene]
  );
  const sceneDef = useMemo(() => getSceneDef(scene.id), [scene.id]);

  /** ✅ 回忆：先用 state.memory 映射到 LogArea 的格式 */
  const logs = useMemo(() => {
    // 兼容你 LogArea 的数据结构：{ id, message, isSystem }
    return (state.memory ?? []).map((m) => ({
      id: m.id,
      message: m.lines?.join("\n") ?? "",
      isSystem: true,
    }));
  }, [state.memory]);

  /** ✅ tabs（icon 先占位；之后换你的 SVG） */
  const tabs = useMemo(
    () => [
      { id: "technique" as SystemTabId, ariaLabel: "人物", icon: <span style={{ fontSize: 18 }}>⦿</span> },
      { id: "bag" as SystemTabId, ariaLabel: "行囊", icon: <span style={{ fontSize: 18 }}>🎒</span> },
      { id: "memory" as SystemTabId, ariaLabel: "回忆", icon: <span style={{ fontSize: 18 }}>📜</span> },
    ],
    []
  );

  /**
   * ✅ left pane 规则：
   * - 只有在人物页（technique）才显示 ProfilePanel
   * - 行囊/回忆：全屏 => left = undefined
   */
  const left = useMemo(() => {
    if (tab !== "technique") return undefined;
    if (!player) return undefined;
    return <ProfilePanel player={player} sceneDef={sceneDef} />;
  }, [tab, player, sceneDef]);

  /**
   * ✅ right pane：
   * - technique: 右侧显示功法
   * - bag: 全屏右侧显示行囊
   * - memory: 全屏右侧显示回忆
   */
  const right = useMemo(() => {
    if (tab === "bag") return <BagPanel />;
    if (tab === "memory") return <MemoryPanel />;
    // technique
    return <TechniquePanel />;
  }, [tab, logs]);

  const handleClose = useCallback(() => {
    setTab("technique");
    onClose();
  }, [onClose]);

  return (
    <SystemScreen
      open={open}
      onClose={handleClose}
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      left={left}
      right={right}
    />
  );
}