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
  whatsappNumber: string;
}

export const statLabels: Record<keyof BarberStats, string> = {
  cutting: "Corte Clásico",
  fading: "Fade & Taper",
  beard: "Barba",
  color: "Color",
  speed: "Velocidad",
};

export const barbers: Barber[] = [
  {
    id: "carlos-mendoza",
    name: "Carlos Mendoza",
    title: "Master Barber",
    photo: "/images/barbers/DSCF4015.webp",
    stats: { cutting: 95, fading: 90, beard: 85, color: 70, speed: 88 },
    specialties: ["Corte Clásico", "Scissor Work"],
    whatsappNumber: "528112345678",
  },
  {
    id: "diego-ramirez",
    name: "Diego Ramírez",
    title: "Fade Specialist",
    photo: "/images/barbers/DSCF4043.webp",
    stats: { cutting: 80, fading: 98, beard: 75, color: 60, speed: 92 },
    specialties: ["Skin Fade", "Mid Fade", "Diseño"],
    whatsappNumber: "528112345679",
  },
  {
    id: "miguel-torres",
    name: "Miguel Torres",
    title: "Beard Artisan",
    photo: "/images/barbers/DSCF4077.webp",
    stats: { cutting: 85, fading: 82, beard: 96, color: 65, speed: 80 },
    specialties: ["Barba", "Hot Towel", "Navaja"],
    whatsappNumber: "528112345680",
  },
  {
    id: "andres-villa",
    name: "Andrés Villa",
    title: "Color Expert",
    photo: "/images/barbers/DSCF4097.webp",
    stats: { cutting: 82, fading: 78, beard: 70, color: 95, speed: 85 },
    specialties: ["Color", "Mechas", "Decoloración"],
    whatsappNumber: "528112345681",
  },
];
