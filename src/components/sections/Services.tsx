"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";
import { useSectionView } from "@/hooks/useSectionView";
import { trackEvent } from "@/lib/analytics";
import { getServices } from "@/data";
import { getWhatsAppUrl } from "@/config/social";
import { cn } from "@/lib/cn";
import type { Service } from "@/config/services";

function ServiceIcon({ name }: { name: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name];
  if (!Icon) return null;
  return <Icon size={20} className="text-bb-primary" />;
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const [expanded, setExpanded] = useState(false);

  function toggle() {
    setExpanded((prev) => !prev);
    if (!expanded) {
      trackEvent({ event: "service_card_view", service_name: service.name });
    }
  }

  return (
    <FadeIn direction="up" delay={index * 0.06}>
        <div
          className="group border-b border-bb-border transition-colors duration-300 hover:bg-white/[0.03]"
        >
        <button
          type="button"
          onClick={toggle}
          className="flex w-full cursor-pointer items-center gap-4 py-5 text-left md:py-6"
        >
          <ServiceIcon name={service.icon} />

          <span className="font-display text-base uppercase tracking-wide md:text-lg">
            {service.name}
          </span>

          <span className="mx-2 hidden flex-1 border-b border-dotted border-bb-border/50 sm:block" />

          <span className="ml-auto flex items-center gap-3 whitespace-nowrap">
            <span className="font-display text-xl text-bb-primary md:text-2xl">
              ${service.price}
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
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
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
                href={getWhatsAppUrl()}
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

export function Services() {
  const sectionRef = useSectionView("services");
  const services = getServices();

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
        </Container>

        <Container className="mt-12 max-w-3xl md:mt-16">
          <div className="border-t border-bb-border">
            {services.map((service, i) => (
              <ServiceRow key={service.id} service={service} index={i} />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
