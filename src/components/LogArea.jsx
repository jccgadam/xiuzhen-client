import { useEffect, useRef } from 'react'

function getLogType(message) {
  if (message.startsWith('===')) return 'event-title'
  if (message.includes('注意到') && message.includes('在此处')) return 'npc'
  if (message.startsWith('你环顾') || message.startsWith('你静心') || message.startsWith('你上前') || message.startsWith('你四下') || message.startsWith('你走向')) return 'action'
  if (message.includes('："')) return 'dialogue'
  if (message.includes('获得') || message.includes('+')) return 'reward'
  if (message.includes('迈步向') || message.includes('来到了')) return 'movement'
  return ''
}

export function LogArea({ logs }) {
  const logRef = useRef(null)
  const prevLenRef = useRef(0)

  useEffect(() => {
    const el = logRef.current
    if (!el || !logs.length) return
    const prevLen = prevLenRef.current
    const newCount = logs.length - prevLen
    prevLenRef.current = logs.length
    if (newCount > 0) {
      const scrollToBottom = () => { el.scrollTop = el.scrollHeight }
      requestAnimationFrame(() => {
        scrollToBottom()
        requestAnimationFrame(scrollToBottom)
      })
    }
  }, [logs])

  return (
    <div className="log-area" ref={logRef}>
      {logs.map((log) => {
        const logType = getLogType(log.message)
        return (
          <div
            key={log.id}
            className={`log-entry ${log.isSystem ? 'system' : ''} ${logType}`}
          >
            {log.message}
          </div>
        )
      })}
    </div>
  )
}