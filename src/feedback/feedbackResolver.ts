
import type {
    NarrativeEvent,
    VisualSpec,
    AnimationPreset,
    FeedbackPlacement,
    FeedbackTheme,
} from "@/types/types";
import { NARRATIVE_TYPES } from "@/types/types";

function animationByIntensity(intensity: number): AnimationPreset {
    if (intensity <= 1) return "whisper";
    if (intensity === 2) return "breath";
    if (intensity === 3) return "float";
    return "impact"; // 4-5
}

function placementByIntensity(intensity: number): FeedbackPlacement {
    if (intensity <= 2) return "leftBottom";
    if (intensity === 3) return "centerLow";
    return "center";
}

function ttlByIntensity(intensity: number, theme: FeedbackTheme): number {
    if (intensity <= 1) return Math.max(1600, theme.defaultTtlMs - 600);
    if (intensity === 2) return theme.defaultTtlMs;
    if (intensity === 3) return theme.defaultTtlMs + 800;
    return theme.defaultTtlMs + 1400; // 4-5
}

export function resolveVisual(event: NarrativeEvent, theme: FeedbackTheme): VisualSpec {
    const intensity = event.intensity;

    const base: Omit<VisualSpec, "lines"> = {
        placement: placementByIntensity(intensity),
        animation: animationByIntensity(intensity),
        ttlMs: ttlByIntensity(intensity, theme),
        variant: undefined,
    };

    switch (event.type) {
        case NARRATIVE_TYPES.CYCLE_COMPLETE: {
            const cycles = Number(event.data?.cycles ?? 1);
            return {
                ...base,
                lines: cycles > 1 ? [`行至${cycles}周天。`] : ["一周天已行。"],
            };
        }

        case NARRATIVE_TYPES.FATIGUE_LIMIT: {
            return { ...base, lines: ["今日不宜再强求。"] };
        }
        case NARRATIVE_TYPES.MEDITATION_START: {
            return {
                ...base,
                placement: "leftBottom",
                animation: "whisper",
                ttlMs: Math.max(1800, theme.defaultTtlMs - 400),
                variant: "meditation",
                lines: ["你走近蒲团。", "盘膝而坐，吐纳如潮。"],
            };
        }
        case NARRATIVE_TYPES.QI_GAIN: {
            const amount = event.data?.amount;
            const line =
                typeof amount === "number" ? `灵气略增（+${amount}）。` : "灵气入体。";
            return { ...base, lines: [line] };
        }

        case NARRATIVE_TYPES.REALM_BREAKTHROUGH: {
            const realm = (event.data?.realm as string | undefined) ?? "境界";
            return {
                ...base,
                placement: "center",
                animation: "impact",
                ttlMs: ttlByIntensity(Math.max(intensity, 4), theme),
                variant: "breakthrough",
                lines: ["瓶颈松动。", `${realm}已破。`],
            };
        }

        case NARRATIVE_TYPES.ITEM_OBTAINED: {
            const name = (event.data?.name as string | undefined) ?? "物品";
            const qty = event.data?.qty;
            const suffix = typeof qty === "number" && qty > 1 ? ` ×${qty}` : "";
            return { ...base, lines: [`获得：${name}${suffix}`] };
        }

        case NARRATIVE_TYPES.TIME_PASSED: {
            const days = Number(event.data?.days ?? event.data?.day ?? 1);
            return { ...base, lines: [days > 1 ? `光阴流转（${days}日）。` : "光阴流转。"] };
        }

        case NARRATIVE_TYPES.ERROR:
        default: {
            return { ...base, lines: ["……"] };
        }
    }
}