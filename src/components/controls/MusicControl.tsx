"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";
import { siteConfig } from "@/config/site";
import { readSessionBoolean, storageKeys, writeSessionBoolean } from "@/lib/storage";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TARGET_VOLUME = 0.42;
const FADE_MS = 420;

export function MusicControl({ visible }: { visible: boolean }) {
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const cancelFade = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (targetVolume: number, onDone?: () => void) => {
      const audio = audioRef.current;
      if (!audio) {
        onDone?.();
        return;
      }

      cancelFade();
      const startVolume = audio.volume;
      const startedAt = performance.now();

      const tick = (timestamp: number) => {
        const progress = Math.min(1, (timestamp - startedAt) / FADE_MS);
        audio.volume = startVolume + (targetVolume - startVolume) * progress;

        if (progress < 1) {
          frameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        frameRef.current = null;
        onDone?.();
      };

      frameRef.current = window.requestAnimationFrame(tick);
    },
    [cancelFade],
  );

  useEffect(() => {
    readSessionBoolean(storageKeys.musicMuted);

    return () => {
      cancelFade();
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      }
    };
  }, [cancelFade]);

  if (!siteConfig.media.enableMusic || !visible) {
    return null;
  }

  const ensureAudio = () => {
    if (audioRef.current) {
      return audioRef.current;
    }

    const audio = new Audio(siteConfig.media.songPath);
    audio.preload = "none";
    audio.loop = true;
    audio.volume = 0;
    audio.addEventListener("error", () => {
      setUnavailable(true);
      setPlaying(false);
      writeSessionBoolean(storageKeys.musicMuted, true);
    });
    audioRef.current = audio;
    return audio;
  };

  const play = async () => {
    const audio = ensureAudio();

    if (audio.canPlayType("audio/mpeg") === "" && siteConfig.media.songPath.endsWith(".mp3")) {
      setUnavailable(true);
      return;
    }

    try {
      audio.volume = 0;
      await audio.play();
      setPlaying(true);
      setUnavailable(false);
      writeSessionBoolean(storageKeys.musicMuted, false);
      fadeTo(TARGET_VOLUME);
    } catch {
      setUnavailable(true);
      setPlaying(false);
      writeSessionBoolean(storageKeys.musicMuted, true);
    }
  };

  const pause = () => {
    writeSessionBoolean(storageKeys.musicMuted, true);
    fadeTo(0, () => {
      audioRef.current?.pause();
      setPlaying(false);
    });
  };

  const label = unavailable
    ? siteConfig.copy.controls.musicUnavailable
    : playing
      ? siteConfig.copy.controls.pauseMusic
      : siteConfig.copy.controls.playMusic;

  return (
    <button
      type="button"
      className="quiet-button music-button"
      onClick={() => {
        if (unavailable) {
          return;
        }
        if (playing) {
          pause();
        } else {
          void play();
        }
      }}
      aria-label={label}
      disabled={unavailable}
    >
      {unavailable ? <VolumeX size={18} /> : <Music2 size={18} />}
      <span className="music-label">{label}</span>
      {playing && !reduceMotion ? (
        <span className="music-eq" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      ) : null}
    </button>
  );
}
