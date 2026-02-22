import React, { useState, useEffect } from 'react'

export function CinematicTaskOverlay({ activeTask, onTaskChoose, taskDisabled }) {
  const [taskAccepted, setTaskAccepted] = useState(null)

  useEffect(() => {
    if (!activeTask) setTaskAccepted(null)
  }, [activeTask?.eventId])

  return (
    <div className="cinematic-task">
      {taskAccepted === null ? (
        <div className="cinematic-task-row">
          <div className="cinematic-task-title">是否接受任务？</div>
          <div className="cinematic-task-actions">
            <button
              type="button"
              className="cinematic-task-btn"
              onClick={() => setTaskAccepted(true)}
              disabled={taskDisabled}
            >
              接受
            </button>
            <button
              type="button"
              className="cinematic-task-btn cinematic-task-btn-dim"
              onClick={() => {
                const choices = activeTask.choices || []
                const declineIndex = choices.findIndex((c) => c.id === 'decline')
                if (declineIndex >= 0) onTaskChoose?.(activeTask.eventId, declineIndex)
              }}
              disabled={taskDisabled}
            >
              拒绝
            </button>
          </div>
        </div>
      ) : (
        <div className="cinematic-task-choices">
          {(activeTask.choices || [])
            .filter((c) => c.id !== 'decline')
            .map((choice) => {
              const choices = activeTask.choices || []
              const idx = choices.findIndex((c) => c.id === choice.id)
              return (
                <button
                  key={choice.id}
                  type="button"
                  className="cinematic-choice"
                  disabled={taskDisabled}
                  onClick={() => idx >= 0 && onTaskChoose?.(activeTask.eventId, idx)}
                >
                  <span className="cinematic-dot" aria-hidden="true" />
                  <span className="cinematic-choice-text">{choice.text}</span>
                </button>
              )
            })}
        </div>
      )}
    </div>
  )
}
