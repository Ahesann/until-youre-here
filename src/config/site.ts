export type SiteConfig = {
  people: {
    wifeName: string;
    husbandName: string;
  };
  dates: {
    arrivalDateISO: string;
    countdownStartDateISO: string;
    relationshipStartDateISO: string;
    arrivalTimeZone: string;
  };
  journey: {
    departureCity: string;
    arrivalCity: string;
    arrivalCountry: string;
  };
  media: {
    enableMusic: boolean;
    songPath: string;
    enablePhoto: boolean;
    heroPhotoPath: string;
    heroPhotoAlt: string;
  };
  access: {
    enabled: boolean;
    prompt: string;
    acceptedAnswers: readonly string[];
    submitLabel: string;
    incorrectAnswerMessage: string;
  };
  copy: {
    metadata: {
      title: string;
      description: string;
    };
    opening: {
      firstLine: string;
      secondLine: string;
      cta: string;
    };
    countdown: {
      heading: string;
      supportingLine: string;
      rotatingMessages: readonly string[];
      progressTemplate: string;
    };
    milestones: {
      moreThanThirtyDays: string;
      thirtyDaysOrLess: string;
      fourteenDaysOrLess: string;
      sevenDaysOrLess: string;
      threeDaysOrLess: string;
      twentyFourHoursOrLess: string;
      oneHourOrLess: string;
      arrived: string;
    };
    calendar: {
      revealMessage: string;
    };
    easterEggs: {
      plane: string;
      moon: string;
      seconds: string;
      heldHeart: string;
    };
    letter: {
      leadIn: string;
      paragraphs: readonly string[];
      signOff: string;
      photoCaption: string;
      revealAllLabel: string;
      closeLabel: string;
    };
    arrival: {
      heading: string;
      message: string;
      cta: string;
    };
    controls: {
      playMusic: string;
      pauseMusic: string;
      musicUnavailable: string;
      replay: string;
    };
  };
};

export const siteConfig = {
  people: {
    // Change the names here; components read names from this single config.
    wifeName: "Shama",
    husbandName: "Ahesan",
  },

  dates: {
    // Change the arrival date here. Use a complete ISO-8601 timestamp.
    // Keep the "T" between date and time, and include an explicit UTC offset.
    // The offset matters because it makes the countdown identical no matter
    // which local timezone the visitor's device is using.
    arrivalDateISO: "2026-09-15T12:00:00+01:00",

    // Journey progress begins from this timestamp.
    countdownStartDateISO: "2026-07-24T00:00:00+01:00",

    // Machine-readable ISO date. Format: YYYY-MM-DD.
    relationshipStartDateISO: "2026-02-23",

    // Used for calendar and arrival-date presentation.
    arrivalTimeZone: "Europe/London",
  },

  journey: {
    // Change the cities here; route artwork is symbolic and does not use a map.
    departureCity: "Nargol, Gujarat, India",
    arrivalCity: "London",
    arrivalCountry: "United Kingdom",
  },

  media: {
    // Set enableMusic to false to hide the music control completely.
    enableMusic: true,
    songPath: "/audio/our-song.mp3",

    // Set enablePhoto to false to omit the Polaroid from the letter.
    enablePhoto: true,
    heroPhotoPath: "/images/our-photo.webp",
    heroPhotoAlt: "Shama and Ahesan together",
  },

  access: {
    // Set enabled to true to show the romantic access screen first.
    // This is not secure authentication: acceptedAnswers is shipped in the
    // public client JavaScript and can be discovered by inspecting the source.
    enabled: false,
    prompt: "What is the little name I call you?",
    acceptedAnswers: ["replace-with-romantic-answer"],
    submitLabel: "Let me in",
    incorrectAnswerMessage: "That is not the little name I was thinking of.",
  },

  copy: {
    metadata: {
      title: "Until You’re Here ❤️",
      description: "A little countdown made with love.",
    },

    opening: {
      firstLine: "Someone in the UK is counting every second…",
      secondLine: "Because September is bringing my favourite person home.",
      cta: "See how close we are",
    },

    countdown: {
      heading: "Until I can hold you again",
      supportingLine: "Every second is bringing you closer to me.",

      rotatingMessages: [
        "Every second is one second less without you.",
        "Somewhere in the UK, someone is counting every moment.",
        "The distance is temporary. You and me are permanent.",
        "My favourite arrival is almost here.",
      ],

      progressTemplate: "{percentage}% of the waiting is already behind us.",
    },

    milestones: {
      moreThanThirtyDays:
        "It still feels far away, but every sunrise is helping.",
      thirtyDaysOrLess: "This is the month before our new chapter begins.",
      fourteenDaysOrLess: "Only two weeks until the distance loses.",
      sevenDaysOrLess: "Seven more sleeps until you are here.",
      threeDaysOrLess: "I can almost hear your footsteps.",
      twentyFourHoursOrLess: "Tomorrow, this countdown becomes a memory.",
      oneHourOrLess: "No more months. No more weeks. Almost no more waiting.",
      arrived: "You’re here.",
    },

    calendar: {
      revealMessage: "I have already saved this day in my heart.",
    },

    easterEggs: {
      plane: "Come faster, my love.",
      moon: "I look at this and wonder whether you are looking at it too.",
      seconds:
        "I would stop time when we are together—but not while I am waiting for you.",
      heldHeart: "You have had my heart for much longer than this countdown.",
    },

    letter: {
      // Edit the love letter paragraphs here; the modal renders this array.
      leadIn: "There is something I have been trying to say.",

      paragraphs: [
        "My love,",
        "Being away from you has made me realise that home is not a city, a country, or a building.",
        "Home is the feeling I have whenever I am with you.",
        "I have counted the days, the hours, and even the smallest moments until your arrival.",
        "Welcome to the UK. More importantly, welcome to our next chapter.",
        "I love you—today, in September, and in every life that comes after this one.",
      ],

      signOff: "Forever yours,",
      photoCaption: "My favourite picture is any picture with you.",
      revealAllLabel: "Read the whole letter",
      closeLabel: "Close the letter",
    },

    arrival: {
      heading: "Welcome home, my love",
      message:
        "The countdown has ended, but our next chapter has only just begun.",
      cta: "Open our next chapter",
    },

    controls: {
      playMusic: "Play our song",
      pauseMusic: "Pause",
      musicUnavailable: "Song unavailable",
      replay: "Replay from the beginning",
    },
  },
} as const satisfies SiteConfig;
