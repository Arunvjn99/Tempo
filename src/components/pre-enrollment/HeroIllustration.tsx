import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isVideoAssetUrl } from "@/lib/isVideoAssetUrl";
interface HeroIllustrationProps {
  imageSrc: string;
  /** Decorative hero art; empty string omits alt for screen readers when appropriate. */
  alt?: string;
}

const HERO_IMAGE_CLASS =
  "mx-auto h-auto w-full max-h-[min(40vh,17.5rem)] object-contain object-center sm:max-h-[min(42vh,19rem)] md:max-h-[min(46vh,22rem)] lg:mx-0 lg:max-h-[min(48vh,25rem)] lg:object-left xl:max-h-[min(50vh,27rem)] 2xl:max-h-[min(52vh,29rem)]";

/** Larger caps for hero video so it matches the visual weight of the prior PNG illustration (+3px on rem caps). */
const HERO_VIDEO_CLASS =
  "mx-auto h-auto w-full max-h-[min(60vh,calc(28rem+3px))] object-contain object-center sm:max-h-[min(62vh,calc(30rem+3px))] md:max-h-[min(66vh,calc(35rem+3px))] lg:mx-0 lg:max-h-[min(68vh,calc(39rem+3px))] lg:object-left xl:max-h-[min(70vh,calc(43rem+3px))] 2xl:max-h-[min(72vh,calc(47rem+3px))]";

const HERO_IMAGE_WRAP =
  "w-full max-w-[280px] md:max-w-[340px] lg:max-w-[380px] xl:max-w-[420px]";

const HERO_VIDEO_WRAP =
  "w-full max-w-[min(100%,320px)] md:max-w-[min(100%,380px)] lg:max-w-[min(100%,420px)] xl:max-w-[min(100%,460px)]";

/**
 * Hero art stays within the grid column with capped width/height so large raster
 * assets (e.g. square exports) do not overpower the headline and CTA.
 */
export function HeroIllustration({ imageSrc, alt = "" }: HeroIllustrationProps) {
  const trimmed = imageSrc.trim();
  const reducedMotion = useReducedMotion();
  const isVideo = trimmed ? isVideoAssetUrl(trimmed) : false;

  const wrapClass = isVideo ? HERO_VIDEO_WRAP : HERO_IMAGE_WRAP;

  return (
    <div className="relative z-10 flex min-w-0 w-full justify-center lg:justify-start">
      <div className={wrapClass}>
        {trimmed && isVideo ? (
          <video
            className={HERO_VIDEO_CLASS}
            src={trimmed}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden={!alt}
            title={alt || undefined}
          />
        ) : trimmed ? (
          <img
            src={trimmed}
            alt={alt}
            loading="eager"
            decoding="async"
            className={HERO_IMAGE_CLASS}
          />
        ) : (
          <div
            className="mx-auto aspect-[4/3] w-full max-h-[min(40vh,17.5rem)] max-w-full bg-[var(--color-border)]/20 md:mx-0 md:aspect-[5/4]"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
