// src/domain/character/base.ts

/** 角色唯一 ID */
export type CharacterId = string;

/** 所有可扩展模块的 key */
export type AspectKey = string;

/** 基础时间戳/版本字段（方便未来迁移） */
export interface EntityMeta {
  createdAtMs: number;
  updatedAtMs: number;
  version: number;
}

/**
 * ✅ 人物状态“基类”
 * - 纯数据：可序列化、可放 reducer
 * - 用 aspects 承载未来可扩展信息
 */
export interface CharacterBase {
  id: CharacterId;
  name: string;

  /** 世界位置（先用 string，后续可换 SceneId） */
  location: string;

  /** 通用元信息 */
  meta: EntityMeta;

  /**
   * 可扩展模块容器
   * - cultivation / inventory / vitals / resources / flags / relationships ...
   */
  aspects: Record<AspectKey, unknown>;
}

/** 创建一个默认的 CharacterBase（不会绑定具体修为系统） */
export function createCharacterBase(input: {
  id: CharacterId;
  name: string;
  location?: string;
}): CharacterBase {
  const now = Date.now();
  return {
    id: input.id,
    name: input.name,
    location: input.location ?? "洞府",
    meta: { createdAtMs: now, updatedAtMs: now, version: 1 },
    aspects: {},
  };
}

/** 安全读 Aspect（带类型断言） */
export function getAspect<T>(
  ch: CharacterBase,
  key: string
): T | undefined {
  return ch.aspects[key] as T | undefined;
}

/** 写入/更新 Aspect（不可变） */
export function setAspect<T>(
  ch: CharacterBase,
  key: string,
  value: T
): CharacterBase {
  const now = Date.now();
  return {
    ...ch,
    meta: { ...ch.meta, updatedAtMs: now, version: ch.meta.version + 1 },
    aspects: { ...ch.aspects, [key]: value },
  };
}