"use client";

import { useState } from "react";
import {
  ChevronRight,
  Crown,
  Droplets,
  Eye,
  Heart,
  Palette,
  PenTool,
  Scissors,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LocationToggle } from "@/components/ui/LocationToggle";
import { FadeIn } from "@/components/animations/FadeIn";
import { useSectionView } from "@/hooks/useSectionView";
import { useLocation } from "@/context/LocationContext";
import { trackEvent } from "@/lib/analytics";
import { getLocationMenus } from "@/data";
import { getWhatsAppUrl, whatsappConfig } from "@/config/social";
import { cn } from "@/lib/cn";
import type { Service, LocationMenu } from "@/config/services";

const SERVICE_ICONS = {
  Crown,
  Droplets,
  Eye,
  Heart,
  Palette,
  PenTool,
  Scissors,
  Sparkles,
} as const;

type ServiceIconName = keyof typeof SERVICE_ICONS;

function ServiceIcon({ name }: { name: string }) {
  const Icon = SERVICE_ICONS[name as ServiceIconName];
  if (!Icon) return null;
  return <Icon size={20} className="text-bb-primary" />;
}

function ServiceRow({
  service,
  index,
  locationLabel,
}: {
  service: Service;
  index: number;
  locationLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const isCombo = service.category === "combo";
  const isExtra = service.category === "extra";
  const priceDisplay =
    typeof service.price === "string" ? service.price : `$${service.price}`;

  const whatsappMessage = whatsappConfig.locationMessage(locationLabel);

  function toggle() {
    setExpanded((prev) => !prev);
    if (!expanded) {
      trackEvent({ event: "service_card_view", service_name: service.name });
    }
  }

  return (
    <FadeIn direction="up" delay={index * 0.06}>
      <div
        className={cn(
          "group border-b border-bb-border transition-colors duration-300 hover:bg-white/[0.03]",
          isCombo && "border-l-2 border-l-bb-copper/60 pl-2",
        )}
      >
        <button
          type="button"
          onClick={toggle}
          className="flex w-full cursor-pointer items-center gap-4 py-5 text-left md:py-6"
        >
          <ServiceIcon name={service.icon} />

          <span className="flex items-center gap-2">
            <span className="font-display text-base uppercase tracking-wide md:text-lg">
              {service.name}
            </span>
            {isCombo && (
              <Badge className="border-bb-copper/40 bg-bb-copper/10 text-bb-copper text-[10px] py-0.5 px-1.5">
                Combo
              </Badge>
            )}
            {isExtra && (
              <Badge className="text-[10px] py-0.5 px-1.5">Extra</Badge>
            )}
          </span>

          <span className="mx-2 hidden flex-1 border-b border-dotted border-bb-border/50 sm:block" />

          <span className="ml-auto flex items-center gap-3 whitespace-nowrap">
            <span className="font-display text-xl text-bb-primary md:text-2xl">
              {priceDisplay}
            </span>
            <span className="text-xs text-bb-muted">MXN</span>
          </span>

          <ChevronRight
            size={16}
            className={cn(
              "shrink-0 text-bb-muted transition-transform duration-300",
              expanded && "rotate-90",
            )}
          />
        </button>

        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            expanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 pb-5 pl-9 pr-4 md:flex-row md:items-center md:justify-between md:pb-6 md:pl-10">
              <p className="max-w-md text-sm leading-relaxed text-bb-muted">
                {service.description}
              </p>
              <Button
                variant="secondary"
                size="sm"
                href={getWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent({
                    event: "cta_click",
                    cta_name: `Reservar ${service.name}`,
                    cta_location: "services",
                    cta_destination: "whatsapp",
                  });
                }}
                className="shrink-0 self-start md:self-center"
              >
                Reservar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function MenuGroup({ menu }: { menu: LocationMenu }) {
  const isNorte = menu.locationGroup === "norte";
  const individuales = menu.services.filter(
    (s) => !s.category || s.category === "individual",
  );
  const extras = menu.services.filter((s) => s.category === "extra");
  const combos = menu.services.filter((s) => s.category === "combo");

  let serviceIndex = 0;

  return (
    <div>
      {/* Group header */}
      <FadeIn direction="up">
        <div className="mb-4 flex items-center gap-3">
          <h3 className="font-display text-lg uppercase tracking-wider text-bb-text md:text-xl">
            {menu.label}
          </h3>
          <Badge
            className={
              isNorte
                ? "border-bb-primary/40 bg-bb-primary/10 text-bb-primary"
                : "border-bb-copper/40 bg-bb-copper/10 text-bb-copper"
            }
          >
            {menu.bookingNote}
          </Badge>
        </div>
        <p className="mb-6 text-sm text-bb-muted">
          {isNorte
            ? "Experiencia premium con cita. Incluye lavado y consultoría personalizada."
            : "Servicio rápido y sin cita. Llegas, esperas y te atendemos."}
        </p>
      </FadeIn>

      {/* Individual services */}
      <div className="border-t border-bb-border">
        {individuales.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            index={serviceIndex++}
            locationLabel={menu.label}
          />
        ))}
      </div>

      {/* Extras */}
      {extras.length > 0 && (
        <div className="mt-6">
          <FadeIn direction="up">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-bb-muted">
              Extras
            </h4>
          </FadeIn>
          <div className="border-t border-bb-border">
            {extras.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={serviceIndex++}
                locationLabel={menu.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* Combos */}
      {combos.length > 0 && (
        <div className="mt-6">
          <FadeIn direction="up">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-bb-copper">
              Combos
            </h4>
          </FadeIn>
          <div className="border-t border-bb-border">
            {combos.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={serviceIndex++}
                locationLabel={menu.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Services() {
  const sectionRef = useSectionView("services");
  const menus = getLocationMenus();
  const { selectedLocation } = useLocation();

  // Determine which menus to show based on selection
  const activeGroup =
    selectedLocation === "norte"
      ? "norte"
      : selectedLocation === "centro" || selectedLocation === "sur"
        ? "centro-sur"
        : null;

  const visibleMenus = activeGroup
    ? menus.filter((m) => m.locationGroup === activeGroup)
    : menus;

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="servicios"
      className="relative py-24 md:py-32 lg:py-40"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondo_servicios.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.07] blur-[8px]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(17,17,17,0.92) 100%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <Container>
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Lo que hacemos"
              title="Servicios"
              description="Cada servicio es una experiencia diseñada con precisión."
            />
          </FadeIn>

          {/* Location Toggle */}
          <FadeIn direction="up" delay={0.1}>
            <div className="mb-12 flex justify-center">
              <LocationToggle sourceSection="services" />
            </div>
          </FadeIn>
        </Container>

        <Container className="max-w-3xl">
          <div
            key={activeGroup ?? "all"}
            className="flex flex-col gap-16"
          >
            {visibleMenus.map((menu) => (
              <MenuGroup key={menu.locationGroup} menu={menu} />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
