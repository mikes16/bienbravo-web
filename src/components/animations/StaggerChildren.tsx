"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-plugins";
import { DURATIONS, EASINGS, STAGGER, SCROLL_TRIGGER_DEFAULTS } from "@/lib/constants";
import { cn } from "@/lib/cn";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  direction?: "up" | "left";
  distance?: number;
  as?: React.ElementType;
}

export function StaggerChildren({
  children,
  className,
  stagger: staggerAmount = STAGGER.cards,
  direction = "up",
  distance = 30,
  as: Tag = "div",
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const items = ref.current.children;
    if (!items.length) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: DURATIONS.slow,
      ease: EASINGS.smooth,
      stagger: staggerAmount,
      ...(direction === "up" ? { y: distance } : { x: distance }),
    };

    gsap.from(items, {
      ...fromVars,
      scrollTrigger: {
        trigger: ref.current,
        start: SCROLL_TRIGGER_DEFAULTS.start,
        toggleActions: SCROLL_TRIGGER_DEFAULTS.toggleActions,
      },
    });
  }, { dependencies: [staggerAmount, direction, distance] });

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
