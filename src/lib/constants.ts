export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
} as const;

export const DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.6,
  xslow: 1.0,
  preloader: 2.0,
} as const;

export const EASINGS = {
  industrial: "power2.out",
  smooth: "power3.out",
  snap: "power4.out",
  elastic: "elastic.out(1, 0.5)",
  textReveal: "power4.out",
} as const;

export const SCROLL_TRIGGER_DEFAULTS = {
  start: "top 85%",
  end: "bottom 15%",
  toggleActions: "play none none none",
} as const;

export const STAGGER = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.08,
  cards: 0.12,
} as const;
