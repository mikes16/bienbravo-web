import { serverQuery } from "@/lib/api/server";
import { LOCATIONS_QUERY, type StoreLocation } from "@/lib/api/queries";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const dynamic = "force-dynamic"; // PII (email/phone) lives here; don't cache

export const metadata = {
  title: "Checkout — BienBravo",
};

async function getLocations(): Promise<StoreLocation[]> {
  const data = await serverQuery<{ locations: StoreLocation[] }>(
    LOCATIONS_QUERY,
    undefined,
    { revalidate: 300, tags: ["locations"] },
  );
  return data.locations.filter((l) => l.isActive);
}

export default async function CheckoutPage() {
  const locations = await getLocations();
  return (
    <main className="min-h-screen bg-[var(--bb-bg)] text-[var(--bb-text)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--bb-copper)]">Checkout</p>
        <h1 className="mt-4 text-4xl font-[var(--font-display,'Boucherie_Block')] tracking-tight sm:text-5xl">
          Un paso más.
        </h1>
        <CheckoutFlow locations={locations} />
      </div>
    </main>
  );
}
