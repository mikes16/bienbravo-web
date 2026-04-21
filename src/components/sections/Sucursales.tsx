"use client";

import { MapPin, Clock, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";
import { useSectionView } from "@/hooks/useSectionView";
import { useLocation } from "@/context/LocationContext";
import { trackEvent } from "@/lib/analytics";
import { getLocations } from "@/data";
import type { Location } from "@/config/locations";

function LocationCard({
  location,
  index,
}: {
  location: Location;
  index: number;
}) {
  const { selectAndScroll } = useLocation();

  function handleClick() {
    trackEvent({
      event: "location_select",
      location_name: location.name,
      source_section: "sucursales",
    });
    selectAndScroll(location.slug, "servicios");
  }

  const isAppointment = location.bookingModel === "appointment";

  return (
    <FadeIn direction="up" delay={index * 0.12} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden border border-bb-border bg-bb-surface transition-all duration-300 hover:border-bb-primary/40 hover:shadow-[0_0_40px_-10px_rgba(181,55,23,0.2)] rounded-[var(--radius-lg)]">
        {/* Photo */}
        <div className="relative aspect-[16/10] overflow-hidden bg-bb-surface-2">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${location.photo}')` }}
          />
          {/* Fallback gradient when no photo */}
          <div
            className="absolute inset-0"
            style={{
              background: isAppointment
                ? "linear-gradient(135deg, rgba(181,39,24,0.15) 0%, rgba(17,17,17,0.9) 100%)"
                : "linear-gradient(135deg, rgba(200,121,65,0.12) 0%, rgba(17,17,17,0.9) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bb-surface via-bb-surface/20 to-transparent" />

          {/* Booking model badge */}
          <div className="absolute top-4 right-4">
            <Badge
              className={
                isAppointment
                  ? "border-bb-primary/40 bg-bb-primary/20 text-bb-primary"
                  : "border-bb-copper/40 bg-bb-copper/20 text-bb-copper"
              }
            >
              {isAppointment ? "Con cita" : "Sin cita"}
            </Badge>
          </div>

          {/* Location name overlay on photo */}
          <div className="absolute bottom-4 left-5">
            <span className="font-display text-3xl uppercase tracking-wider text-bb-text/30 md:text-4xl">
              {location.fullName}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
          <div>
            <h3 className="font-display text-2xl uppercase leading-tight md:text-3xl">
              {location.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-bb-muted">
              {location.tagline}
            </p>
          </div>

          {/* Features */}
          <ul className="flex flex-col gap-1.5">
            {location.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-bb-muted"
              >
                <ChevronRight size={12} className="text-bb-primary" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-bb-muted">
            <MapPin size={14} className="mt-0.5 shrink-0 text-bb-primary" />
            <a
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-bb-text"
            >
              {location.address}
            </a>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-2 text-sm text-bb-muted">
            <Clock size={14} className="mt-0.5 shrink-0 text-bb-primary" />
            <div className="flex flex-col gap-0.5">
              {location.hours.map((h) => (
                <span key={h.days}>
                  {h.days}: {h.hours}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClick}
              className="w-full"
            >
              Ver servicios
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export function Sucursales() {
  const sectionRef = useSectionView("sucursales");
  const locations = getLocations();

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="sucursales"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Encuéntranos"
            title="Sucursales"
            description="Tres experiencias, un mismo estándar de excelencia."
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location, i) => (
            <LocationCard key={location.slug} location={location} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
