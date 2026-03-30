"use client";

import { useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap-plugins";
import { Button } from "@/components/ui/Button";
import { ChairSequence, type ChairSequenceHandle } from "@/components/ChairSequence";
import { useSectionView } from "@/hooks/useSectionView";
import { isPreloaderDone } from "@/components/Preloader";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/config/social";

export function Hero() {
  const sectionRef = useSectionView("hero");
  const chairRef = useRef<ChairSequenceHandle>(null);
  const chairWrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const displayTextRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useGSAP(() => {
    gsap.set(
      [chairWrapRef.current, displayTextRef.current,
       taglineRef.current, ctaRef.current, scrollRef.current],
      { autoAlpha: 0 },
    );

    const section = (sectionRef as React.RefObject<HTMLElement>).current;
    if (!section) return;

    gsap.to(bgRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(displayTextRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  const runEntrance = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    chairRef.current?.play(1.0);

    const tl = gsap.timeline();

    tl.to(chairWrapRef.current, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.out",
    })
      .fromTo(displayTextRef.current,
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 1.0, ease: "power3.out" },
        0.2,
      )
      .fromTo(taglineRef.current,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
        1.2,
      )
      .fromTo(ctaRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
        1.5,
      )
      .fromTo(scrollRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, ease: "power2.out" },
        1.8,
      );
  }, []);

  useEffect(() => {
    if (isPreloaderDone()) {
      runEntrance();
      return;
    }
    window.addEventListener("preloader:done", runEntrance);
    return () => window.removeEventListener("preloader:done", runEntrance);
  }, [runEntrance]);

  function handleCtaClick() {
    trackEvent({
      event: "cta_click",
      cta_name: "Reserva Hero",
      cta_location: "hero",
      cta_destination: "whatsapp",
    });
    trackEvent({ event: "whatsapp_click", source_section: "hero" });
  }

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      {/* ── Z-0: Background photo — atmosphere only ── */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.15] blur-[4px]"
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 25%, rgba(17,17,17,0.85) 100%)" }}
        />
      </div>

      {/* ── Z-1: Bottom fade to seamless transition ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30vh]"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(17,17,17,1) 100%)" }}
      />

      {/* ── Z-5: Warm spotlight glow behind chair ── */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-start justify-center pt-[12vh]">
        <div
          className="h-[60vh] w-[60vh] rounded-full opacity-[0.15]"
          style={{ background: "radial-gradient(circle, rgba(200,121,65,0.4) 0%, transparent 65%)" }}
        />
      </div>

      {/* ── Z-8: Display text — outline, behind chair ── */}
      <div
        ref={displayTextRef}
        className="pointer-events-none absolute inset-x-0 top-[22vh] z-[8] flex justify-center select-none sm:top-[18vh]"
      >
        <span
          className="font-display text-[15vw] uppercase leading-[0.85] tracking-tight sm:text-[13vw] lg:text-[11vw]"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(248, 246, 246, 0.15)",
            textShadow: "0 0 30px rgba(200, 121, 65, 0.08), 0 0 60px rgba(200, 121, 65, 0.04)",
          }}
        >
          El Arte del Corte
        </span>
      </div>

      {/* ── Z-10: Chair canvas — centered in upper area ── */}
      <div
        ref={chairWrapRef}
        className="absolute inset-x-0 top-[8vh] bottom-[25vh] z-10 flex items-center justify-center sm:top-[5vh] sm:bottom-[22vh]"
      >
        <ChairSequence
          ref={chairRef}
          className="aspect-square h-full max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]"
        />
      </div>

      {/* ── Z-20: Bottom content — clear of the chair ── */}
      <div className="pointer-events-none relative z-20 mt-auto px-5 pb-14 md:pb-16">
        <div className="flex flex-col items-center gap-4">
          <p
            ref={taglineRef}
            className="max-w-sm text-center text-sm font-medium leading-relaxed text-bb-muted md:max-w-md md:text-base"
          >
            Precisión en cada detalle. Una experiencia que define tu estilo.
          </p>
          <div ref={ctaRef} className="pointer-events-auto flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              variant="primary"
              size="lg"
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCtaClick}
            >
              Reserva ahora
            </Button>
            <Button variant="secondary" size="lg" href="#servicios">
              Ver servicios
            </Button>
          </div>
        </div>
      </div>

      {/* ── Z-25: Scroll Indicator ── */}
      <div ref={scrollRef} className="absolute bottom-3 left-1/2 z-[25] -translate-x-1/2">
        <a
          href="#nosotros"
          className="flex flex-col items-center gap-1.5 text-bb-muted transition-colors hover:text-bb-text"
          aria-label="Deslizar"
        >
          <span className="text-xs uppercase tracking-[0.2em]">Deslizar</span>
          <ChevronDown size={20} style={{ animation: "bounce-subtle 2s ease-in-out infinite" }} />
        </a>
      </div>
    </section>
  );
}
