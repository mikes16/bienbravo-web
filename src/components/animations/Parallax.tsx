"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-plugins";
import { cn } from "@/lib/cn";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  as?: React.ElementType;
}

export function Parallax({
  children,
  className,
  speed = 0.3,
  as: Tag = "div",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: () => speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { dependencies: [speed] });

  return (
    <Tag ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}
