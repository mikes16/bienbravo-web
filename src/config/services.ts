export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  featured: boolean;
}

export const services: Service[] = [
  {
    id: "corte-clasico",
    name: "Corte Clásico",
    description:
      "Corte tradicional con tijera y navaja. Incluye lavado y estilizado.",
    price: 350,
    icon: "Scissors",
    featured: true,
  },
  {
    id: "fade",
    name: "Fade & Taper",
    description:
      "Degradado de precisión con máquina. Desde skin fade hasta mid fade.",
    price: 400,
    icon: "Zap",
    featured: true,
  },
  {
    id: "barba",
    name: "Perfilado de Barba",
    description:
      "Diseño y perfilado con navaja. Incluye toalla caliente y aceite.",
    price: 250,
    icon: "PenTool",
    featured: false,
  },
  {
    id: "corte-barba",
    name: "Corte + Barba",
    description:
      "Servicio completo de corte y perfilado de barba. La experiencia premium.",
    price: 550,
    icon: "Crown",
    featured: true,
  },
  {
    id: "color",
    name: "Color & Mechas",
    description:
      "Aplicación de color, mechas o decoloración. Consulta previa incluida.",
    price: 600,
    icon: "Palette",
    featured: false,
  },
  {
    id: "tratamiento-capilar",
    name: "Tratamiento Capilar",
    description:
      "Tratamiento hidratante y nutritivo para cabello. Masaje craneal incluido.",
    price: 300,
    icon: "Sparkles",
    featured: false,
  },
];
