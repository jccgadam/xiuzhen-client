// import { useRef, useState, useEffect, useMemo } from 'react'

// /**
//  * 洞府蒲团打坐逻辑
//  * - 每日一次（按 year-month-day）
//  * - 点击锁防连点
//  * - 入定视觉态 + 字幕节奏
//  */
// export function useCushionMeditation({ loc, time, taskDisabled, enqueue, onCommand }) {
//   const dayKey = useMemo(() => {
//     const y = time?.year ?? 0
//     const m = time?.month ?? time?.monthIndex ?? time?.monthName ?? ''
//     const d = time?.day ?? 1
//     return `${y}-${m}-${d}`
//   }, [time?.year, time?.month, time?.monthIndex, time?.monthName, time?.day])

//   const lastMeditateKeyRef = useRef(null)
//   const [isMeditating, setIsMeditating] = useState(false)
//   const tapLockUntilRef = useRef(0)

//   useEffect(() => {
//     setIsMeditating(false)
//   }, [loc, dayKey])

//   const isTapLocked = () => Date.now() < tapLockUntilRef.current
//   const lockTap = (ms) => {
//     tapLockUntilRef.current = Date.now() + ms
//   }

//   const handleCushionTap = useMemo(() => {
//     return () => {
//       if (taskDisabled) return
//       if (loc !== '洞府') return
//       if (isTapLocked()) return

//       lockTap(2500)

//       if (lastMeditateKeyRef.current === dayKey) {
//         enqueue({
//           lines: ['你已行一周天。', '今日不宜再强求。'],
//           hint: '待明日再试',
//         })
//         return
//       }

//       lastMeditateKeyRef.current = dayKey
//       setIsMeditating(true)

//       enqueue({
//         lines: ['你走近蒲团。', '盘膝而坐，吐纳如潮。'],
//         hint: '入定',
//       })

//       onCommand?.('meditate')

//       window.setTimeout(() => {
//         enqueue({
//           lines: ['灵息行于经脉，周天圆满。'],
//           hint: '气息渐稳',
//         })
//       }, 9000)

//       window.setTimeout(() => {
//         setIsMeditating(false)
//       }, 12000)
//     }
//   }, [loc, dayKey, taskDisabled, enqueue, onCommand])

//   return { handleCushionTap, isMeditating }
// }

import { useRef, useState, useEffect, useMemo } from "react";
import { useFeedback } from "../feedback/useFeedback";
import { SCENES, ACTIVITIES, NARRATIVE_TYPES } from "@/types/types";

/**
 * 洞府蒲团打坐逻辑
 */
export function useCushionMeditation({ loc, time, taskDisabled, onCommand }) {
  const { emit } = useFeedback();

  const dayKey = useMemo(() => {
    const y = time?.year ?? 0;
    const m = time?.month ?? time?.monthIndex ?? time?.monthName ?? "";
    const d = time?.day ?? 1;
    return `${y}-${m}-${d}`;
  }, [time?.year, time?.month, time?.monthIndex, time?.monthName, time?.day]);

  const lastMeditateKeyRef = useRef<string | null>(null);
  const [isMeditating, setIsMeditating] = useState(false);
  const tapLockUntilRef = useRef(0);

  useEffect(() => {
    setIsMeditating(false);
  }, [loc, dayKey]);

  const isTapLocked = () => Date.now() < tapLockUntilRef.current;
  const lockTap = (ms: number) => {
    tapLockUntilRef.current = Date.now() + ms;
  };

  const handleCushionTap = useMemo(() => {
    return () => {
      if (taskDisabled) return;
      if (loc !== "洞府") return;
      if (isTapLocked()) return;

      lockTap(2500);

      // 当天已打坐：给 L2 状态反馈
      if (lastMeditateKeyRef.current === dayKey) {
        emit({
          scene: SCENES.CAVE,
          activity: ACTIVITIES.CULTIVATE,
          type: NARRATIVE_TYPES.FATIGUE_LIMIT,
          intensity: 2,
        });
        return;
      }

      lastMeditateKeyRef.current = dayKey;
      setIsMeditating(true);

      // 入定引导：如果你还没定义对应 NarrativeType
      // 先用 ERROR/自定义 type 占位，或先不发（等 Step3 做引导层）
      emit({
        scene: SCENES.CAVE,
        activity: ACTIVITIES.CULTIVATE,
        type: "meditation_start",
        intensity: 1,
      });

      onCommand?.("meditate");

      window.setTimeout(() => {
        // 一周天完成（L1）
        emit({
          scene: SCENES.CAVE,
          activity: ACTIVITIES.CULTIVATE,
          type: NARRATIVE_TYPES.CYCLE_COMPLETE,
          intensity: 1,
          data: { cycles: 1 },
          groupKey: "cultivate/cycle",
        });
      }, 9000);

      window.setTimeout(() => {
        setIsMeditating(false);
      }, 12000);
    };
  }, [loc, dayKey, taskDisabled, onCommand, emit]);

  return { handleCushionTap, isMeditating };
}