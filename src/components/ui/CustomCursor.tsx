"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-plugins";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;

    const moveDotX = gsap.quickTo(dot, "left", { duration: 0.1, ease: "power3.out" });
    const moveDotY = gsap.quickTo(dot, "top", { duration: 0.1, ease: "power3.out" });
    const moveRingX = gsap.quickTo(ring, "left", { duration: 0.35, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "top", { duration: 0.35, ease: "power3.out" });

    function onMove(e: MouseEvent) {
      const x = e.clientX;
      const y = e.clientY;
      moveDotX(x);
      moveDotY(y);
      moveRingX(x);
      moveRingY(y);
    }

    function onEnterInteractive() {
      gsap.to(ring, { scale: 1.8, borderColor: "var(--bb-primary)", duration: 0.25 });
      gsap.to(dot, { scale: 0.5, duration: 0.25 });
    }

    function onLeaveInteractive() {
      gsap.to(ring, { scale: 1, borderColor: "var(--bb-text)", duration: 0.25 });
      gsap.to(dot, { scale: 1, duration: 0.25 });
    }

    document.addEventListener("mousemove", onMove);

    const interactives = document.querySelectorAll("a, button, [data-cursor-hover]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive);
      el.addEventListener("mouseleave", onLeaveInteractive);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bb-text mix-blend-difference lg:block"
        style={{ left: -20, top: -20 }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9999] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bb-text/40 mix-blend-difference lg:block"
        style={{ left: -20, top: -20 }}
      />
    </>
  );
}
