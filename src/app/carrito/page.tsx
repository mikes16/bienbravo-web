"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, cartStore, cartTotalCents } from "@/lib/cart/store";
import { formatMXN } from "@/lib/cart/format";

export default function CarritoPage() {
  const cart = useCart();
  const empty = cart.items.length === 0;

  return (
    <main className="min-h-screen bg-[var(--bb-bg)] text-[var(--bb-text)]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--bb-copper)]">Carrito</p>
        <h1 className="mt-4 text-4xl font-[var(--font-display,'Boucherie_Block')] tracking-tight sm:text-5xl">
          Tu selección.
        </h1>

        {empty ? (
          <div className="mt-12 rounded border border-[var(--bb-border)] bg-[var(--bb-surface)] p-10 text-center">
            <p className="text-[var(--bb-text)]/70">Tu carrito está vacío.</p>
            <Link
              href="/tienda"
              className="mt-6 inline-block rounded bg-[var(--bb-primary)] px-6 py-3 text-sm uppercase tracking-[0.2em] text-white hover:bg-[var(--bb-primary)]/90"
            >
              Ver tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-10 divide-y divide-[var(--bb-border)] border-y border-[var(--bb-border)]">
              {cart.items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-start gap-4 py-6"
                >
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded border border-[var(--bb-border)] bg-[var(--bb-surface)]">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-base">{item.name}</span>
                      <span className="tabular-nums">{formatMXN(item.unitPriceCents * item.qty)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--bb-text)]/70">
                      <label className="flex items-center gap-2">
                        Cantidad
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={item.qty}
                          onChange={(e) =>
                            cartStore.updateQty(
                              item.productId,
                              item.variantId,
                              Math.max(1, Math.min(99, Number(e.target.value) || 1)),
                            )
                          }
                          className="w-16 rounded border border-[var(--bb-border)] bg-[var(--bb-surface)] px-2 py-1 text-[var(--bb-text)]"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => cartStore.remove(item.productId, item.variantId)}
                        className="text-[var(--bb-copper)] hover:text-[var(--bb-primary)]"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-[0.2em] text-[var(--bb-text)]/60">
                Subtotal
              </span>
              <span className="text-2xl tabular-nums text-[var(--bb-primary)]">
                {formatMXN(cartTotalCents(cart))}
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--bb-text)]/50">
              Envío se calcula en el siguiente paso.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/tienda"
                className="rounded border border-[var(--bb-border)] px-6 py-3 text-center text-sm uppercase tracking-[0.2em] hover:border-[var(--bb-primary)]"
              >
                Seguir comprando
              </Link>
              <Link
                href="/checkout"
                className="rounded bg-[var(--bb-primary)] px-8 py-3 text-center text-sm uppercase tracking-[0.2em] text-white hover:bg-[var(--bb-primary)]/90"
              >
                Ir al checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
