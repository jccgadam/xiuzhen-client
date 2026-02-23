import React from "react";
import { useGame } from "@/game/GameContext";
import "./MemoryPanel.css";

export function MemoryPanel() {
  const { state } = useGame();
  const memory = state.memory ?? [];

  // 只取最近几段
  const recent = memory.slice(-5).reverse();

  if (recent.length === 0) {
    return (
      <div className="mem-void">
        <div className="mem-void-text">
          心湖未起波澜。
        </div>
      </div>
    );
  }

  return (
    <div className="mem-flow">
      {recent.map((m) => (
        <div key={m.id} className="mem-fragment">
          {(m.lines ?? []).map((line, i) => (
            <div key={i} className="mem-line">
              {line}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}