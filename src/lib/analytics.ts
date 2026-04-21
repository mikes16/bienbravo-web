type SectionName = "hero" | "about" | "sucursales" | "services" | "javi-cruz" | "barbers" | "footer";

type AnalyticsEvent =
  | { event: "section_view"; section_name: SectionName }
  | { event: "cta_click"; cta_name: string; cta_location: SectionName | "navbar" | "footer" | "floating"; cta_destination: string }
  | { event: "whatsapp_click"; barber_name?: string; source_section: SectionName | "floating" | "navbar" }
  | { event: "barber_card_hover"; barber_name: string }
  | { event: "barber_card_view"; barber_name: string }
  | { event: "barber_select"; barber_name: string; location_name: string }
  | { event: "service_card_view"; service_name: string }
  | { event: "location_select"; location_name: string; source_section: string }
  | { event: "scroll_depth"; depth_percentage: 25 | 50 | 75 | 100 }
  | { event: "preloader_complete"; load_time_ms: number }
  | { event: "navbar_link_click"; link_name: string; link_target: string }
  | { event: "footer_link_click"; link_name: string; link_target: string };

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function trackEvent(payload: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export type { AnalyticsEvent, SectionName };
