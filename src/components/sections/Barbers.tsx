"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { gsap, useGSAP } from "@/lib/gsap-plugins";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";
import { useSectionView } from "@/hooks/useSectionView";
import { useLocation } from "@/context/LocationContext";
import { trackEvent } from "@/lib/analytics";
import { getBarbers, getBarbersByLocation } from "@/data";
import { getWhatsAppUrl, whatsappConfig } from "@/config/social";
import { statLabels, type Barber, type BarberStats } from "@/config/barbers";
import { DURATIONS, EASINGS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { LocationSlug } from "@/config/locations";

/* ───── Location Filter Tabs ───── */

const locationTabs: { label: string; value: LocationSlug }[] = [
  { label: "Norte", value: "norte" },
  { label: "Centro", value: "centro" },
  { label: "Sur", value: "sur" },
];

function BarberLocationTabs({
  active,
  onChange,
}: {
  active: LocationSlug;
  onChange: (slug: LocationSlug) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {locationTabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => {
            onChange(tab.value);
            trackEvent({
              event: "location_select",
              location_name: tab.label,
              source_section: "barbers",
            });
          }}
          className={cn(
            "rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none",
            active === tab.value
              ? "bg-bb-primary text-bb-text shadow-[0_0_20px_-4px_rgba(181,55,23,0.4)]"
              : "border border-bb-border text-bb-muted hover:border-bb-border-hover hover:text-bb-text",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ───── Stat Bar ───── */

function StatBar({
  label,
  value,
  index,
  triggerKey,
}: {
  label: string;
  value: number;
  index: number;
  triggerKey: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!barRef.current) return;
      gsap.fromTo(
        barRef.current,
        { width: 0 },
        {
          width: `${value}%`,
          duration: DURATIONS.slow + 0.2,
          delay: index * 0.08,
          ease: EASINGS.smooth,
        },
      );
    },
    { dependencies: [value, index, triggerKey] },
  );

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs uppercase tracking-wider text-bb-muted">
        {label}
      </span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bb-surface">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${value}%`,
            background:
              value >= 90
                ? "var(--bb-primary)"
                : value >= 80
                  ? "linear-gradient(90deg, var(--bb-primary), var(--bb-copper))"
                  : "var(--bb-copper)",
          }}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-xs font-bold tabular-nums text-bb-text">
        {value}
      </span>
    </div>
  );
}

/* ───── Thumbnail ───── */

function Thumbnail({
  barber,
  isSelected,
  onClick,
}: {
  barber: Barber;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/thumb relative aspect-square w-16 overflow-hidden rounded-[var(--radius-md)] transition-all duration-300 cursor-pointer md:w-20",
        isSelected
          ? "ring-2 ring-bb-primary shadow-[0_0_16px_-2px_rgba(181,55,23,0.5)] scale-105"
          : "opacity-50 grayscale hover:opacity-80 hover:grayscale-0",
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${barber.photo}')` }}
      />
      {isSelected && (
        <div className="absolute inset-0 border-2 border-bb-primary rounded-[var(--radius-md)]" />
      )}
    </button>
  );
}

/* ───── Detail Panel ───── */

function DetailPanel({
  barber,
  triggerKey,
}: {
  barber: Barber;
  triggerKey: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const whatsappUrl = getWhatsAppUrl(
    whatsappConfig.barberMessage(barber.name),
  );

  useGSAP(
    () => {
      if (!panelRef.current) return;
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: DURATIONS.normal, ease: EASINGS.smooth },
      );
    },
    { dependencies: [triggerKey] },
  );

  function handleCTA() {
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
    <div ref={panelRef} className="flex flex-col gap-5">
      {/* Name & Title */}
      <div>
        <h3 className="font-display text-3xl uppercase leading-tight md:text-4xl lg:text-5xl">
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
            triggerKey={triggerKey}
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
      <Button
        variant="primary"
        size="md"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleCTA}
        className="mt-1 w-full sm:w-auto"
      >
        <MessageCircle size={16} />
        Agendar
      </Button>
    </div>
  );
}

/* ───── Character Select Section ───── */

export function Barbers() {
  const sectionRef = useSectionView("barbers");
  const { selectedLocation } = useLocation();

  const [activeTab, setActiveTab] = useState<LocationSlug>(
    selectedLocation ?? "norte",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredBarbers = useMemo(
    () => getBarbersByLocation(activeTab),
    [activeTab],
  );

  // When switching tabs, select first barber of new location
  const handleTabChange = useCallback(
    (slug: LocationSlug) => {
      setActiveTab(slug);
      setSelectedId(null);
    },
    [],
  );

  const activeBarberId = selectedId ?? filteredBarbers[0]?.id ?? null;
  const activeBarber = filteredBarbers.find((b) => b.id === activeBarberId);

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
            title="Elige Tu Barbero"
            description="Selecciona tu barbero favorito y agenda tu cita."
          />
        </FadeIn>

        {/* Location tabs */}
        <FadeIn direction="up" delay={0.1}>
          <div className="mb-12 flex justify-center">
            <BarberLocationTabs active={activeTab} onChange={handleTabChange} />
          </div>
        </FadeIn>

        {/* Character Select Layout */}
        <FadeIn direction="up" delay={0.2}>
          <div
            key={activeTab}
            className="mx-auto max-w-4xl overflow-hidden rounded-[var(--radius-lg)] border border-bb-border bg-bb-surface"
          >
            <div className="grid md:grid-cols-[1fr_1.2fr]">
              {/* Left: Photo */}
              {activeBarber && (
                <div className="relative aspect-[3/4] overflow-hidden bg-bb-surface-2 md:aspect-auto md:min-h-[480px]">
                  <div
                    key={activeBarberId}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-[fadeIn_0.3s_ease-out]"
                    style={{
                      backgroundImage: `url('${activeBarber.photo}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bb-surface/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-bb-surface/90" />

                  {/* Mobile: name overlay */}
                  <div className="absolute bottom-4 left-4 md:hidden">
                    <h3 className="font-display text-2xl uppercase text-bb-text">
                      {activeBarber.name}
                    </h3>
                  </div>
                </div>
              )}

              {/* Right: Info + Thumbnails */}
              <div className="flex flex-col gap-6 p-6 md:p-8">
                {/* Thumbnail grid */}
                <div className="flex flex-wrap gap-2">
                  {filteredBarbers.map((barber) => (
                    <Thumbnail
                      key={barber.id}
                      barber={barber}
                      isSelected={barber.id === activeBarberId}
                      onClick={() => {
                        setSelectedId(barber.id);
                        trackEvent({
                          event: "barber_select",
                          barber_name: barber.name,
                          location_name: activeTab,
                        });
                      }}
                    />
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-bb-border" />

                {/* Detail panel */}
                {activeBarber && (
                  <DetailPanel
                    barber={activeBarber}
                    triggerKey={activeBarberId!}
                  />
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
