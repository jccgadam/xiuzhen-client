import { useMemo, useState, useCallback } from "react";
import "./index.css";

import { GameProvider, useGame } from "./game/GameContext";
import { FeedbackProvider } from "./feedback/feedbackContext";

import { SceneProvider } from "./contexts/SceneContext";
import { CinematicScene } from "./components/CinematicScene";
import { resolveSceneRef } from "./scene/sceneMachine";
import { SystemScreenContainer } from "./system/SystemScreenContainer";
/**
 * App 只负责挂 Provider + 组织布局
 * - 不放 API（数据层未来单独做）
 * - 不放回忆面板（你说已经在 layout 里）
 */
export default function App() {
  return (
    <GameProvider>
      <FeedbackProvider>
        <AppInner />
      </FeedbackProvider>
    </GameProvider>
  );
}

function AppInner() {
  const { state } = useGame();
  const [systemActive, setSystemActive] = useState(false);
  // ✅ 暂时不连后端：player 先留空（或做一个 mock）
  const [player] = useState(null);
  const [systemOpen, setSystemOpen] = useState(false);
  const openSystem = useCallback(() => setSystemOpen(true), []);
  const closeSystem = useCallback(() => setSystemOpen(false), []);

  // ✅ 当前 sceneDef（含 name/bg/elements）
  const scene = useMemo(
    () => resolveSceneRef(state.world.currentScene),
    [state.world.currentScene]
  );

  // SceneProvider 仍用于 timeSlot/theme（location 用 scene.name）
  const locationForUI = scene?.name ?? "—";

  // 暂时 mock：CultivationLayout 需要 player / mainTechnique
  const mockPlayer = player ?? {
    name: "—",
    realm: "—",
    levelLabel: "—",
    qiPercent: 0,
  };
  const mainTechnique = { name: "—", stage: "—", progress: 0 };
  const techniques = [];

  return (
    <SceneProvider player={player} location={locationForUI}>
      <div className="game-container cinematic-root">
        <SystemScreenContainer open={systemOpen} onClose={closeSystem} />
        <CinematicScene
          player={player}
          location={locationForUI}
          activeTask={null}
          onTaskChoose={() => {}}
          taskDisabled={false}
          onOpenSystem={openSystem}
          systemActive={systemActive}
          onCommand={() => {}}
        />
      </div>
    </SceneProvider>
  );
}