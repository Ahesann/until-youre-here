"use client";

import { useMotionPreference } from "@/context/MotionPreferenceContext";

export function useReducedMotion(): boolean {
  return useMotionPreference().reduceMotion;
}
