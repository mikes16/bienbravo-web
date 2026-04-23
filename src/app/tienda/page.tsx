import Link from "next/link";
import Image from "next/image";
import { serverQuery } from "@/lib/api/server";
import { PRODUCTS_QUERY } from "@/lib/api/queries";
import { ProductStatus, type StoreProductsQuery } from "@/lib/api/generated/graphql";
import { formatMXN } from "@/lib/cart/format";

export const revalidate = 60;

export const metadata = {
  title: "Tienda — BienBravo",
  description: "Productos para el ritual de barbería. Pomadas, cuidado y accesorios.",
};

type StoreProduct = StoreProductsQuery["products"][number];

async function getProducts(): Promise<StoreProduct[]> {
  const data = await serverQuery(PRODUCTS_QUERY, undefined, {
    revalidate: 60,
    tags: ["products"],
  });
  return data.products.filter((p) => p.isActive && p.status === ProductStatus.Active);
}

function minPriceCents(p: StoreProduct): number | null {
  if (p.variants.length === 0) return null;
  return p.variants.reduce((min, v) => (v.priceCents < min ? v.priceCents : min), p.variants[0].priceCents);
}

export default async function TiendaPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[var(--bb-bg)] text-[var(--bb-text)]">
      <section className="border-b border-[var(--bb-border)]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--bb-copper)]">Tienda</p>
          <h1 className="mt-4 text-4xl font-[var(--font-display,'Boucherie_Block')] tracking-tight sm:text-6xl">
            Ritual en casa.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-[var(--bb-text)]/70">
            Lo que usamos en la silla. Productos seleccionados para que el acabado de BienBravo
            dure entre visitas.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {products.length === 0 ? (
          <p className="text-[var(--bb-text)]/60">Muy pronto.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const price = minPriceCents(product);
              const hasCompare =
                product.compareAtPriceCents != null &&
                price != null &&
                product.compareAtPriceCents > price;
              const href = product.handle ? `/tienda/${product.handle}` : `/tienda/${product.id}`;
              return (
                <li key={product.id}>
                  <Link href={href} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[var(--bb-border)] bg-[var(--bb-surface)]">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--bb-text)]/40">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h2 className="text-lg tracking-tight">{product.name}</h2>
                      <div className="text-right text-sm tabular-nums">
                        {price != null ? (
                          <>
                            <span className="text-[var(--bb-primary)]">{formatMXN(price)}</span>
                            {hasCompare ? (
                              <span className="ml-2 text-[var(--bb-text)]/40 line-through">
                                {formatMXN(product.compareAtPriceCents!)}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-[var(--bb-text)]/50">—</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
