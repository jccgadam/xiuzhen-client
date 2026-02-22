/**
 * 轻量场景状态机
 * - 状态 = location（当前场景）
 * - 根据状态返回：背景、热点列表、可用的交互
 * - 扩展点：可增加 entry/exit actions、子状态
 */

import { getSceneConfig } from './sceneConfig'

/**
 * 获取当前场景配置（供 CinematicScene 渲染）
 * @param {string} location
 * @returns {{ bg: string, id: string }}
 */
export function resolveScene(location) {
  return getSceneConfig(location)
}
