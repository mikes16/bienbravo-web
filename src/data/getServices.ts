import { locationMenus, type LocationMenu, type Service } from "@/config/services";

export function getLocationMenus(): LocationMenu[] {
  return locationMenus;
}

export function getMenuByGroup(group: "centro-sur" | "norte"): LocationMenu | undefined {
  return locationMenus.find((m) => m.locationGroup === group);
}

export function getAllServices(): Service[] {
  return locationMenus.flatMap((m) => m.services);
}
