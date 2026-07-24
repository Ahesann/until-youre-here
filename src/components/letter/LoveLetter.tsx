"use client";

/* eslint-disable react-hooks/set-state-in-effect -- opening the dialog resets the staged letter reveal state. */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { PhotoReveal } from "@/components/letter/PhotoReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function LoveLetter({
  open,
  onClose,
  restoreFocusTo,
  focusPhotoOnOpen,
}: {
  open: boolean;
  onClose: () => void;
  restoreFocusTo: HTMLElement | null;
  focusPhotoOnOpen?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const paragraphs = siteConfig.copy.letter.paragraphs;
  const allVisible = visibleParagraphs >= paragraphs.length;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setVisibleParagraphs(reduceMotion || focusPhotoOnOpen ? paragraphs.length : 1);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      if (focusPhotoOnOpen) {
        const photo = document.getElementById("letter-photo");
        if (photo) {
          photo.focus();
        } else {
          closeButtonRef.current?.focus();
        }
      } else {
        closeButtonRef.current?.focus();
      }
    }, 60);

    return () => {
      document.body.style.overflow = previousOverflow;
      restoreFocusTo?.focus();
    };
  }, [focusPhotoOnOpen, open, paragraphs.length, reduceMotion, restoreFocusTo]);

  useEffect(() => {
    if (!open || reduceMotion || allVisible) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setVisibleParagraphs((current) => Math.min(paragraphs.length, current + 1));
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [allVisible, open, paragraphs.length, reduceMotion, visibleParagraphs]);

  const visibleItems = useMemo(
    () => paragraphs.slice(0, visibleParagraphs),
    [paragraphs, visibleParagraphs],
  );

  const revealAll = () => setVisibleParagraphs(paragraphs.length);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.08 : 0.22 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            ref={dialogRef}
            className="letter-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-title"
            onKeyDown={handleKeyDown}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 38, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.08 : 0.32, ease: "easeOut" }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="icon-button letter-close"
              onClick={onClose}
              aria-label={siteConfig.copy.letter.closeLabel}
            >
              <X aria-hidden="true" size={20} />
            </button>
            <div className="letter-scroll">
              <div className="letter-content">
                <h2 id="letter-title" className="section-heading">
                  {siteConfig.copy.letter.leadIn}
                </h2>
                {visibleItems.map((paragraph, index) => (
                  <motion.p
                    key={`${paragraph}-${index}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
                {!allVisible ? (
                  <button type="button" className="quiet-button" onClick={revealAll}>
                    {siteConfig.copy.letter.revealAllLabel}
                  </button>
                ) : null}
                {allVisible ? (
                  <>
                    <div className="letter-signoff">
                      <span>{siteConfig.copy.letter.signOff}</span>
                      <br />
                      <span>{siteConfig.people.husbandName}</span>
                    </div>
                    <PhotoReveal />
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
