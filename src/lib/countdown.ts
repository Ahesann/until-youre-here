import type { CalendarDay, ConfigValidation, TimeRemaining } from "@/types";
import type { SiteConfig } from "@/config/site";

const MS_PER_SECOND = 1_000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

export class ConfigurationError extends Error {
  field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = "ConfigurationError";
    this.field = field;
  }
}

export function parseTimestamp(field: string, value: string): number {
  if (!value || Number.isNaN(Date.parse(value))) {
    throw new ConfigurationError(field, `Invalid timestamp for ${field}.`);
  }

  if (!/[+-]\d{2}:\d{2}$|Z$/.test(value)) {
    throw new ConfigurationError(
      field,
      `${field} must include an explicit UTC offset such as +01:00 or Z.`,
    );
  }

  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new ConfigurationError(field, `Invalid timestamp for ${field}.`);
  }

  return timestamp;
}

export function parseISODate(field: string, value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ConfigurationError(field, `${field} must use YYYY-MM-DD.`);
  }

  const timestamp = Date.parse(`${value}T00:00:00Z`);

  if (!Number.isFinite(timestamp)) {
    throw new ConfigurationError(field, `Invalid date for ${field}.`);
  }

  return timestamp;
}

export function validateSiteConfig(config: SiteConfig): ConfigValidation {
  try {
    const arrivalTimestamp = parseTimestamp(
      "dates.arrivalDateISO",
      config.dates.arrivalDateISO,
    );
    const countdownStartTimestamp = parseTimestamp(
      "dates.countdownStartDateISO",
      config.dates.countdownStartDateISO,
    );
    const relationshipStartTimestamp = parseISODate(
      "dates.relationshipStartDateISO",
      config.dates.relationshipStartDateISO,
    );

    if (countdownStartTimestamp >= arrivalTimestamp) {
      throw new ConfigurationError(
        "dates.countdownStartDateISO",
        "Countdown start must be earlier than arrival.",
      );
    }

    return {
      ok: true,
      arrivalTimestamp,
      countdownStartTimestamp,
      relationshipStartTimestamp,
    };
  } catch (error) {
    if (error instanceof ConfigurationError) {
      return {
        ok: false,
        field: error.field,
        message: error.message,
      };
    }

    return {
      ok: false,
      field: "siteConfig",
      message: "Unknown site configuration error.",
    };
  }
}

export function getTimeRemaining(
  targetTimestamp: number,
  currentTimestamp: number,
): TimeRemaining {
  if (!Number.isFinite(targetTimestamp) || !Number.isFinite(currentTimestamp)) {
    throw new ConfigurationError(
      "dates.arrivalDateISO",
      "Countdown timestamps must be finite numbers.",
    );
  }

  const totalMilliseconds = Math.max(0, targetTimestamp - currentTimestamp);
  const days = Math.floor(totalMilliseconds / MS_PER_DAY);
  const hours = Math.floor((totalMilliseconds % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor(
    (totalMilliseconds % MS_PER_HOUR) / MS_PER_MINUTE,
  );
  const seconds = Math.floor(
    (totalMilliseconds % MS_PER_MINUTE) / MS_PER_SECOND,
  );

  return {
    totalMilliseconds,
    days,
    hours,
    minutes,
    seconds,
    hasArrived: totalMilliseconds <= 0,
  };
}

export function calculateJourneyProgress(
  countdownStartTimestamp: number,
  arrivalTimestamp: number,
  currentTimestamp: number,
): number {
  if (
    !Number.isFinite(countdownStartTimestamp) ||
    !Number.isFinite(arrivalTimestamp) ||
    !Number.isFinite(currentTimestamp)
  ) {
    throw new ConfigurationError(
      "dates",
      "Journey progress timestamps must be finite numbers.",
    );
  }

  if (countdownStartTimestamp >= arrivalTimestamp) {
    throw new ConfigurationError(
      "dates.countdownStartDateISO",
      "Countdown start must be earlier than arrival.",
    );
  }

  const progress =
    (currentTimestamp - countdownStartTimestamp) /
    (arrivalTimestamp - countdownStartTimestamp);

  return clamp(progress, 0, 1);
}

export function hasReachedArrival(
  arrivalTimestamp: number,
  currentTimestamp: number,
): boolean {
  if (!Number.isFinite(arrivalTimestamp) || !Number.isFinite(currentTimestamp)) {
    throw new ConfigurationError(
      "dates.arrivalDateISO",
      "Arrival timestamps must be finite numbers.",
    );
  }

  return currentTimestamp >= arrivalTimestamp;
}

export function formatUnit(value: number, unit: string): string {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return `${safeValue} ${unit}${safeValue === 1 ? "" : "s"}`;
}

export function interpolateTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const replacement = values[key];
    return replacement === undefined ? match : String(replacement);
  });
}

export function formatAccessibleRemaining(remaining: TimeRemaining): string {
  if (remaining.hasArrived) {
    return "The arrival moment has arrived.";
  }

  return [
    formatUnit(remaining.days, "day"),
    formatUnit(remaining.hours, "hour"),
    formatUnit(remaining.minutes, "minute"),
  ].join(", ");
}

export function getArrivalCalendar(
  arrivalDateISO: string,
  arrivalTimeZone: string,
): { label: string; arrivalDay: number; days: CalendarDay[] } {
  const arrivalTimestamp = parseTimestamp("dates.arrivalDateISO", arrivalDateISO);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: arrivalTimeZone,
    month: "long",
    year: "numeric",
    day: "numeric",
  }).formatToParts(new Date(arrivalTimestamp));

  const monthName = getPart(parts, "month");
  const year = Number(getPart(parts, "year"));
  const arrivalDay = Number(getPart(parts, "day"));
  const monthIndex = new Date(`${monthName} 1, ${year} 12:00:00 UTC`).getUTCMonth();

  if (!Number.isFinite(year) || !Number.isFinite(arrivalDay) || monthIndex < 0) {
    throw new ConfigurationError(
      "dates.arrivalDateISO",
      "Unable to derive arrival calendar from arrival date.",
    );
  }

  const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const days: CalendarDay[] = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    days.push({ day: null, key: `blank-${index}`, isArrivalDay: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      day,
      key: `day-${day}`,
      isArrivalDay: day === arrivalDay,
    });
  }

  return {
    label: `${monthName} ${year}`,
    arrivalDay,
    days,
  };
}

function getPart(parts: Intl.DateTimeFormatPart[], type: string): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
