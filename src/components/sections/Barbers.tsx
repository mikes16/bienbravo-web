"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-plugins";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren } from "@/components/animations/StaggerChildren";
import { useSectionView } from "@/hooks/useSectionView";
import { trackEvent } from "@/lib/analytics";
import { getBarbers } from "@/data";
import { getWhatsAppUrl, whatsappConfig } from "@/config/social";
import { statLabels, type Barber, type BarberStats } from "@/config/barbers";
import { DURATIONS, EASINGS } from "@/lib/constants";

function StatBar({ label, value, index }: { label: string; value: number; index: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!barRef.current) return;

    gsap.from(barRef.current, {
      width: 0,
      duration: DURATIONS.slow + 0.2,
      delay: index * 0.08,
      ease: EASINGS.smooth,
      scrollTrigger: {
        trigger: barRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  }, { dependencies: [value, index] });

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs text-bb-muted">{label}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden bg-bb-surface-2 rounded-full">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 rounded-full bg-bb-primary"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-semibold tabular-nums text-bb-text">
        {value}
      </span>
    </div>
  );
}

function BarberCard({ barber }: { barber: Barber }) {
  const whatsappUrl = getWhatsAppUrl(
    whatsappConfig.barberMessage(barber.name),
    barber.whatsappNumber
  );

  function handleWhatsAppClick() {
    trackEvent({
      event: "cta_click",
      cta_name: `Agendar ${barber.name}`,
      cta_location: "barbers",
      cta_destination: "whatsapp",
    });
    trackEvent({
      event: "whatsapp_click",
      barber_name: barber.name,
      source_section: "barbers",
    });
  }

  return (
    <div
      className="group flex flex-col border border-bb-border bg-bb-surface transition-all duration-300 hover:border-bb-primary/40 hover:shadow-[0_0_40px_-10px_rgba(181,55,23,0.2)]"
      onMouseEnter={() =>
        trackEvent({ event: "barber_card_hover", barber_name: barber.name })
      }
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-bb-surface-2">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${barber.photo}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bb-surface/80 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        {/* Name & Title */}
        <div>
          <h3 className="font-display text-xl uppercase leading-tight md:text-2xl">
            {barber.name}
          </h3>
          <span className="mt-1 block text-sm text-bb-muted">{barber.title}</span>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2.5">
          {(Object.keys(barber.stats) as (keyof BarberStats)[]).map((key, i) => (
            <StatBar
              key={key}
              label={statLabels[key]}
              value={barber.stats[key]}
              index={i}
            />
          ))}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2">
          {barber.specialties.map((spec) => (
            <Badge key={spec}>{spec}</Badge>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2">
          <Button
            variant="primary"
            size="sm"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="w-full"
          >
            <MessageCircle size={16} />
            Agendar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Barbers() {
  const sectionRef = useSectionView("barbers");
  const barbers = getBarbers();

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="barberos"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="El Equipo"
            title="Nuestros Barberos"
            description="Profesionales seleccionados por su excelencia, pasión y compromiso con cada detalle."
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((barber, i) => (
            <FadeIn key={barber.id} direction="up" delay={i * 0.1}>
              <BarberCard barber={barber} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
