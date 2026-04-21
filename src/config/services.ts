export interface Service {
  id: string;
  name: string;
  description: string;
  price: number | string;
  icon: string;
  featured: boolean;
  category?: "individual" | "extra" | "combo";
}

export interface LocationMenu {
  locationGroup: "centro-sur" | "norte";
  label: string;
  bookingNote: string;
  services: Service[];
}

export const locationMenus: LocationMenu[] = [
  {
    locationGroup: "centro-sur",
    label: "Centro & Sur",
    bookingNote: "Sin cita previa",
    services: [
      {
        id: "cs-corte",
        name: "Corte",
        description: "Servicio práctico y ágil. Llegas, haces fila y te atendemos en tu turno.",
        price: 200,
        icon: "Scissors",
        featured: true,
      },
      {
        id: "cs-barba",
        name: "Barba",
        description: "Perfilado y diseño de barba con precisión.",
        price: 100,
        icon: "PenTool",
        featured: false,
      },
      {
        id: "cs-ritual",
        name: "Ritual con Toallas",
        description: "Tratamiento de barba con toallas calientes para una experiencia relajante.",
        price: 180,
        icon: "Sparkles",
        featured: true,
      },
      {
        id: "cs-delineado",
        name: "Delineado",
        description: "Definición precisa de líneas y contornos para un acabado impecable.",
        price: 100,
        icon: "PenTool",
        featured: false,
      },
      {
        id: "cs-ceja",
        name: "Ceja",
        description: "Perfilado y definición de cejas para un look limpio.",
        price: 70,
        icon: "Eye",
        featured: false,
      },
      {
        id: "cs-mascarilla",
        name: "Mascarilla",
        description: "Tratamiento facial con mascarilla para revitalizar la piel.",
        price: 80,
        icon: "Droplets",
        featured: false,
      },
      {
        id: "cs-facial",
        name: "Facial",
        description: "Tratamiento facial completo para una piel renovada y saludable.",
        price: 250,
        icon: "Heart",
        featured: true,
      },
      {
        id: "cs-grecas",
        name: "Grecas",
        description: "Diseños y líneas artísticas para un estilo único.",
        price: "$30 – $50",
        icon: "Palette",
        featured: false,
      },
    ],
  },
  {
    locationGroup: "norte",
    label: "Norte",
    bookingNote: "Solo con cita previa",
    services: [
      {
        id: "n-corte",
        name: "Corte",
        description:
          "Incluye lavado de cabello, asesoramiento personalizado y atención especializada.",
        price: 280,
        icon: "Scissors",
        featured: true,
      },
      {
        id: "n-barba-clasica",
        name: "Barba Clásica",
        description: "Perfilado y diseño de barba con técnica tradicional.",
        price: 150,
        icon: "PenTool",
        featured: false,
      },
      {
        id: "n-barba-ritual",
        name: "Barba Ritual Toalla",
        description:
          "Experiencia premium de barba con toallas calientes y productos especializados.",
        price: 250,
        icon: "Sparkles",
        featured: true,
      },
      {
        id: "n-facial",
        name: "Facial Relajante",
        description: "Tratamiento facial completo para revitalizar y relajar.",
        price: 250,
        icon: "Heart",
        featured: true,
      },
      {
        id: "n-bigote",
        name: "Bigote",
        description: "Perfilado y definición del bigote.",
        price: 100,
        icon: "PenTool",
        featured: false,
        category: "extra",
      },
      {
        id: "n-ceja",
        name: "Ceja",
        description: "Perfilado y definición de cejas.",
        price: 100,
        icon: "Eye",
        featured: false,
        category: "extra",
      },
      {
        id: "n-greca",
        name: "Greca",
        description: "Diseños y líneas artísticas personalizadas.",
        price: "$50 – $100",
        icon: "Palette",
        featured: false,
        category: "extra",
      },
      {
        id: "n-combo-corte-barba",
        name: "Corte + Barba Clásica",
        description: "Servicio completo de corte y perfilado de barba.",
        price: 400,
        icon: "Crown",
        featured: true,
        category: "combo",
      },
      {
        id: "n-combo-corte-ritual",
        name: "Corte + Barba Ritual",
        description: "Corte premium con experiencia de barba ritual y toallas calientes.",
        price: 500,
        icon: "Crown",
        featured: true,
        category: "combo",
      },
      {
        id: "n-combo-corte-facial",
        name: "Corte + Facial",
        description: "Corte con tratamiento facial relajante incluido.",
        price: 500,
        icon: "Crown",
        featured: false,
        category: "combo",
      },
      {
        id: "n-combo-completo",
        name: "Corte + Barba Ritual + Facial",
        description:
          "La experiencia más completa: corte, barba ritual con toallas y facial relajante.",
        price: 750,
        icon: "Crown",
        featured: true,
        category: "combo",
      },
    ],
  },
];
