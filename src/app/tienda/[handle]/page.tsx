import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { serverQuery } from "@/lib/api/server";
import { PRODUCTS_QUERY, type StoreProduct } from "@/lib/api/queries";
import { formatMXN } from "@/lib/cart/format";
import { AddToCartForm } from "@/components/tienda/AddToCartForm";

export const revalidate = 60;

type PageProps = { params: Promise<{ handle: string }> };

async function getAllProducts(): Promise<StoreProduct[]> {
  const data = await serverQuery<{ products: StoreProduct[] }>(
    PRODUCTS_QUERY,
    undefined,
    { revalidate: 60, tags: ["products"] },
  );
  return data.products.filter((p) => p.isActive && p.status === "ACTIVE");
}

async function findProduct(handle: string): Promise<StoreProduct | null> {
  const products = await getAllProducts();
  const byHandle = products.find((p) => p.handle === handle);
  if (byHandle) return byHandle;
  // Fallback: some products may not have a handle yet; allow lookup by id.
  return products.find((p) => p.id === handle) ?? null;
}

export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params;
  const product = await findProduct(handle);
  if (!product) return { title: "Producto no encontrado — BienBravo" };
  return {
    title: `${product.name} — BienBravo`,
    description: product.description ?? undefined,
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.filter((p) => p.handle).map((p) => ({ handle: p.handle! }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await findProduct(handle);
  if (!product) notFound();

  const defaultVariant = product.variants[0];
  const primaryImage =
    product.images.sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ?? product.imageUrl;

  return (
    <main className="min-h-screen bg-[var(--bb-bg)] text-[var(--bb-text)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/tienda"
          className="text-sm uppercase tracking-[0.2em] text-[var(--bb-copper)] hover:text-[var(--bb-primary)]"
        >
          ← Tienda
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[var(--bb-border)] bg-[var(--bb-surface)]">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
                priority
              />
            ) : null}
          </div>

          <div>
            <h1 className="text-4xl font-[var(--font-display,'Boucherie_Block')] tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            {defaultVariant ? (
              <p className="mt-4 text-2xl tabular-nums text-[var(--bb-primary)]">
                {formatMXN(defaultVariant.priceCents)}
              </p>
            ) : null}

            {product.description ? (
              <p className="mt-6 whitespace-pre-line text-[var(--bb-text)]/80">
                {product.description}
              </p>
            ) : null}

            <div className="mt-8">
              {defaultVariant ? (
                <AddToCartForm
                  product={{
                    id: product.id,
                    name: product.name,
                    handle: product.handle,
                    imageUrl: primaryImage ?? null,
                  }}
                  variants={product.variants}
                />
              ) : (
                <p className="text-[var(--bb-text)]/60">No disponible por ahora.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
