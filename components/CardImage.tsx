"use client";

import { useEffect, useRef, useState } from "react";
import { IconStack } from "./icons";

// ─── CARD PHOTO SLOT ──────────────────────────────────────────────────────
// Renders /public/cards/{id}.png if present. Falls back to a clean gradient
// icon block — never a broken-image icon — until real photos are dropped in.

export default function CardImage({
  src,
  name,
  className = "w-10 h-10 rounded-xl",
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // On a full (SSR'd) page load the browser can finish loading — and
    // fail — before React hydrates and attaches the onError listener,
    // silently dropping the event. Re-check completeness once mounted so
    // the fallback still kicks in for that race.
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setErrored(true);
    }
  }, [src]);

  if (!src || errored) {
    return (
      <div
        className={`${className} bg-surfaceRaised flex items-center justify-center text-inkMuted flex-shrink-0`}
      >
        <IconStack width={18} height={18} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={name}
      onError={() => setErrored(true)}
      className={`${className} object-cover flex-shrink-0 bg-surfaceRaised`}
    />
  );
}
