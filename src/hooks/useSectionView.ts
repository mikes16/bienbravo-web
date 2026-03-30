"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type SectionName } from "@/lib/analytics";

export function useSectionView(sectionName: SectionName) {
  const ref = useRef<HTMLElement>(null);
  const hasFired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFired.current) {
          hasFired.current = true;
          trackEvent({ event: "section_view", section_name: sectionName });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionName]);

  return ref;
}
