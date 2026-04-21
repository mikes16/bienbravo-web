"use client";

import { useLocation } from "@/context/LocationContext";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { LocationSlug } from "@/config/locations";

interface ToggleOption {
  label: string;
  value: LocationSlug | null;
}

const options: ToggleOption[] = [
  { label: "Todas", value: null },
  { label: "Centro & Sur", value: "centro" },
  { label: "Norte", value: "norte" },
];

interface LocationToggleProps {
  sourceSection: string;
}

export function LocationToggle({ sourceSection }: LocationToggleProps) {
  const { selectedLocation, setSelectedLocation } = useLocation();

  const activeValue =
    selectedLocation === "sur" ? "centro" : selectedLocation;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => {
        const isActive = activeValue === opt.value;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => {
              setSelectedLocation(opt.value);
              trackEvent({
                event: "location_select",
                location_name: opt.label,
                source_section: sourceSection,
              });
            }}
            className={cn(
              "rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none",
              isActive
                ? "bg-bb-primary text-bb-text shadow-[0_0_20px_-4px_rgba(181,55,23,0.4)]"
                : "border border-bb-border text-bb-muted hover:border-bb-border-hover hover:text-bb-text",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
