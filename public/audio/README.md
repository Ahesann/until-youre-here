# Audio

Place the permitted song file at:

```text
public/audio/our-song.mp3
```

Recommended format: compressed MP3, M4A, or AAC. If you change the file name or format, update `media.songPath` in `src/config/site.ts`.

The music control never autoplays; playback only starts after the visitor presses the music button.

Only use audio you have permission to use. Do not commit a copyrighted song unless you have explicit permission to store and publish it with this site.

If the configured audio file is missing or unsupported, the control switches to “Song unavailable” and the rest of the experience keeps working.
