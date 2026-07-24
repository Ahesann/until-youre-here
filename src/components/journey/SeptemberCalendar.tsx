"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarHeart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getArrivalCalendar } from "@/lib/countdown";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { createSeededRandom } from "@/lib/seededRandom";

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

export function SeptemberCalendar() {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const calendar = useMemo(
    () =>
      getArrivalCalendar(
        siteConfig.dates.arrivalDateISO,
        siteConfig.dates.arrivalTimeZone,
      ),
    [],
  );
  const burstParticles = useMemo(() => {
    const random = createSeededRandom(1500 + burstKey);
    return Array.from({ length: reduceMotion ? 3 : 7 }, (_, index) => ({
      id: index,
      dx: (random() - 0.5) * 78,
      dy: -22 - random() * 64,
      rotate: (random() - 0.5) * 60,
    }));
  }, [burstKey, reduceMotion]);

  return (
    <section className="calendar-card glass" aria-labelledby="calendar-title">
      <motion.button
        type="button"
        className="calendar-button"
        onClick={() => {
          setRevealed((current) => !current);
          setBurstKey((current) => current + 1);
        }}
        aria-expanded={revealed}
        aria-describedby={revealed ? "calendar-message" : undefined}
        animate={
          revealed && !reduceMotion
            ? { rotate: -1.2, scale: 1.015 }
            : { rotate: 0, scale: 1 }
        }
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <div className="calendar-header">
          <h2 id="calendar-title" className="calendar-title">
            {calendar.label}
          </h2>
          <CalendarHeart aria-hidden="true" size={24} color="var(--gold-300)" />
        </div>
        <div className="calendar-grid" aria-hidden="true">
          {weekdays.map((weekday, index) => (
            <span key={`${weekday}-${index}`} className="calendar-weekday">
              {weekday}
            </span>
          ))}
          {calendar.days.map((day) => (
            <motion.span
              key={day.key}
              className={day.isArrivalDay ? "calendar-day arrival-day" : "calendar-day"}
              animate={
                day.isArrivalDay && revealed && !reduceMotion
                  ? { scale: [1, 1.18, 1], boxShadow: "0 0 32px rgb(234 208 154 / 0.78)" }
                  : undefined
              }
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {day.day ?? ""}
            </motion.span>
          ))}
        </div>
      </motion.button>
      <AnimatePresence>
        {burstKey > 0
          ? burstParticles.map((particle) => (
              <motion.span
                key={`${burstKey}-${particle.id}`}
                className="calendar-petal"
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 0.85, 0],
                  x: particle.dx,
                  y: particle.dy,
                  rotate: particle.rotate,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.22 : 0.82, ease: "easeOut" }}
              />
            ))
          : null}
        {revealed ? (
          <motion.p
            id="calendar-message"
            className="calendar-message"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {siteConfig.copy.calendar.revealMessage}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
