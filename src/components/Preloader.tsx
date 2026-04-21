"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap-plugins";
import { trackEvent } from "@/lib/analytics";

const MIN_DISPLAY_MS = 300;
const MAX_DISPLAY_MS = 1400;

function markPreloaderDone() {
  (window as Window & { __preloaderDone?: boolean }).__preloaderDone = true;
  window.dispatchEvent(new CustomEvent("preloader:done"));
}

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
    const start = startTime.current;

    const fadeIn = gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" },
    );

    function finish() {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      gsap.delayedCall(wait / 1000, () => {
        gsap
          .timeline({
            onComplete: () => {
              setHidden(true);
              markPreloaderDone();
              trackEvent({
                event: "preloader_complete",
                load_time_ms: Date.now() - start,
              });
            },
          })
          .to(logoRef.current, {
            opacity: 0,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.in",
          })
          .to(
            containerRef.current,
            { yPercent: -100, duration: 0.55, ease: "power4.inOut" },
            "-=0.1",
          );
      });
    }

    let triggered = false;
    function triggerOnce() {
      if (triggered) return;
      triggered = true;
      finish();
    }

    if (document.readyState === "complete") {
      fadeIn.eventCallback("onComplete", triggerOnce);
    } else {
      window.addEventListener("load", triggerOnce, { once: true });
    }

    const maxTimer = window.setTimeout(triggerOnce, MAX_DISPLAY_MS);

    return () => {
      window.clearTimeout(maxTimer);
      window.removeEventListener("load", triggerOnce);
    };
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
