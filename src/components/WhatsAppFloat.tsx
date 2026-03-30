"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/config/social";
import { trackEvent } from "@/lib/analytics";

export function WhatsAppFloat() {
  function handleClick() {
    trackEvent({
      event: "cta_click",
      cta_name: "WhatsApp Float",
      cta_location: "floating",
      cta_destination: "whatsapp",
    });
    trackEvent({ event: "whatsapp_click", source_section: "floating" });
  }

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110"
      style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
