/**
 * 场景配置（数据驱动）
 * 每个场景可配置 bg、elements。elements 为该场景内的交互元素列表。
 * 新增元素：在 elements 添加配置 + 在 elementRegistry 注册组件
 */
const DEFAULT_BG = '/images/default.svg'

export const SCENE_CONFIG = {
  洞府: {
    id: '洞府',
    bg: '/images/dongfu_portrait.jpg',
    elements: [
      { type: 'cushion', id: 'cushion', image: '/images/putuan-removed.png', className: 'prop-cushion-btn' },
      { type: 'exitGlow', id: 'exitGlow' },
    ],
    exits: [
      { to: '坊市', label: '去坊市' },
      { to: '药园', label: '去药园' },
    ],
  },
  药园: {
    id: '药园',
    bg: '/images/yaoyuan.jpg',
    elements: [{ type: 'exitGlow', id: 'exitGlow' }],
    exits: [
      { to: '洞府', label: '回洞府' },
      { to: '坊市', label: '去坊市' },
    ],
  },
  坊市: {
    id: '坊市',
    bg: '/images/fangshi.png',
    elements: [{ type: 'exitGlow', id: 'exitGlow' }],
    exits: [
      { to: '洞府', label: '回洞府' },
      { to: '戒律堂', label: '去戒律堂' },
    ],
  },
  戒律堂: {
    id: '戒律堂',
    bg: '/images/jielutang.svg',
    elements: [{ type: 'exitGlow', id: 'exitGlow' }],
    exits: [
      { to: '坊市', label: '回坊市' },
    ],
  },
}

export const DEFAULT_LOCATION = '洞府'

/**
 * 根据 location 获取场景配置（支持未知地点回退到 default）
 */
export function getSceneConfig(location) {
  const loc = location || DEFAULT_LOCATION
  const config = SCENE_CONFIG[loc]
  if (config) return config
  return { id: loc, bg: DEFAULT_BG, elements: [], exits: [] }
}
