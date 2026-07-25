import { describe, expect, it } from "vitest";
import {
  MS_PER_DAY,
  calculateJourneyProgress,
  formatUnit,
  getTimeRemaining,
  interpolateTemplate,
  parseTimestamp,
  validateSiteConfig,
} from "@/lib/countdown";
import { selectMilestone } from "@/lib/milestones";
import type { SiteConfig } from "@/config/site";

const arrival = Date.parse("2026-09-15T12:00:00+01:00");
const start = Date.parse("2026-07-24T00:00:00+01:00");

describe("countdown utilities", () => {
  it("calculates a future arrival duration", () => {
    const result = getTimeRemaining(
      Date.parse("2026-09-15T12:00:00+01:00"),
      Date.parse("2026-09-14T10:59:50+01:00"),
    );

    expect(result).toMatchObject({
      days: 1,
      hours: 1,
      minutes: 0,
      seconds: 10,
      hasArrived: false,
    });
    expect(result.totalMilliseconds).toBeGreaterThan(0);
  });

  it("returns zero values at the exact arrival timestamp", () => {
    expect(getTimeRemaining(arrival, arrival)).toEqual({
      totalMilliseconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      hasArrived: true,
    });
  });

  it("returns zero values after the arrival timestamp", () => {
    expect(getTimeRemaining(arrival, arrival + 5_000)).toEqual({
      totalMilliseconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      hasArrived: true,
    });
  });

  it("clamps progress before countdown start", () => {
    expect(calculateJourneyProgress(start, arrival, start - 10_000)).toBe(0);
  });

  it("returns zero progress exactly at countdown start", () => {
    expect(calculateJourneyProgress(start, arrival, start)).toBe(0);
  });

  it("returns proportional progress during the countdown", () => {
    const middle = start + (arrival - start) / 2;
    expect(calculateJourneyProgress(start, arrival, middle)).toBeCloseTo(0.5);
  });

  it("returns full progress exactly at arrival", () => {
    expect(calculateJourneyProgress(start, arrival, arrival)).toBe(1);
  });

  it("clamps progress after arrival", () => {
    expect(calculateJourneyProgress(start, arrival, arrival + 10_000)).toBe(1);
  });

  it("throws a controlled error for invalid arrival timestamps", () => {
    expect(() => parseTimestamp("dates.arrivalDateISO", "not-a-date")).toThrow(
      "dates.arrivalDateISO",
    );
  });

  it("throws a controlled error for invalid start timestamps", () => {
    expect(() =>
      parseTimestamp("dates.countdownStartDateISO", "2026-07-24"),
    ).toThrow("explicit UTC offset");
  });

  it("treats a start timestamp after arrival as invalid configuration", () => {
    const config = createConfig({
      countdownStartDateISO: "2026-10-01T00:00:00+01:00",
    });
    const validation = validateSiteConfig(config);

    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.field).toBe("dates.countdownStartDateISO");
    }
  });

  it("formats singular days", () => {
    expect(formatUnit(1, "day")).toBe("1 day");
  });

  it("formats singular hours", () => {
    expect(formatUnit(1, "hour")).toBe("1 hour");
  });

  it("formats singular minutes", () => {
    expect(formatUnit(1, "minute")).toBe("1 minute");
  });

  it("formats singular seconds", () => {
    expect(formatUnit(1, "second")).toBe("1 second");
  });

  it("formats plural labels", () => {
    expect(formatUnit(2, "day")).toBe("2 days");
    expect(formatUnit(0, "second")).toBe("0 seconds");
  });

  it("selects the 30-day milestone at the boundary", () => {
    expect(selectMilestone(30 * MS_PER_DAY)).toBe("thirtyDaysOrLess");
  });

  it("selects the 14-day milestone at the boundary", () => {
    expect(selectMilestone(14 * MS_PER_DAY)).toBe("fourteenDaysOrLess");
  });

  it("selects the 7-day milestone at the boundary", () => {
    expect(selectMilestone(7 * MS_PER_DAY)).toBe("sevenDaysOrLess");
  });

  it("selects the 3-day milestone at the boundary", () => {
    expect(selectMilestone(3 * MS_PER_DAY)).toBe("threeDaysOrLess");
  });

  it("selects the 24-hour milestone at the boundary", () => {
    expect(selectMilestone(24 * 60 * 60 * 1_000)).toBe(
      "twentyFourHoursOrLess",
    );
  });

  it("selects the 1-hour milestone at the boundary", () => {
    expect(selectMilestone(60 * 60 * 1_000)).toBe("oneHourOrLess");
  });

  it("selects the arrival milestone at zero", () => {
    expect(selectMilestone(0)).toBe("arrived");
  });

  it("interpolates configured templates", () => {
    expect(interpolateTemplate("{percentage}% complete", { percentage: 42 })).toBe(
      "42% complete",
    );
  });
});

