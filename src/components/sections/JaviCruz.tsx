"use client";

import { MessageCircle, Award, CalendarCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";
import { useSectionView } from "@/hooks/useSectionView";
import { trackEvent } from "@/lib/analytics";
import { getPremiumBarber } from "@/data";
import { getWhatsAppUrl, whatsappConfig } from "@/config/social";

export function JaviCruz() {
  const sectionRef = useSectionView("javi-cruz");
  const javi = getPremiumBarber();
  const whatsappUrl = getWhatsAppUrl(whatsappConfig.premiumMessage);

  function handleCTA() {
    trackEvent({
      event: "cta_click",
      cta_name: "Agendar con Javi",
      cta_location: "javi-cruz",
      cta_destination: "whatsapp",
    });
    trackEvent({
      event: "whatsapp_click",
      barber_name: javi.name,
      source_section: "javi-cruz",
    });
  }

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="javi-cruz"
      className="relative overflow-hidden bg-bb-surface-2 py-24 md:py-32 lg:py-40"
    >
      {/* Atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(200,121,65,0.08) 0%, transparent 60%)",
        }}
      />

      <Container>
        <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <FadeIn direction="left">
            <div className="flex flex-col gap-6 lg:order-1">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-bb-copper">
                Experiencia Premium
              </span>

              <h2 className="font-display text-5xl uppercase leading-[1.05] md:text-6xl lg:text-7xl">
                {javi.name}
              </h2>

              <p className="text-lg text-bb-muted">{javi.title}</p>

              <div className="flex flex-wrap gap-2">
                <Badge className="border-bb-copper/40 bg-bb-copper/10 text-bb-copper">
                  <Award size={12} className="mr-1" />
                  {javi.experience}
                </Badge>
                <Badge className="border-bb-primary/40 bg-bb-primary/10 text-bb-primary">
                  <CalendarCheck size={12} className="mr-1" />
                  {javi.bookingNote}
                </Badge>
              </div>

              <p className="max-w-lg leading-relaxed text-bb-muted">
                {javi.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-bb-copper md:text-5xl">
                  ${javi.price}
                </span>
                <span className="text-sm text-bb-muted">MXN / corte</span>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {javi.specialties.map((spec) => (
                  <Badge key={spec}>{spec}</Badge>
                ))}
              </div>

              {/* CTA */}
              <Button
                variant="primary"
                size="lg"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCTA}
                className="mt-2 w-full sm:w-auto"
              >
                <MessageCircle size={18} />
                Agendar con Javi
              </Button>
            </div>
          </FadeIn>

          {/* Photo */}
          <FadeIn direction="right" delay={0.15}>
            <div className="relative mx-auto max-w-md lg:order-2 lg:max-w-none">
              <div className="relative aspect-[3/4] overflow-hidden bg-bb-surface-2">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${javi.photo}')` }}
                />
                {/* Soft edge fade — subtle vignette into background */}
                <div
                  className="absolute inset-0"
                  style={{
                    boxShadow: "inset 0 0 60px 30px var(--bb-surface-2)",
                  }}
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
