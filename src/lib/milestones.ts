import type { MilestoneKey } from "@/types";
import { MS_PER_DAY } from "@/lib/countdown";

const MS_PER_HOUR = 60 * 60 * 1_000;

export function selectMilestone(totalMilliseconds: number): MilestoneKey {
  const safeMilliseconds = Number.isFinite(totalMilliseconds)
    ? Math.max(0, totalMilliseconds)
    : 0;

  if (safeMilliseconds <= 0) {
    return "arrived";
  }

  if (safeMilliseconds <= MS_PER_HOUR) {
    return "oneHourOrLess";
  }

  if (safeMilliseconds <= 24 * MS_PER_HOUR) {
    return "twentyFourHoursOrLess";
  }

  if (safeMilliseconds <= 3 * MS_PER_DAY) {
    return "threeDaysOrLess";
  }

  if (safeMilliseconds <= 7 * MS_PER_DAY) {
    return "sevenDaysOrLess";
  }

  if (safeMilliseconds <= 14 * MS_PER_DAY) {
    return "fourteenDaysOrLess";
  }

  if (safeMilliseconds <= 30 * MS_PER_DAY) {
    return "thirtyDaysOrLess";
  }

  return "moreThanThirtyDays";
}
