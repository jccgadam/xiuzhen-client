import React from 'react'
import { CushionHotspot } from '../components/hotspots/CushionHotspot'
import { ExitElement } from '../scene/elements/ExitElement'

/**
 * 元素类型 -> 组件 注册表
 * 新增元素类型时在此注册
 */
const REGISTRY = {
  cushion: CushionHotspot,
  exit: ExitElement,
}

export function getElementComponent(type) {
  return REGISTRY[type];
}
/**
 * 根据配置渲染场景元素
 */
export function renderSceneElement(elementConfig, context) {
  const Component = getElementComponent(elementConfig.type);
  if (!Component) return null
  return <Component key={elementConfig.id} config={elementConfig} context={context} />
}
