export type ExperienceState = "access" | "opening" | "countdown" | "arrival";

export type TimeRemaining = {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasArrived: boolean;
};

export type CountdownPart = {
  key: "days" | "hours" | "minutes" | "seconds";
  label: string;
  value: number;
};

export type MilestoneKey =
  | "moreThanThirtyDays"
  | "thirtyDaysOrLess"
  | "fourteenDaysOrLess"
  | "sevenDaysOrLess"
  | "threeDaysOrLess"
  | "twentyFourHoursOrLess"
  | "oneHourOrLess"
  | "arrived";

export type ConfigValidation =
  | {
      ok: true;
      arrivalTimestamp: number;
      countdownStartTimestamp: number;
      relationshipStartTimestamp: number;
    }
  | {
      ok: false;
      field: string;
      message: string;
    };

export type CalendarDay = {
  day: number | null;
  key: string;
  isArrivalDay: boolean;
};
