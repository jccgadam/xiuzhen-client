import { useMemo } from "react";
import { useFeedback } from "./useFeedback";

function placementStyle(
  placement: string,
  safe: number
): React.CSSProperties {
  switch (placement) {
    case "center":
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        maxWidth: "78%",
      };
    case "centerLow":
      return {
        left: "50%",
        bottom: safe + 90, // 给底部 UI 留空间（你可按实际 HUD 微调）
        transform: "translateX(-50%)",
        textAlign: "center",
        maxWidth: "78%",
      };
    case "rightBottom":
      return {
        right: safe,
        bottom: safe,
        textAlign: "right",
        maxWidth: "60%",
      };
    case "leftBottom":
    default:
      return {
        left: safe,
        bottom: safe,
        textAlign: "left",
        maxWidth: "60%",
      };
  }
}

export function FeedbackLayer() {
  const { state, theme } = useFeedback();
  const cur = state.current;
  const safe = theme.safePaddingPx ?? 18;

  const cls = useMemo(() => {
    if (!cur) return "";
    return `feedback-bubble feedback-${cur.visual.animation}`;
  }, [cur?.visual?.animation]);

  const posStyle = useMemo(
    () => (cur ? placementStyle(cur.visual.placement, safe) : {}),
    [cur?.visual?.placement, safe]
  );

  if (!cur) return null;

  const ttl = cur.visual.ttlMs ?? theme.defaultTtlMs;

  // 让每条反馈切换时动画重新播放
  return (
    <div className="feedback-layer" aria-hidden="true">
      <div
        key={cur.id}
        className={cls}
        style={{
          ...posStyle,
          // 动画时长由 theme + ttl 决定
          ["--fade-in-ms" as any]: `${theme.fadeInMs}ms`,
          ["--stay-ms" as any]: `${ttl}ms`,
          ["--fade-out-ms" as any]: `${theme.fadeOutMs}ms`,
          ["--font-family" as any]: theme.fontFamily,
          ["--text-color" as any]: theme.color,
          ["--letter-spacing" as any]: `${theme.letterSpacingEm}em`,
          ["--line-height" as any]: String(theme.lineHeight),
        }}
      >
        {cur.visual.lines.slice(0, 2).map((line, idx) => (
          <div key={idx} className="feedback-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
