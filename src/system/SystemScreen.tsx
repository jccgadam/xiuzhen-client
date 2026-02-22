import React, { useEffect } from "react";
import "./SystemScreen.css";

export type SystemRightPane = "bag" | "memory";

const RIGHT_TITLES: Record<SystemRightPane, string> = {
  bag: "行囊",
  memory: "回忆",
};

export function SystemScreen({
  open,
  titleLeft = "人物",
  rightPane,
  onRightPaneChange,
  onClose,
  left,
  right,
}: {
  open: boolean;
  titleLeft?: string;
  rightPane: SystemRightPane;
  onRightPaneChange: (v: SystemRightPane) => void;
  onClose: () => void;
  left: React.ReactNode;
  right: React.ReactNode;
}) {

  const titleRight = RIGHT_TITLES[rightPane];
  return (
    <div
      className={`sys-screen ${open ? "is-open" : ""}`}
      role="dialog"
      aria-label="系统界面"
      aria-hidden={!open}
    >
      <div className="sys-veil" onClick={onClose} aria-hidden="true" />

      <div className="sys-shell" onClick={(e) => e.stopPropagation()}>
        <header className="sys-topbar">
          <button className="sys-close tap" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </header>

        <div className="sys-layout">
          <section className="sys-pane sys-pane-left" aria-label={titleLeft}>
            <div className="sys-pane-body">{left}</div>
          </section>

          <section className="sys-pane sys-pane-right" aria-label={titleRight}>
            <div className="sys-pane-head sys-pane-head-right">
              <div className="sys-tabs" role="tablist" aria-label="内观切换">
                <button
                  className={`sys-tab tap ${rightPane === "bag" ? "is-active" : ""}`}
                  onClick={() => onRightPaneChange("bag")}
                  role="tab"
                  aria-selected={rightPane === "bag"}
                >
                  行囊
                </button>
                <button
                  className={`sys-tab tap ${rightPane === "memory" ? "is-active" : ""}`}
                  onClick={() => onRightPaneChange("memory")}
                  role="tab"
                  aria-selected={rightPane === "memory"}
                >
                  回忆
                </button>
              </div>
            </div>

            <div className="sys-pane-body">{right}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
