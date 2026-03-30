"use client";

import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { footerColumns } from "@/config/navigation";
import { socialLinks } from "@/config/social";
import { trackEvent } from "@/lib/analytics";
import { useSectionView } from "@/hooks/useSectionView";
import * as LucideIcons from "lucide-react";

function SocialIcon({ name }: { name: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name];
  if (!Icon) return null;
  return <Icon size={18} />;
}

export function Footer() {
  const sectionRef = useSectionView("footer");

  function handleLinkClick(label: string, href: string) {
    trackEvent({ event: "footer_link_click", link_name: label, link_target: href });
  }

  return (
    <footer
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="border-t border-bb-border bg-bb-surface-2 py-16 md:py-20"
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-display text-2xl uppercase tracking-wider">
              {siteConfig.name}
            </span>
            <p className="mt-2 text-sm text-bb-muted">{siteConfig.tagline}</p>
          </div>

          {/* Link Columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-bb-muted">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => handleLinkClick(link.label, link.href)}
                      className="text-sm text-bb-text/70 transition-colors hover:text-bb-text"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-bb-muted">
              Conectar
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.platform, link.url)}
                  className="flex h-10 w-10 items-center justify-center border border-bb-border text-bb-muted transition-all hover:border-bb-primary/40 hover:text-bb-text"
                  aria-label={link.platform}
                >
                  <SocialIcon name={link.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-bb-border pt-8 text-xs text-bb-muted md:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </span>
          <span className="font-display uppercase tracking-wider">
            EST. {siteConfig.established}
          </span>
        </div>
      </Container>
    </footer>
  );
}
