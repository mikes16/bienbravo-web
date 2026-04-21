"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cartStore } from "@/lib/cart/store";
import { formatMXN } from "@/lib/cart/format";
import type { StoreProductVariant } from "@/lib/api/queries";

type Props = {
  product: { id: string; name: string; handle: string | null; imageUrl: string | null };
  variants: StoreProductVariant[];
};

export function AddToCartForm({ product, variants }: Props) {
  const router = useRouter();
  const [variantId, setVariantId] = useState(variants[0].id);
  const [qty, setQty] = useState(1);

  const selected = variants.find((v) => v.id === variantId) ?? variants[0];
  const hasMultipleVariants = variants.length > 1;

  function addAndGoToCart() {
    cartStore.add({
      productId: product.id,
      variantId: selected.id,
      qty,
      unitPriceCents: selected.priceCents,
      name: product.name,
      imageUrl: product.imageUrl,
      handle: product.handle,
    });
    router.push("/carrito");
  }

  return (
    <div className="space-y-4">
      {hasMultipleVariants ? (
        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--bb-text)]/60">
            Variante
          </span>
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="mt-2 w-full rounded border border-[var(--bb-border)] bg-[var(--bb-surface)] px-3 py-2 text-[var(--bb-text)]"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {formatMXN(v.priceCents)}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--bb-text)]/60">
          Cantidad
        </span>
        <input
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
          className="mt-2 w-24 rounded border border-[var(--bb-border)] bg-[var(--bb-surface)] px-3 py-2 text-[var(--bb-text)]"
        />
      </label>

      <button
        type="button"
        onClick={addAndGoToCart}
        className="w-full rounded bg-[var(--bb-primary)] px-6 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[var(--bb-primary)]/90 sm:w-auto"
      >
        Agregar al carrito — {formatMXN(selected.priceCents * qty)}
      </button>
    </div>
  );
}
