"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { LocationSlug } from "@/config/locations";

interface LocationContextValue {
  selectedLocation: LocationSlug | null;
  setSelectedLocation: (slug: LocationSlug | null) => void;
  selectAndScroll: (slug: LocationSlug, targetId: string) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSlug | null>(null);

  const selectAndScroll = useCallback(
    (slug: LocationSlug, targetId: string) => {
      setSelectedLocation(slug);
      requestAnimationFrame(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ selectedLocation, setSelectedLocation, selectAndScroll }),
    [selectedLocation, selectAndScroll],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return ctx;
}
