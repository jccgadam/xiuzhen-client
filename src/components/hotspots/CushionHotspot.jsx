import React from 'react'
import { useCushionMeditation } from '../../hooks/useCushionMeditation'

/**
 * 蒲团元素（洞府场景使用，由 sceneConfig.elements 配置）
 */
export function CushionHotspot({ config = {}, context }) {
  const { loc, time, taskDisabled, enqueue, onCommand } = context
  const { handleCushionTap } = useCushionMeditation({
    loc,
    time,
    taskDisabled,
    enqueue,
    onCommand,
  })

  return (
    <button
      type="button"
      className={config.className ?? 'prop-cushion-btn'}
      onClick={handleCushionTap}
      aria-label="蒲团"
    >
      <img src={config.image ?? '/images/putuan-removed.png'} className="prop-cushion" alt="" />
    </button>
  )
}
