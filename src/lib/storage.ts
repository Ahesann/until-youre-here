const STORAGE_PREFIX = "until-youre-here:v1";

export const storageKeys = {
  introComplete: `${STORAGE_PREFIX}:intro-complete`,
  musicMuted: `${STORAGE_PREFIX}:music-muted`,
  accessGranted: `${STORAGE_PREFIX}:access-granted`,
} as const;

export function readLocalBoolean(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function writeLocalBoolean(key: string, value: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Blocked storage should not break the experience.
  }
}

export function removeLocalKey(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Blocked storage should not break replay.
  }
}

export function readSessionBoolean(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function writeSessionBoolean(key: string, value: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(key, String(value));
  } catch {
    // Blocked storage should not break the experience.
  }
}

export function removeOwnedExperienceState(): void {
  removeLocalKey(storageKeys.introComplete);
}
