"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-plugins";
import { DURATIONS, EASINGS, SCROLL_TRIGGER_DEFAULTS } from "@/lib/constants";
import { cn } from "@/lib/cn";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  delay?: number;
  duration?: number;
  as?: React.ElementType;
}

export function FadeIn({
  children,
  className,
  direction = "up",
  distance = 40,
  delay = 0,
  duration = DURATIONS.slow,
  as: Tag = "div",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const dirMap = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
      none: {},
    };

    gsap.from(ref.current, {
      opacity: 0,
      ...dirMap[direction],
      duration,
      delay,
      ease: EASINGS.smooth,
      scrollTrigger: {
        trigger: ref.current,
        start: SCROLL_TRIGGER_DEFAULTS.start,
        toggleActions: SCROLL_TRIGGER_DEFAULTS.toggleActions,
      },
    });
  }, { dependencies: [direction, distance, delay, duration] });

  return (
    <Tag ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}
