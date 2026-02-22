// 与后端 TimeSystem 一致
const DAYS_PER_YEAR = 360
const DAYS_PER_MONTH = 30
const MONTH_NAMES = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']

/**
 * 统一计算时间与余寿，避免 NaN，供 Header 时间显示、? 悬停、人物状态页共用
 * @param {object} player
 * @returns {{ year, month, day, monthName, totalDays, remainingYears, lifespan }}
 */
export function getTimeAndLifespan(player) {
  const rawDays = player?.timeDays ?? (player?.age ?? 0) * DAYS_PER_YEAR
  const totalDays = Number(rawDays) || 0
  const year = Math.floor(totalDays / DAYS_PER_YEAR) || 0
  const remainingDays = totalDays % DAYS_PER_YEAR
  const month = Math.floor(remainingDays / DAYS_PER_MONTH) + 1
  const day = (remainingDays % DAYS_PER_MONTH) + 1
  const monthName = MONTH_NAMES[month - 1] || '正月'
  const lifespan = Number(player?.lifespan) || 150
  const remainingYears = Math.max(0, (lifespan - year) || 0)
  return { year, month, day, monthName, totalDays, remainingYears, lifespan }
}

/** 余寿文案，用于 tooltip 或显示 */
export function getRemainingLifespanText(player) {
  const { remainingYears } = getTimeAndLifespan(player)
  return `余寿 ${remainingYears} 年`
}
