import { barbers, premiumBarber, type Barber, type PremiumBarber } from "@/config/barbers";
import type { LocationSlug } from "@/config/locations";

export function getBarbers(): Barber[] {
  return barbers;
}

export function getBarberById(id: string): Barber | undefined {
  return barbers.find((b) => b.id === id);
}

export function getBarbersByLocation(slug: LocationSlug): Barber[] {
  return barbers.filter((b) => b.locationSlugs.includes(slug));
}

export function getPremiumBarber(): PremiumBarber {
  return premiumBarber;
}
