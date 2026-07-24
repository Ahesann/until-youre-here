"use client";

import { FormEvent, useId, useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { siteConfig } from "@/config/site";

export function RomanticAccessScreen({
  onAccepted,
}: {
  onAccepted: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const inputId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedAnswer = answer.trim().toLocaleLowerCase("en-GB");
    const accepted = siteConfig.access.acceptedAnswers.some(
      (candidate) =>
        candidate.trim().toLocaleLowerCase("en-GB") === normalizedAnswer,
    );

    if (!accepted) {
      setError(siteConfig.access.incorrectAnswerMessage);
      return;
    }

    setError("");
    onAccepted();
  };

  return (
    <section className="access-screen" aria-labelledby="access-heading">
      <motion.form
        className="access-panel glass"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Heart aria-hidden="true" size={30} color="var(--gold-300)" />
        <h1 id="access-heading" className="section-heading mt-4">
          Until You’re Here
        </h1>
        <label htmlFor={inputId} className="mt-5">
          {siteConfig.access.prompt}
        </label>
        <input
          id={inputId}
          autoComplete="off"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        <p id={`${inputId}-error`} className="access-error" aria-live="polite">
          {error}
        </p>
        <button className="quiet-button" type="submit">
          {siteConfig.access.submitLabel}
        </button>
      </motion.form>
    </section>
  );
}
