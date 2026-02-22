import { useEffect, useMemo, useState, useCallback } from 'react'
import './index.css'
import { SceneProvider } from './contexts/SceneContext'
import { CinematicScene } from './components/CinematicScene'
import { FeedbackProvider } from './feedback/feedbackContext'
import { SystemScreen } from './system/SystemScreen'
import { getSceneConfig } from './scene/sceneConfig'
import {
  ProfilePanel,
  BagPanel,
  MemoryPanel,
} from './system/panels/SystemScreenPanels'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

function uid() {
    return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function App() {
    const [player, setPlayer] = useState(null)
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)

    const [event, setEvent] = useState(null)

    const [systemOpen, setSystemOpen] = useState(false)
    const [rightPane, setRightPane] = useState('bag')
    const [travelOpen, setTravelOpen] = useState(false)
    const openSystem = useCallback(() => setSystemOpen(true), [])
    const closeSystem = useCallback(() => setSystemOpen(false), [])
    const openTravel = useCallback(() => setTravelOpen(true), [])
    const closeTravel = useCallback(() => setTravelOpen(false), [])

    const appendLogs = useCallback((messages, isSystem = false) => {
        if (!messages) return
        const arr = Array.isArray(messages) ? messages : [messages]
        setLogs(prev => [
            ...prev,
            ...arr.map(msg => ({ id: uid(), message: msg, isSystem })),
        ])
    }, [])

    const createNewPlayer = async () => {
        const name = '明月'
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/api/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, physique: 10, spirit: 10, insight: 10 }),
            })
            const data = await res.json()
            if (data.player) setPlayer(data.player)
            if (data.logs) appendLogs(data.logs, true)
        } catch (e) {
            appendLogs(`网络错误: ${e.message}`, true)
        } finally {
            setLoading(false)
        }
    }

    const fetchStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/status`)
            const data = await res.json()
            if (data.player) setPlayer(data.player)
            else await createNewPlayer()
        } catch (e) {
            appendLogs([`无法连接服务器: ${e.message}`, '请确保后端已启动 (npm start)'], true)
        }
    }

    const sendCommand = async (cmd) => {
        const c = (cmd ?? '').trim()
        if (!c) return
        setLoading(true)
        appendLogs(`> ${c}`)

        try {
            const res = await fetch(`${API_BASE}/api/command`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: c }),
            })
            const data = await res.json()

            if (data.error) {
                appendLogs(`错误: ${data.error}`, true)
                return
            }

            if (data.logs) appendLogs(data.logs)
            if (data.player) setPlayer(data.player)

            if (data.event) setEvent(data.event)
            else setEvent(null)

            if (data.player && data.player.age >= data.player.lifespan) {
                appendLogs('寿元耗尽，道化自然。游戏结束。', true)
            }
        } catch (e) {
            appendLogs(`网络错误: ${e.message}`, true)
        } finally {
            setLoading(false)
        }
    }

    const chooseEvent = async (eventId, choiceIndex) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/api/event_choose`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, choiceIndex }),
            })
            const data = await res.json()
            if (data.logs) appendLogs(data.logs)
            if (data.player) setPlayer(data.player)
            setEvent(null)
        } catch (e) {
            appendLogs(`网络错误: ${e.message}`, true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchStatus() }, [])

    const location = player?.location ?? '洞府'

    const activeTask = useMemo(() => {
        if (!event) return null
        return { eventId: event.eventId, choices: event.choices }
    }, [event])

    return (
        <>
            <FeedbackProvider>
                <SceneProvider player={player} location={location}>
                    <div className="game-container cinematic-root">
                        <CinematicScene
                            player={player}
                            location={location}
                            activeTask={activeTask}
                            onTaskChoose={chooseEvent}
                            taskDisabled={loading}
                            onCommand={sendCommand}
                            onExit={openTravel}
                            onOpenSystem={openSystem}
                            systemActive={systemOpen}
                        />
                    </div>
                </SceneProvider>
            </FeedbackProvider>

            <SystemScreen
                open={systemOpen}
                rightPane={rightPane}
                onRightPaneChange={setRightPane}
                onClose={closeSystem}
                left={<ProfilePanel player={player} />}
                right={rightPane === 'bag' ? <BagPanel /> : <MemoryPanel logs={logs} />}
            />

            {travelOpen && (
                <div className="cinematic-memory-overlay" role="dialog" aria-label="出行" onClick={closeTravel}>
                    <div className="cinematic-memory-card" onClick={(e) => e.stopPropagation()}>
                        <div className="cinematic-memory-head">
                            <div className="cinematic-memory-title">出行</div>
                            <button type="button" className="cinematic-memory-close tap" onClick={closeTravel} aria-label="关闭">×</button>
                        </div>
                        <div className="cinematic-memory-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {(getSceneConfig(location)?.exits ?? []).map((e) => (
                                <button
                                    key={e.to}
                                    className="cinematic-choice"
                                    disabled={loading}
                                    onClick={() => {
                                        closeTravel()
                                        sendCommand(`go ${e.to}`)
                                    }}
                                >
                                    {e.label ?? e.to}
                                </button>
                            ))}
                            <button className="cinematic-choice cinematic-task-btn-dim" onClick={closeTravel} type="button">取消</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
