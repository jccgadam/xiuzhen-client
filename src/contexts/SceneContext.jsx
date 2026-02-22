import React, { createContext, useContext, useMemo } from 'react'

/**
 * 约定：
 * - timeSlot: 0~3
 *   0 dawn(清晨) / 1 noon(正午) / 2 dusk(午后/黄昏) / 3 night(入夜)
 */
const SceneContext = createContext(null)

function slotToTheme(slot) {
  if (slot === 0) return 'dawn'
  if (slot === 1) return 'noon'
  if (slot === 2) return 'dusk'
  return 'night'
}

function slotToName(slot) {
  return ['清晨', '正午', '午后', '入夜'][slot] ?? '清晨'
}

export function SceneProvider({ player, location, children }) {
  const value = useMemo(() => {
    const timeSlot = player?.timeSlot ?? 0
    const theme = slotToTheme(timeSlot)
    const slotName = slotToName(timeSlot)

    return {
      player,
      location: location ?? player?.location ?? '洞府',

      timeSlot,
      theme,
      slotName,

      // 你也可以把一些“全场景通用”的开关塞这里
      // e.g. isCinematic: true
    }
  }, [player, location])

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

export function useScene() {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used within <SceneProvider />')
  return ctx
}