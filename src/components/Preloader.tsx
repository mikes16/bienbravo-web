"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap-plugins";
import { trackEvent } from "@/lib/analytics";

/**
 * Marks the preloader as done globally so late-mounting components
 * can check whether they missed the event.
 */
function markPreloaderDone() {
  (window as Window & { __preloaderDone?: boolean }).__preloaderDone = true;
  window.dispatchEvent(new CustomEvent("preloader:done"));
}

/** Returns true if the preloader has already completed. */
export function isPreloaderDone(): boolean {
  return typeof window !== "undefined" &&
    !!(window as Window & { __preloaderDone?: boolean }).__preloaderDone;
}

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [hidden, setHidden] = useState(false);
  const startTime = useRef(Date.now());

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setHidden(true);
        markPreloaderDone();
        trackEvent({
          event: "preloader_complete",
          load_time_ms: Date.now() - startTime.current,
        });
      },
    });

    tl.from(logoRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "power3.out",
    })
      .to(logoRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.4,
        ease: "power2.in",
        delay: 0.8,
      })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
      });
  });

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-bb-bg"
    >
      <img
        ref={logoRef}
        src="/logos/logo_alt_white.png"
        alt="Bien Bravo"
        className="h-28 w-auto md:h-40"
      />
    </div>
  );
}
