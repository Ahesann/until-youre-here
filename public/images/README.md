# Photographs

Place the permitted photograph at:

```text
public/images/our-photo.webp
```

Recommended format: WebP or AVIF. A portrait crop around 1200 x 1500 pixels works well for the Polaroid-style frame. Keep the file optimized, ideally below 500 KB if the visual quality is still good.

Update the path and alt text in `src/config/site.ts`:

```ts
media: {
  heroPhotoPath: "/images/our-photo.webp",
  heroPhotoAlt: "Shama and Ahesan together"
}
```

If the image is missing or fails to load, the app preserves the layout and shows a tasteful placeholder instead of a broken image icon.

Consider privacy carefully before committing sensitive or private images to a public repository.
