export type LocationSlug = "centro" | "sur" | "norte";
export type BookingModel = "walk-in" | "appointment";

export interface Location {
  slug: LocationSlug;
  name: string;
  fullName: string;
  bookingModel: BookingModel;
  tagline: string;
  description: string;
  address: string;
  mapUrl: string;
  photo: string;
  hours: { days: string; hours: string }[];
  features: string[];
}

export const locations: Location[] = [
  {
    slug: "centro",
    name: "Centro",
    fullName: "Bien Bravo Centro",
    bookingModel: "walk-in",
    tagline: "Servicio práctico y ágil en el corazón de Saltillo",
    description:
      "Llegas, haces fila y te atendemos en tu turno. Contamos con excelentes barberos listos para darte el mejor servicio.",
    address: "C. Ramos Arizpe 266, Zona Centro, 25000 Saltillo, Coah.",
    mapUrl:
      "https://maps.google.com/?q=C.+Ramos+Arizpe+266,+Zona+Centro,+25000+Saltillo,+Coah.",
    photo: "/images/locations/centro.webp",
    hours: [
      { days: "Lunes a Sábado", hours: "10:00 – 20:00" },
      { days: "Domingo", hours: "Cerrado" },
    ],
    features: ["Sin cita previa", "Servicio rápido", "Excelentes barberos"],
  },
  {
    slug: "sur",
    name: "Sur",
    fullName: "Bien Bravo Sur",
    bookingModel: "walk-in",
    tagline: "La misma excelencia, al sur de la ciudad",
    description:
      "Llegas, haces fila y te atendemos en tu turno. La misma calidad y profesionalismo que nos caracteriza.",
    address: "Villas de San Lorenzo, 25093 Saltillo, Coah.",
    mapUrl:
      "https://maps.google.com/?q=Villas+de+San+Lorenzo,+25093+Saltillo,+Coah.",
    photo: "/images/locations/sur.webp",
    hours: [
      { days: "Lunes a Sábado", hours: "10:00 – 20:00" },
      { days: "Domingo", hours: "Cerrado" },
    ],
    features: ["Sin cita previa", "Servicio rápido", "Excelentes barberos"],
  },
  {
    slug: "norte",
    name: "Norte",
    fullName: "Bien Bravo Norte",
    bookingModel: "appointment",
    tagline: "Experiencia premium con atención personalizada",
    description:
      "Incluye lavado de cabello, asesoramiento personalizado y atención especializada. No haces fila, solo tienes que ser muy puntual.",
    address:
      "Quinta Real, Valle Real 1er Sector, 25204 Saltillo, Coah.",
    mapUrl:
      "https://maps.google.com/?q=Quinta+Real,+Valle+Real+1er+Sector,+25204+Saltillo,+Coah.",
    photo: "/images/locations/norte.webp",
    hours: [
      { days: "Lunes a Sábado", hours: "10:00 – 20:00" },
      { days: "Domingo", hours: "Cerrado" },
    ],
    features: [
      "Solo con cita previa",
      "Lavado incluido",
      "Asesoría personalizada",
      "Sin esperas",
    ],
  },
];
