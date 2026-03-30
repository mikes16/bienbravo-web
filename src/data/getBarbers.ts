import { barbers, type Barber } from "@/config/barbers";

export function getBarbers(): Barber[] {
  return barbers;
}

export function getBarberById(id: string): Barber | undefined {
  return barbers.find((b) => b.id === id);
}
