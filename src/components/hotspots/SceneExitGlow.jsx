import { useEffect, useRef, useState } from 'react'
import { getSceneConfig } from '../../scene/sceneConfig'
import './SceneExitGlow.css'

/**
 * 右下角过光：手机端触摸友好
 * - 默认弱可见 + 呼吸动效
 * - 首次进入场景：引导闪一次
 * - 1 个 exit → 直接 go；多个 → 打开择路面板
 */
export function SceneExitGlow({ config = {}, context }) {
  const { loc, onCommand, onExit } = context
  const [nudge, setNudge] = useState(false)
  const nudgedRef = useRef(new Set())

  useEffect(() => {
    if (!loc) return
    if (nudgedRef.current.has(loc)) return

    nudgedRef.current.add(loc)
    setNudge(true)

    const t = window.setTimeout(() => setNudge(false), 1300)
    return () => window.clearTimeout(t)
  }, [loc])

  const scene = getSceneConfig(loc)
  const exits = scene?.exits ?? []

  const handleClick = () => {
    if (exits.length === 0) return
    if (exits.length === 1) {
      onCommand?.(`go ${exits[0].to}`)
    } else {
      onExit?.()
    }
  }

  if (exits.length === 0) return null

  return (
    <button
      type="button"
      className={`scene-exit-glow tap ${nudge ? 'is-nudge' : ''}`}
      aria-label="离开"
      onClick={handleClick}
    />
  )
}
