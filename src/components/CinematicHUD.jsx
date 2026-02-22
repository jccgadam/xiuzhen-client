import React from 'react'

export function CinematicHUD({ loc, time }) {
  return (
    <div className="cinematic-hud">
      <div className="cinematic-hud-left">
        <div className="cinematic-place">
          {loc}
          <span className="cinematic-sep"> · </span>
          <span className="cinematic-time">
            第{time?.year ?? 0}年 {time?.day ?? 1}日
          </span>
        </div>
      </div>
    </div>
  )
}
