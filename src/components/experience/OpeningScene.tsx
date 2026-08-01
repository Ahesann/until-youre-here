"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Moon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PetalField } from "@/components/effects/PetalField";
import { StarField } from "@/components/effects/StarField";
import { RealisticRose } from "@/components/effects/RealisticRose";

function RevealLine({
  text,
  delay,
  className,
}: {
  text: string;
  delay: number;
  className: string;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <p className={className}>{text}</p>;
  }

  return (
    <motion.p
      className={className}
      aria-label={text}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.11,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="inline-block"
          key={`${word}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          {word}
          {index < words.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function OpeningScene({
  onComplete,
  onMoon,
}: {
  onComplete: () => void;
  onMoon: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [activated, setActivated] = useState(false);

  const activate = () => {
    if (activated) {
      return;
    }

    setActivated(true);

    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Vibration is opportunistic feedback only.
      }
    }

    window.setTimeout(onComplete, reduceMotion ? 160 : 860);
  };

  return (
    <section className="opening-scene" aria-labelledby="opening-heading">
      <StarField expanded={activated} />
      <PetalField />
      <button
        type="button"
        className="moon-button"
        onClick={onMoon}
        aria-label="Send a thought to the moon"
      >
        <Moon aria-hidden="true" size={42} />
      </button>
      <div className="opening-skyline" aria-hidden="true">
        <svg viewBox="0 0 800 160" preserveAspectRatio="none">
          <path
            d="M0 143h42v-33h28V76h24v67h44V92h28V56h31v87h40V108h31V81h22v62h48V57h19v-28h25v114h52V97h30V69h26v74h47V52h28V22h33v121h38v-31h28V79h34v64h36V103h20v40h36v17H0z"
            fill="currentColor"
          />
        </svg>
      </div>
      <motion.div
        aria-hidden="true"
        className="opening-light-sweep"
        initial={{ opacity: 0, scale: 0.1 }}
        animate={
          activated
            ? { opacity: [0, 0.58, 0], scale: [0.1, 1.8, 2.7] }
            : undefined
        }
        transition={{ duration: reduceMotion ? 0.01 : 0.86, ease: "easeOut" }}
      />
      <div className="opening-content">
        <div className="flex justify-center mb-4 transition-transform duration-500 hover:scale-105">
          <RealisticRose size={140} />
        </div>
        <div className="opening-copy">
          <RevealLine
            text={siteConfig.copy.opening.firstLine}
            delay={0.2}
            className="opening-line page-heading"
          />
          <RevealLine
            text={siteConfig.copy.opening.secondLine}
            delay={1.85}
            className="opening-line secondary"
          />
        </div>
        <motion.div
          className="heart-cta-wrap"
          animate={activated ? { scale: reduceMotion ? 1 : 1.06 } : { scale: 1 }}
        >
          <button
            type="button"
            className="heart-cta"
            onClick={activate}
            aria-label={siteConfig.copy.opening.cta}
          >
            <span>{siteConfig.copy.opening.cta}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
