import React, { useMemo } from "react";
import "./SystemScreen.css";

export type SystemTabId = "bag" | "memory" | "manual" | "technique";

export type SystemTab = {
  id: SystemTabId;
  icon: React.ReactNode;
  ariaLabel: string;
};

export function SystemScreen({
  open,
  onClose,
  left,
  activeTab,
  onTabChange,
  right,
  tabs,
}: {
  open: boolean;
  onClose: () => void;
  left?: React.ReactNode;
  activeTab: SystemTabId;
  onTabChange: (id: SystemTabId) => void;
  right: React.ReactNode;
  tabs: SystemTab[];
}) {
  const hasLeft = !!left;

  const rootClass = useMemo(() => `sys-screen ${open ? "is-open" : ""}`, [open]);
  const layoutClass = useMemo(
    () => `sys-layout ${hasLeft ? "two-pane" : "one-pane"}`,
    [hasLeft]
  );

  return (
    <div className={rootClass} role="dialog" aria-label="内观" aria-hidden={!open}>
      <div className="sys-veil" onClick={onClose} aria-hidden="true" />

      <div className="sys-shell" onClick={(e) => e.stopPropagation()}>
        <header className="sys-topbar">
          <div className="sys-topbar-left" aria-label="系统入口">
            <div className="sys-tabs" role="tablist" aria-label="切换面板">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`sys-icon tap ${activeTab === t.id ? "is-active" : ""}`}
                  onClick={() => onTabChange(t.id)}
                  role="tab"
                  aria-selected={activeTab === t.id}
                  aria-label={t.ariaLabel}
                  title={t.ariaLabel}
                >
                  {t.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="sys-topbar-right">
            <button className="sys-close tap" onClick={onClose} aria-label="关闭" title="关闭">
              ×
            </button>
          </div>
        </header>

        <div className={layoutClass}>
          {hasLeft && (
            <section className="sys-pane sys-pane-left" aria-label="人物与功法（左）">
              <div className="sys-pane-scroll">{left}</div>
            </section>
          )}

          <section
            className={`sys-pane ${hasLeft ? "sys-pane-right" : "sys-pane-full"}`}
            aria-label="内容（右/全屏）"
          >
            <div className="sys-pane-scroll">{right}</div>
          </section>
        </div>
      </div>
    </div>
  );
}