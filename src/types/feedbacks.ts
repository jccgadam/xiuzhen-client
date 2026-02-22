// xiuzhen-web/client/src/types/feedbacks.ts

// =========================
// Feedback / Narrative Types (Extensible)
// =========================

/**
 * 反馈强度（存在感等级）：
 * 1: 极轻（气息/提示）
 * 2: 轻（状态/限制）
 * 3: 中（进展/变化）
 * 4: 强（重大事件）
 * 5: 极强（天劫/濒死/寿元耗尽等）
 */
export type FeedbackIntensity = 1 | 2 | 3 | 4 | 5;

/**
 * SceneId / ActivityId / NarrativeEventType 采用 string：
 * - 防止后期 union 无限膨胀
 * - 仍通过常量表提供 autocomplete 与“推荐值”
 */
export type SceneId = string;
export type ActivityId = string;
export type NarrativeEventType = string;

/** 推荐的场景常量（可继续加） */
export const SCENES = {
  CAVE: "cave",
  MARKET: "market",
  SECT: "sect",
  FORMATION: "formation",
  WILDERNESS: "wilderness",
  HOME: "home",
  UNKNOWN: "unknown",
} as const;

/** 推荐的行为常量（可继续加） */
export const ACTIVITIES = {
  CULTIVATE: "cultivate",
  COMBAT: "combat",
  TRADE: "trade",
  DIALOGUE: "dialogue",
  EXPLORE: "explore",
  CRAFT: "craft",
  REST: "rest",
  SYSTEM: "system",
} as const;

/** 推荐的叙事事件类型常量（可继续加） */
export const NARRATIVE_TYPES = {
  // cultivation
  CYCLE_COMPLETE: "cycle_complete",      // 行一周天
  MEDITATION_START: "meditation_start",  // 打坐入定
  FATIGUE_LIMIT: "fatigue_limit",        // 今日不宜再强求
  QI_GAIN: "qi_gain",                    // 灵气增长
  REALM_BREAKTHROUGH: "realm_breakthrough", // 境界突破

  // combat
  INJURY_TAKEN: "injury_taken",          // 受伤
  CRITICAL_HIT: "critical_hit",          // 暴击

  // inventory/economy
  ITEM_OBTAINED: "item_obtained",        // 获得物品
  GOLD_SPENT: "gold_spent",              // 花费

  // fate/story
  CHOICE_LOCKED_IN: "choice_locked_in",  // 选择已定（因果）
  TIME_PASSED: "time_passed",            // 时间流逝

  // fallback
  ERROR: "error",
} as const;

/**
 * 叙事层：描述“发生了什么”，不关心怎么显示
 * - scene: 在哪里
 * - activity: 在做什么
 * - type: 发生了什么（稳定语义键）
 */
export interface NarrativeEvent {
  scene: SceneId;
  activity: ActivityId;

  type: NarrativeEventType;
  intensity: FeedbackIntensity;

  /**
   * 事件数据：用于文案模板、数值、变体选择等
   * 示例：
   * - cycle_complete: { cycles: 1 }
   * - qi_gain: { amount: 3, unit: "qi" }
   * - item_obtained: { itemId, name, qty }
   */
  data?: Record<string, unknown>;

  /** 逻辑层时间（可选） */
  atMs?: number;

  /**
   * 归并/限频用（可选）
   * - 同一组事件可合并显示，例如连续 qi_gain
   * - 示例：`groupKey: "cultivate/qi_gain"`
   */
  groupKey?: string;
}

/** 表现层：摆放位置 */
export type FeedbackPlacement =
  | "leftBottom"
  | "centerLow"
  | "center"
  | "rightBottom";

/** 表现层：动画预设 */
export type AnimationPreset =
  | "whisper"   // 极轻（L1）
  | "breath"    // 轻（L2）
  | "float"     // 中（L3）
  | "impact";   // 强（L4+）

/** 表现层：最终要画出来的内容（通常由 Resolver 生成） */
export interface VisualSpec {
  lines: string[]; // 1-2行（建议最多2行，保持克制）
  placement: FeedbackPlacement;
  animation: AnimationPreset;

  /** 样式变体：例如“冷月/金色突破”等（给 CSS class 用） */
  variant?: string;

  /** 停留时间（不含 fadeIn/out） */
  ttlMs?: number;
}

/** 最终入队条目：Narrative + Visual */
export interface FeedbackItem {
  id: string;
  narrative: NarrativeEvent;
  visual: VisualSpec;

  createdAtMs: number;

  /**
   * 调度策略（可选）
   * priority 越大越优先，可能打断当前（由调度器决定）
   */
  priority?: number;

  /**
   * 防刷屏（可选）
   * 同 groupKey 或同 type 可设置冷却
   */
  cooldownMs?: number;
}

/** Theme（表现统一参数，后续给 FeedbackLayer 用） */
export interface FeedbackTheme {
  fadeInMs: number;
  fadeOutMs: number;
  defaultTtlMs: number;

  fontFamily: string;
  color: string;
  letterSpacingEm: number;
  lineHeight: number;

  /** 安全边距：避免贴边/遮挡关键物体 */
  safePaddingPx: number;
}