function createConfig(
  dateOverrides: Partial<SiteConfig["dates"]> = {},
): SiteConfig {
  return {
    people: {
      wifeName: "Shama",
      husbandName: "Ahesan",
    },
    dates: {
      arrivalDateISO: "2026-09-15T12:00:00+01:00",
      countdownStartDateISO: "2026-07-24T00:00:00+01:00",
      relationshipStartDateISO: "2026-02-23",
      arrivalTimeZone: "Europe/London",
      ...dateOverrides,
    },
    journey: {
      departureCity: "Nargol, Gujarat, India",
      arrivalCity: "London",
      arrivalCountry: "United Kingdom",
    },
    media: {
      enableMusic: true,
      songPath: "/audio/our-song.mp3",
      enablePhoto: true,
      heroPhotoPath: "/images/our-photo.webp",
      heroPhotoAlt: "Shama and Ahesan together",
    },
    access: {
      enabled: false,
      prompt: "Question",
      acceptedAnswers: ["answer"],
      submitLabel: "Submit",
      incorrectAnswerMessage: "No",
    },
    playfulGate: {
      enabled: true,
      rememberCompletion: true,
      repeatOnEveryVisit: false,
      windowTitle: "Surprise",
      questions: ["Ready?"],
      yesLabel: "Yes",
      noLabel: "No",
      skipLabel: "Skip",
      finalQuestionMessage: "Done",
      hiddenHeartMessage: "Found",
      hiddenHeartAfterNoEscapes: 4,
      autoRevealHeartAfterNoEscapes: 7,
      noEscapeMessages: ["No"],
      completionStorageKey: "until-you-are-here:intro-completed:v1",
    },
    copy: {
      metadata: {
        title: "Title",
        description: "Description",
      },
      opening: {
        firstLine: "One",
        secondLine: "Two",
        cta: "Go",
      },
      countdown: {
        heading: "Heading",
        supportingLine: "Support",
        rotatingMessages: ["Message"],
        progressTemplate: "{percentage}%",
      },
      milestones: {
        moreThanThirtyDays: "more",
        thirtyDaysOrLess: "30",
        fourteenDaysOrLess: "14",
        sevenDaysOrLess: "7",
        threeDaysOrLess: "3",
        twentyFourHoursOrLess: "24h",
        oneHourOrLess: "1h",
        arrived: "arrived",
      },
      calendar: {
        revealMessage: "calendar",
      },
      easterEggs: {
        plane: "plane",
        moon: "moon",
        seconds: "seconds",
        heldHeart: "heart",
      },
      letter: {
        leadIn: "lead",
        paragraphs: ["p"],
        signOff: "off",
        photoCaption: "caption",
        revealAllLabel: "all",
        closeLabel: "close",
      },
      arrival: {
        heading: "arrive",
        message: "message",
        cta: "cta",
      },
      controls: {
        playMusic: "play",
        pauseMusic: "pause",
        musicUnavailable: "unavailable",
        replay: "replay",
      },
    },
  };
}
