"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-plugins";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";
import { Parallax } from "@/components/animations/Parallax";
import { useSectionView } from "@/hooks/useSectionView";
import { siteConfig } from "@/config/site";
import { DURATIONS, EASINGS } from "@/lib/constants";

interface CounterItem {
  label: string;
  value: number;
  suffix: string;
}

const counters: CounterItem[] = [
  { label: "Años de experiencia", value: new Date().getFullYear() - siteConfig.established, suffix: "+" },
  { label: "Barberos profesionales", value: 15, suffix: "+" },
  { label: "Clientes satisfechos", value: 10, suffix: "k+" },
];

export function About() {
  const sectionRef = useSectionView("about");
  const countersRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!countersRef.current) return;

    const numberEls = countersRef.current.querySelectorAll("[data-counter-value]");
    numberEls.forEach((el) => {
      const target = Number(el.getAttribute("data-counter-value"));
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: EASINGS.smooth,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toString();
        },
      });
    });
  });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="nosotros"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Photo Collage — main image + 4 satellites */}
          <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[650px]">
            {/* Image 1: Main — large, anchored top-left */}
            <FadeIn direction="left" className="absolute left-0 top-0 w-[70%]" delay={0}>
              <Parallax speed={-0.15}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-bb-border">
                  <img src="/images/about-1.webp" alt="Interior Bien Bravo" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bb-bg/50 to-transparent" />
                </div>
              </Parallax>
            </FadeIn>

            {/* Image 4: Small — top-right, tucked next to main */}
            <FadeIn direction="right" className="absolute right-0 top-[3%] w-[28%]" delay={0.1}>
              <Parallax speed={-0.35}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-bb-border">
                  <img src="/images/about-4.webp" alt="Ambiente Bien Bravo" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bb-bg/40 to-transparent" />
                </div>
              </Parallax>
            </FadeIn>

            {/* Image 2: Medium — right, overlapping main */}
            <FadeIn direction="up" className="absolute right-[2%] top-[38%] w-[48%]" delay={0.15}>
              <Parallax speed={-0.45}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-bb-border">
                  <img src="/images/about-2.webp" alt="Detalle del servicio" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bb-bg/40 to-transparent" />
                </div>
              </Parallax>
            </FadeIn>

            {/* Image 3: Small square — bottom-left */}
            <FadeIn direction="up" className="absolute bottom-[0%] left-[2%] w-[30%]" delay={0.2}>
              <Parallax speed={-0.6}>
                <div className="relative aspect-square overflow-hidden rounded-sm border border-bb-border">
                  <img src="/images/about-3.webp" alt="Detalle Bien Bravo" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bb-bg/40 to-transparent" />
                </div>
              </Parallax>
            </FadeIn>

            {/* Image 5: Small square — bottom-center */}
            <FadeIn direction="up" className="absolute bottom-[5%] left-[35%] w-[25%]" delay={0.25}>
              <Parallax speed={-0.5}>
                <div className="relative aspect-square overflow-hidden rounded-sm border border-bb-border">
                  <img src="/images/about-5.webp" alt="Experiencia Bien Bravo" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bb-bg/40 to-transparent" />
                </div>
              </Parallax>
            </FadeIn>

            {/* Decorative line */}
            <div className="absolute -right-4 top-8 h-32 w-px bg-bb-primary/50 md:-right-8" />
          </div>

          {/* Content */}
          <div>
            <FadeIn direction="up">
              <SectionHeading
                eyebrow={`EST. ${siteConfig.established}`}
                title="Nuestra historia"
                description="Desde nuestros inicios, la misión ha sido clara: elevar el estándar del cuidado masculino. No somos solo una barbería — somos un ecosistema de bienestar, producto y comunidad."
                align="left"
              />
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-bb-muted leading-relaxed">
                Cada detalle en Bien Bravo está pensado para crear una experiencia memorable.
                Desde la selección de nuestros profesionales hasta el ambiente de cada sucursal,
                todo refleja nuestro compromiso con la excelencia.
              </p>
            </FadeIn>

            {/* Counters */}
            <div ref={countersRef} className="mt-12 grid grid-cols-3 gap-6">
              {counters.map((counter) => (
                <div key={counter.label} className="text-center lg:text-left">
                  <div className="font-display text-3xl text-bb-primary md:text-4xl">
                    <span data-counter-value={counter.value}>0</span>
                    <span>{counter.suffix}</span>
                  </div>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-bb-muted">
                    {counter.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
