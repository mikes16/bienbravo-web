export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export const whatsappConfig = {
  number: "528112345678",
  defaultMessage:
    "Hola, me gustaría agendar una cita en Bien Bravo.",
  barberMessage: (barberName: string) =>
    `Hola, me gustaría agendar una cita con ${barberName} en Bien Bravo.`,
} as const;

export const socialLinks: SocialLink[] = [
  {
    platform: "Instagram",
    url: "https://instagram.com/bienbravo",
    icon: "Instagram",
  },
  {
    platform: "Facebook",
    url: "https://facebook.com/bienbravo",
    icon: "Facebook",
  },
  {
    platform: "TikTok",
    url: "https://tiktok.com/@bienbravo",
    icon: "Music2",
  },
];

export function getWhatsAppUrl(message?: string, number?: string): string {
  const phone = number ?? whatsappConfig.number;
  const text = encodeURIComponent(message ?? whatsappConfig.defaultMessage);
  return `https://wa.me/${phone}?text=${text}`;
}
