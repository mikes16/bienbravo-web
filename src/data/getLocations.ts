import { locations, type Location, type LocationSlug } from "@/config/locations";

export function getLocations(): Location[] {
  return locations;
}

export function getLocationBySlug(slug: LocationSlug): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
