import React from "react";
import { LogArea } from "@/components/LogArea";
import { getSceneConfig } from "@/scene/sceneConfig";

export function ProfilePanel({ player }: { player: any }) {
  return (
    <div className="scroll-card" style={{ color: "rgba(236,232,222,0.88)", lineHeight: 1.7 }}>
      <div>道号：{player?.name ?? "未知"}</div>
      <div>所在：{player?.location ?? "未知"}</div>
      <div>
        年龄：{player?.age ?? 0} / {player?.lifespan ?? 0}
      </div>
      <div style={{ opacity: 0.78, marginTop: 10 }}>
        （后续：境界/气血/灵气/功法会放在这里）
      </div>
    </div>
  );
}

export function BagPanel() {
  return (
    <div style={{ color: "rgba(236,232,222,0.78)", lineHeight: 1.6 }}>
      暂无物品。
    </div>
  );
}

export function MemoryPanel({ logs }: { logs: any[] }) {
  return <LogArea logs={logs} />;
}

export function TravelPanel({
  location,
  sendCommand,
  loading,
  onClose,
}: {
  location: string;
  sendCommand: (cmd: string) => void;
  loading: boolean;
  onClose: () => void;
}) {
  const scene = getSceneConfig(location);
  const exits = scene?.exits ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {exits.length === 0 ? (
        <div style={{ color: "rgba(236,232,222,0.78)", lineHeight: 1.6 }}>
          此处暂无可去之地。
        </div>
      ) : (
        exits.map((e) => (
          <button
            key={e.to}
            className="cinematic-choice"
            disabled={loading}
            onClick={() => {
              onClose();
              sendCommand(`go ${e.to}`);
            }}
          >
            {e.label ?? e.to}
          </button>
        ))
      )}
    </div>
  );
}
