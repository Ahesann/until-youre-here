# Until You’re Here

`Until You’re Here` is a private, mobile-first romantic countdown made by Ahesan for Shama’s expected arrival in the United Kingdom in September 2026.

## Experience Flow

The site is a single App Router page with a state model for `access`, `opening`, `countdown`, and `arrival`.

First visits show the optional access screen when enabled, then a playful compact `Surprise` dialog inspired by a retro desktop question window. The idea comes from a runaway “No” button interaction, but the implementation, styling, SVG heart, and web behavior are original React/TypeScript code. After the questions are completed, the hidden heart is found, or the skip action is used, the versioned intro state is stored in LocalStorage and later visits before arrival skip directly to the countdown. Arrival is always calculated from the absolute configured timestamp, so post-arrival visits open directly in the arrival experience.

The countdown includes glass cards for days, hours, minutes, and seconds; milestone-aware copy; rotating messages; symbolic India-to-UK journey artwork; a configured arrival-month calendar; Easter eggs; optional music; a love-letter envelope; optional photograph fallback; and a sunrise arrival transformation.

## Stack

- Next.js App Router
- React and TypeScript in strict mode
- Tailwind CSS v4 through PostCSS
- `motion` for React animation
- Lucide React icons
- Canvas Confetti, loaded dynamically for finite celebration bursts
- Vitest unit tests
- Playwright mobile smoke test

## Node And Package Manager

Use Node.js 24 or newer. The project uses npm because the repository was greenfield and had no existing package manager.

```bash
nvm use
npm install
```

## Local Development

```bash
npm run dev
```

Open the URL printed by Next.js, usually `http://localhost:3000`.

## Configuration

All personal copy and feature switches live in `src/config/site.ts`.

Change names in `people.wifeName` and `people.husbandName`.

Change the arrival date in `dates.arrivalDateISO`. Use a complete ISO-8601 timestamp with a `T` separator and explicit UTC offset:

```ts
arrivalDateISO: "2026-09-15T12:00:00+01:00"
```

The explicit offset matters because it makes the countdown target the same instant for visitors in any local timezone.

Change cities in `journey.departureCity`, `journey.arrivalCity`, and `journey.arrivalCountry`.

Edit the playful opening in `playfulGate`. The questions live in `playfulGate.questions`, button labels in `playfulGate.yesLabel`, `playfulGate.noLabel`, and `playfulGate.skipLabel`, and hidden-heart behavior in `playfulGate.hiddenHeartAfterNoEscapes` and `playfulGate.autoRevealHeartAfterNoEscapes`.

The completion flag is controlled by `playfulGate.completionStorageKey`, `playfulGate.rememberCompletion`, and `playfulGate.repeatOnEveryVisit`. The default key is `until-you-are-here:intro-completed:v1` and stores only `true`.

Edit fallback opening copy in `copy.opening`, rotating messages in `copy.countdown.rotatingMessages`, milestone messages in `copy.milestones`, and the love letter in `copy.letter.paragraphs`.

Enable the access screen with `access.enabled: true` and update `access.acceptedAnswers`. This is only a romantic interaction, not secure authentication. The answer is included in public client-side JavaScript and can be discovered by anyone inspecting the source, so it must not protect genuinely private or sensitive content.

## Media

Add the photograph at `public/images/our-photo.webp`. Recommended: WebP or AVIF, portrait crop, around 1200 x 1500 pixels, optimized before commit. Update `media.heroPhotoPath` and `media.heroPhotoAlt` in `src/config/site.ts` if needed.

Add the song at `public/audio/our-song.mp3`. Do not commit copyrighted music unless you have permission to store and publish it. Disable music with `media.enableMusic: false`.

Disable the photograph with `media.enablePhoto: false`.

Missing photo and audio files are handled gracefully. The photograph area shows a designed placeholder; audio switches to the unavailable state after a playback/load failure.

## Previewing States

In development only, a small preview panel appears. It can preview more than 30 days remaining, 30 days, 14 days, 7 days, 3 days, 24 hours, 1 hour, arrival, real time, and reduced-motion simulation.

You can also use query parameters in development:

```text
/?preview=arrival
/?preview=30d
/?now=2026-09-15T11:00:00+01:00
/?replayIntro=1
```

The preview values use the shared injectable clock and do not change the computer clock. `?replayIntro=1` clears only this site’s intro completion key in development so the playful opening can be tested without manually editing LocalStorage.

To test the intro locally, run `npm run dev`, open the site with `?replayIntro=1`, click through the Yes sequence, try pointer and touch-style activation on No, reveal the hidden heart, and confirm the skip action goes to the countdown. Check mobile widths such as 320 x 568, 390 x 844, and 430 x 932, plus reduced motion through browser dev tools or the development preview panel.

## Quality Commands

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

`npm run test:e2e` covers the playful opening, mobile overflow, countdown transition, letter dialog, and arrival preview. It requires Playwright’s Chromium browser:

```bash
npx playwright install chromium
```

## Deployment

The app is Vercel-ready. Connect the GitHub repository to Vercel, select this project root, and keep the default Next.js build settings:

```bash
npm install
npm run build
```

Future GitHub pushes to the connected branch will trigger deployments automatically. For a private romantic site, use a private GitHub repository and Vercel project protection or private deployment settings where appropriate.

## Privacy Notes

Do not commit home addresses, phone numbers, travel bookings, flight numbers, passport details, visa details, private documents, or unauthorized media. The supplied names and cities are treated as intentionally visible site copy.

## Replay

The replay button clears only this site’s intro completion keys, including `until-you-are-here:intro-completed:v1` and the legacy `until-youre-here:v1:intro-complete`. It also resets the playful opening component state on the next render. It does not alter the configured arrival date, the real countdown, system time, music session preference, access state, or unrelated browser storage.

## Accessibility And Motion

Interactive artwork uses real buttons with visible focus states. The runaway No button does not run from keyboard focus; keyboard activation reveals the hidden heart path instead. A subtle skip action is available for accessibility. The countdown values update visually every second, but screen readers receive a quieter polite summary rather than a second-by-second live announcement. Reduced-motion mode removes or simplifies continuous drift, spring-heavy movement, complex reveals, and confetti while preserving all copy and controls.

## Known Placeholders

- Photograph: `public/images/our-photo.webp`
- Song: `public/audio/our-song.mp3`
- Access answer: `access.acceptedAnswers` in `src/config/site.ts`
- Playful opening questions and thresholds: `playfulGate` in `src/config/site.ts`
