import { useEffect, useRef, useState } from 'react'

export function useSubtitleQueue() {
  const queueRef = useRef([])
  const [current, setCurrent] = useState(null)
  const [visible, setVisible] = useState(false)

  const timers = useRef({ a: null, b: null })

  const clearTimers = () => {
    if (timers.current.a) clearTimeout(timers.current.a)
    if (timers.current.b) clearTimeout(timers.current.b)
    timers.current = { a: null, b: null }
  }

  const pump = () => {
    if (current) return
    const next = queueRef.current.shift()
    if (!next) return
    setCurrent(next)
    setVisible(true)

    clearTimers()
    timers.current.a = setTimeout(() => {
      setVisible(false)
      timers.current.b = setTimeout(() => {
        setCurrent(null)
      }, next.hideMs ?? 260)
    }, next.showMs ?? 2200)
  }

  useEffect(() => {
    if (!current) pump()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  const enqueue = (item) => {
    if (!item?.lines?.length) return
    queueRef.current.push(item)
    if (!current) pump()
  }

  return { current, visible, enqueue }
}