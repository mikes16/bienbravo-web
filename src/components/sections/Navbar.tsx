"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getWhatsAppUrl } from "@/config/social";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(label: string, href: string) {
    trackEvent({ event: "navbar_link_click", link_name: label, link_target: href });
    setMobileOpen(false);
  }

  function handleCtaClick() {
    trackEvent({
      event: "cta_click",
      cta_name: "Reserva",
      cta_location: "navbar",
      cta_destination: "whatsapp",
    });
    trackEvent({
      event: "whatsapp_click",
      source_section: "navbar",
    });
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bb-bg/80 backdrop-blur-xl border-b border-bb-border"
          : "bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <a href="#" className="flex-shrink-0">
          <img
            src="/logos/logo-white.png"
            alt={siteConfig.name}
            className="h-5 w-auto md:h-6"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.label, link.href)}
              className="text-sm font-semibold uppercase tracking-[0.15em] text-bb-muted transition-colors duration-200 hover:text-bb-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button
            variant="primary"
            size="sm"
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
          >
            Reserva
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex items-center justify-center p-2 text-bb-text md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-80 border-b border-bb-border bg-bb-bg/95 backdrop-blur-xl" : "max-h-0"
        )}
      >
        <Container className="flex flex-col gap-4 pb-6 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.label, link.href)}
              className="text-sm font-semibold uppercase tracking-[0.15em] text-bb-muted transition-colors hover:text-bb-text"
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="primary"
            size="sm"
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="mt-2 w-full"
          >
            Reserva
          </Button>
        </Container>
      </div>
    </header>
  );
}
