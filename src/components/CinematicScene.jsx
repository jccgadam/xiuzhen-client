import { useMemo } from 'react'
import { getTimeAndLifespan } from '../utils/playerTime'
import { SubtitleOverlay } from './SubtitleOverlay'
import { CinematicHUD } from './CinematicHUD'
import { CinematicTaskOverlay } from './CinematicTaskOverlay'
import { resolveScene } from '../scene/sceneMachine'
import { renderSceneElement } from '../scene/elementRegistry'
import { useSubtitleQueue } from '../hooks/useSubtitleQueue'
import { SystemSigil } from './SystemSigil'
import './CinematicScene.css'
import { FeedbackLayer } from '../feedback/FeedbackLayer'
import '../feedback/feedback.css'
/**
 * 电影感场景层（手机优先）
 * - 背景、元素均由 sceneConfig 驱动
 * - 每个场景可配置不同 elements（如洞府蒲团、药园灵草等）
 */
export function CinematicScene({
  player,
  location,
  activeTask,
  onTaskChoose,
  taskDisabled,
  onCommand,
  onExit,
  onOpenSystem,
  systemActive,
}) {
  const loc = location || '洞府'
  const time = player ? getTimeAndLifespan(player) : null

  const scene = useMemo(() => resolveScene(loc), [loc])
  const { current, visible, enqueue } = useSubtitleQueue()

  const elementContext = useMemo(
    () => ({ loc, time, taskDisabled, enqueue, onCommand, onExit }),
    [loc, time, taskDisabled, enqueue, onCommand, onExit]
  )

  return (
    <section className={`cinematic-scene loc-${loc}${systemActive ? ' system-active' : ''}`} aria-label="cinematic scene">
      <div
        className="cinematic-bg"
        style={{ '--bg-url': `url(${scene.bg})` }}
      />

      <CinematicHUD loc={loc} time={time} player={player} />
      {(scene.elements ?? []).map((el) => renderSceneElement(el, elementContext))}
      {onOpenSystem && <SystemSigil onActivate={onOpenSystem} />}

      {current && <SubtitleOverlay visible={visible} lines={current.lines} hint={current.hint} />}

      {activeTask && (
        <CinematicTaskOverlay
          activeTask={activeTask}
          onTaskChoose={onTaskChoose}
          taskDisabled={taskDisabled}
        />
      )}
      <FeedbackLayer />
    </section>
  )
}
