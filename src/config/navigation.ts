export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Servicios", href: "#servicios" },
  { label: "Barberos", href: "#barberos" },
  { label: "Nosotros", href: "#nosotros" },
];

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Explorar",
    links: [
      { label: "Servicios", href: "#servicios" },
      { label: "Barberos", href: "#barberos" },
      { label: "Nosotros", href: "#nosotros" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { label: "Aviso de privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
    ],
  },
];
