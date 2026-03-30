import { services, type Service } from "@/config/services";

export function getServices(): Service[] {
  return services;
}

export function getFeaturedServices(): Service[] {
  return services.filter((s) => s.featured);
}
