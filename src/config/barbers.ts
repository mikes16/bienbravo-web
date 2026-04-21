import type { LocationSlug } from "./locations";

export interface BarberStats {
  cutting: number;
  fading: number;
  beard: number;
  color: number;
  speed: number;
}

export interface Barber {
  id: string;
  name: string;
  title: string;
  photo: string;
  stats: BarberStats;
  specialties: string[];
  locationSlugs: LocationSlug[];
}

export interface PremiumBarber {
  id: string;
  name: string;
  title: string;
  photo: string;
  price: number;
  experience: string;
  description: string;
  specialties: string[];
  bookingNote: string;
}

export const statLabels: Record<keyof BarberStats, string> = {
  cutting: "Corte",
  fading: "Fade",
  beard: "Barba",
  color: "Color",
  speed: "Velocidad",
};

export const premiumBarber: PremiumBarber = {
  id: "javi-cruz",
  name: "Javi Cruz",
  title: "Fundador & Master Barber",
  photo: "/images/javi.webp",
  price: 350,
  experience: "12 años de experiencia",
  description:
    "El barbero de los videos y dueño de las barberías. Experto en todo tipo de cortes y visagismo. Cada corte es diseñado para complementar tus facciones y estilo personal.",
  specialties: ["Visagismo", "Cortes Personalizados", "Consultoría de Imagen"],
  bookingNote: "Solo con cita",
};

export const barbers: Barber[] = [
  // — Norte —
  {
    id: "luis-rodriguez",
    name: "Luis Rodriguez",
    title: "Barbero",
    photo: "/images/barbers/luis-rodriguez.webp",
    stats: { cutting: 90, fading: 88, beard: 85, color: 70, speed: 85 },
    specialties: ["Fade", "Corte Clásico"],
    locationSlugs: ["norte"],
  },
  {
    id: "eli-cruz",
    name: "Eli Cruz",
    title: "Barbero",
    photo: "/images/barbers/eli-cruz.webp",
    stats: { cutting: 88, fading: 85, beard: 82, color: 72, speed: 88 },
    specialties: ["Corte Moderno", "Diseño"],
    locationSlugs: ["norte"],
  },
  {
    id: "aaron-cruz",
    name: "Aaron Cruz",
    title: "Barbero",
    photo: "/images/barbers/aaron-cruz.webp",
    stats: { cutting: 85, fading: 90, beard: 80, color: 68, speed: 86 },
    specialties: ["Skin Fade", "Barba"],
    locationSlugs: ["norte"],
  },

  // — Centro —
  {
    id: "kevin-garcia",
    name: "Kevin Garcia",
    title: "Barbero",
    photo: "/images/barbers/kevin-garcia.webp",
    stats: { cutting: 88, fading: 86, beard: 84, color: 65, speed: 90 },
    specialties: ["Fade", "Corte Rápido"],
    locationSlugs: ["centro"],
  },
  {
    id: "javier-torres",
    name: "Javier Torres",
    title: "Barbero",
    photo: "/images/barbers/javier-torres.webp",
    stats: { cutting: 86, fading: 84, beard: 88, color: 70, speed: 85 },
    specialties: ["Barba", "Corte Clásico"],
    locationSlugs: ["centro"],
  },
  {
    id: "carlos-espinoza",
    name: "Carlos Espinoza",
    title: "Barbero",
    photo: "/images/barbers/carlos-espinoza.webp",
    stats: { cutting: 85, fading: 82, beard: 80, color: 75, speed: 88 },
    specialties: ["Corte Moderno", "Fade"],
    locationSlugs: ["centro"],
  },
  {
    id: "alberto-poblano",
    name: "Alberto Poblano",
    title: "Barbero",
    photo: "/images/barbers/alberto-poblano.webp",
    stats: { cutting: 84, fading: 86, beard: 82, color: 68, speed: 87 },
    specialties: ["Fade", "Diseño"],
    locationSlugs: ["centro"],
  },
  {
    id: "angel-gonzales",
    name: "Angel Gonzales",
    title: "Barbero",
    photo: "/images/barbers/angel-gonzales.webp",
    stats: { cutting: 82, fading: 80, beard: 78, color: 72, speed: 90 },
    specialties: ["Corte Rápido", "Fade"],
    locationSlugs: ["centro"],
  },

  // — Sur —
  {
    id: "jorge-robles",
    name: "Jorge Robles",
    title: "Barbero",
    photo: "/images/barbers/jorge-robles.webp",
    stats: { cutting: 88, fading: 85, beard: 86, color: 70, speed: 85 },
    specialties: ["Corte Clásico", "Barba"],
    locationSlugs: ["sur"],
  },
  {
    id: "eduardo-berlanga",
    name: "Eduardo Berlanga",
    title: "Barbero",
    photo: "/images/barbers/eduardo-berlanga.webp",
    stats: { cutting: 84, fading: 88, beard: 80, color: 65, speed: 90 },
    specialties: ["Skin Fade", "Corte Rápido"],
    locationSlugs: ["sur"],
  },
  {
    id: "benjamin-garcia",
    name: "Benjamin Garcia",
    title: "Barbero",
    photo: "/images/barbers/benjamin-garcia.webp",
    stats: { cutting: 86, fading: 84, beard: 82, color: 72, speed: 86 },
    specialties: ["Fade", "Diseño"],
    locationSlugs: ["sur"],
  },
  {
    id: "adrian-mendez",
    name: "Adrian Mendez",
    title: "Barbero",
    photo: "/images/barbers/adrian-mendez.webp",
    stats: { cutting: 85, fading: 82, beard: 84, color: 68, speed: 88 },
    specialties: ["Barba", "Corte Moderno"],
    locationSlugs: ["sur"],
  },
  {
    id: "adiel-reyes",
    name: "Adiel Reyes",
    title: "Barbero",
    photo: "/images/barbers/adiel-reyes.webp",
    stats: { cutting: 83, fading: 86, beard: 80, color: 70, speed: 87 },
    specialties: ["Fade", "Corte Clásico"],
    locationSlugs: ["sur"],
  },
];
