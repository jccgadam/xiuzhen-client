import React, { useState } from "react";
import "./SystemSigil.css";

type Props = {
  onActivate: () => void;
};

/**
 * 阴阳法印：入内观的触发器
 * 触动法印 → 波纹扩散 → 神识展开
 */
export function SystemSigil({ onActivate }: Props) {
  const [ripple, setRipple] = useState(false);

  const handleClick = () => {
    setRipple(true);
    window.setTimeout(() => {
      onActivate();
      setRipple(false);
    }, 280);
  };

  return (
    <button
      type="button"
      className={`system-sigil tap ${ripple ? "is-rippling" : ""}`}
      onClick={handleClick}
      aria-label="入内观"
    >
      ☯
      <span className="sigil-ripple" aria-hidden />
    </button>
  );
}
