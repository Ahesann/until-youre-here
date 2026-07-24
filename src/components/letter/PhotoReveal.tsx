"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export function PhotoReveal() {
  const [imageFailed, setImageFailed] = useState(false);

  if (!siteConfig.media.enablePhoto) {
    return null;
  }

  return (
    <figure className="polaroid">
      <div className="photo-frame" tabIndex={-1} id="letter-photo">
        {!imageFailed ? (
          <Image
            src={siteConfig.media.heroPhotoPath}
            alt={siteConfig.media.heroPhotoAlt}
            fill
            sizes="(max-width: 720px) 86vw, 520px"
            style={{ objectFit: "cover" }}
            onError={() => setImageFailed(true)}
            priority={false}
          />
        ) : (
          <div className="photo-placeholder" role="img" aria-label={siteConfig.media.heroPhotoAlt}>
            <Heart aria-hidden="true" size={58} fill="currentColor" />
          </div>
        )}
      </div>
      <figcaption className="photo-caption">
        {siteConfig.copy.letter.photoCaption}
      </figcaption>
    </figure>
  );
}
