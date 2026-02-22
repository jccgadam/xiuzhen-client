import React from 'react'
import './SubtitleOverlay.css'

export function SubtitleOverlay({ visible, lines = [], hint }) {
  if (!lines?.length) return null

  return (
    <div
      className={`subtitle-wrap ${visible ? 'is-visible' : 'is-hidden'}`}
      role="status"
      aria-live="polite"
    >
      <div className="subtitle-fog"></div>
      <div className="subtitle-text">
        {lines.slice(0, 3).map((t, i) => (
          <div key={i} className="subtitle-line">{t}</div>
        ))}
        {hint ? <div className="subtitle-hint">{hint}</div> : null}
      </div>
    </div>
  )
}