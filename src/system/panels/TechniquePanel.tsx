import React from "react";

export type TechniqueStage = "未入门" | "入门" | "小成" | "大成" | "圆满";
export type Technique = {
  id: string;
  name: string;
  school?: string;
  stage: TechniqueStage;
  progress01: number; // 0~1
};

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function TechniquePanel({
  active,
  allCount = 0,
  onOpenManage,
}: {
  active?: Technique | null;
  allCount?: number; // 未来有多功法时显示
  onOpenManage?: () => void; // 未来进入管理列表
}) {
  if (!active) {
    return (
      <div className="sys-empty">
        <div className="sys-empty-title">功法未启。</div>
        <div className="sys-empty-sub">可在机缘/师承中获得。</div>
      </div>
    );
  }

  const p = clamp01(active.progress01);
  const pct = Math.round(p * 100);

  return (
    <div className="tech-panel">
      <div className="tech-head">
        <div className="tech-title">{active.name}</div>
        <div className="tech-sub">
          {active.school ? <span>{active.school}</span> : <span>吐纳</span>}
          <span className="tech-dot">·</span>
          <span>{active.stage}</span>
          {allCount > 1 ? (
            <>
              <span className="tech-dot">·</span>
              <button className="tech-link tap" onClick={onOpenManage}>
                管理（{allCount}）
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="tech-progress">
        <div className="tech-bar">
          <div className="tech-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="tech-pct">{pct}%</div>
      </div>

      <div className="tech-hint">
        <div className="tech-hint-line">修行要诀：呼吸绵长，心神内守。</div>
        <div className="tech-hint-line dim">（后续：分支、心法槽位、搭配加成）</div>
      </div>
    </div>
  );
}