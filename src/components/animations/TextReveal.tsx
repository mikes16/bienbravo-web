"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-plugins";
import { DURATIONS, EASINGS, STAGGER, SCROLL_TRIGGER_DEFAULTS } from "@/lib/constants";
import { cn } from "@/lib/cn";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  splitBy?: "chars" | "words" | "lines";
  delay?: number;
  stagger?: number;
  useScrollTrigger?: boolean;
}

export function TextReveal({
  children,
  className,
  as: Tag = "h2",
  splitBy = "chars",
  delay = 0,
  stagger: staggerAmount = STAGGER.fast,
  useScrollTrigger = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const text = el.textContent || "";
    let elements: string[] = [];

    if (splitBy === "chars") {
      elements = text.split("");
    } else if (splitBy === "words") {
      elements = text.split(" ");
    } else {
      elements = [text];
    }

    el.innerHTML = "";

    const spans = elements.map((item, i) => {
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";

      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.textContent = splitBy === "words" && i < elements.length - 1 ? item + "\u00A0" : item;

      if (item === " ") {
        inner.textContent = "\u00A0";
      }

      wrapper.appendChild(inner);
      el.appendChild(wrapper);

      return inner;
    });

    const animConfig: gsap.TweenVars = {
      y: "110%",
      opacity: 0,
      duration: DURATIONS.slow,
      ease: EASINGS.textReveal,
      stagger: staggerAmount,
      delay,
    };

    if (useScrollTrigger) {
      animConfig.scrollTrigger = {
        trigger: el,
        start: SCROLL_TRIGGER_DEFAULTS.start,
        toggleActions: SCROLL_TRIGGER_DEFAULTS.toggleActions,
      };
    }

    gsap.from(spans, animConfig);
  }, { dependencies: [children, splitBy, delay, staggerAmount, useScrollTrigger] });

  return (
    <Tag
      ref={containerRef as React.RefObject<never>}
      className={cn("overflow-hidden", className)}
      aria-label={children}
    >
      {children}
    </Tag>
  );
}
