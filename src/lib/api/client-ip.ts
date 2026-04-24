import { headers } from "next/headers";

export async function getVisitorIp(): Promise<string | undefined> {
  try {
    const h = await headers();
    const xff = h.get("x-forwarded-for");
    if (xff) {
      const first = xff.split(",")[0]?.trim();
      if (first) return first;
    }
    const xrip = h.get("x-real-ip");
    if (xrip) return xrip;
  } catch {
    // headers() throws outside of a request context (e.g. at build time / ISR regeneration).
  }
  return undefined;
}
