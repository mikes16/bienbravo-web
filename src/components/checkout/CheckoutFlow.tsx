"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStripe } from "@/lib/stripe/client";
import { useCart, cartStore, cartTotalCents } from "@/lib/cart/store";
import { formatMXN } from "@/lib/cart/format";
import type { StoreLocation } from "@/lib/api/queries";

type Props = { locations: StoreLocation[] };

type SessionResponse = {
  orderId: string;
  totalCents: number;
  clientSecret: string;
};

export function CheckoutFlow({ locations }: Props) {
  const cart = useCart();
  const [pickupLocationId, setPickupLocationId] = useState(locations[0]?.id ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const totalCents = cartTotalCents(cart);
  const empty = cart.items.length === 0;

  async function createSession() {
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            qty: i.qty,
          })),
          pickupLocationId,
          buyer: { email, phone },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo iniciar el checkout");
        return;
      }
      setSession(data as SessionResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de red");
    } finally {
      setCreating(false);
    }
  }

  if (empty) {
    return (
      <div className="mt-10 rounded border border-[var(--bb-border)] bg-[var(--bb-surface)] p-10 text-center">
        <p className="text-[var(--bb-text)]/70">Tu carrito está vacío.</p>
        <Link
          href="/tienda"
          className="mt-6 inline-block rounded bg-[var(--bb-primary)] px-6 py-3 text-sm uppercase tracking-[0.2em] text-white hover:bg-[var(--bb-primary)]/90"
        >
          Ver tienda
        </Link>
      </div>
    );
  }

  if (session) {
    return <StripePayment session={session} />;
  }

  return (
    <div className="mt-10 space-y-8">
      <section>
        <h2 className="text-sm uppercase tracking-[0.2em] text-[var(--bb-text)]/60">Recogida</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {locations.map((loc) => (
            <label
              key={loc.id}
              className={`flex cursor-pointer items-center gap-3 rounded border p-4 transition ${
                pickupLocationId === loc.id
                  ? "border-[var(--bb-primary)] bg-[var(--bb-primary)]/5"
                  : "border-[var(--bb-border)] hover:border-[var(--bb-copper)]"
              }`}
            >
              <input
                type="radio"
                name="pickup"
                value={loc.id}
                checked={pickupLocationId === loc.id}
                onChange={(e) => setPickupLocationId(e.target.value)}
                className="accent-[var(--bb-primary)]"
              />
              <span>{loc.name}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-[0.2em] text-[var(--bb-text)]/60">Contacto</h2>
        <label className="block">
          <span className="text-xs text-[var(--bb-text)]/60">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded border border-[var(--bb-border)] bg-[var(--bb-surface)] px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--bb-text)]/60">Teléfono (opcional)</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded border border-[var(--bb-border)] bg-[var(--bb-surface)] px-3 py-2"
          />
        </label>
      </section>

      <section className="rounded border border-[var(--bb-border)] bg-[var(--bb-surface)] p-6">
        <h2 className="text-sm uppercase tracking-[0.2em] text-[var(--bb-text)]/60">Resumen</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {cart.items.map((i) => (
            <li key={`${i.productId}-${i.variantId}`} className="flex justify-between">
              <span>
                {i.name} × {i.qty}
              </span>
              <span className="tabular-nums">{formatMXN(i.unitPriceCents * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-[var(--bb-border)] pt-4">
          <span className="uppercase tracking-[0.2em]">Total</span>
          <span className="text-xl text-[var(--bb-primary)] tabular-nums">{formatMXN(totalCents)}</span>
        </div>
      </section>

      {error ? <p className="text-sm text-[var(--bb-primary)]">{error}</p> : null}

      <button
        type="button"
        onClick={createSession}
        disabled={creating || !email || !pickupLocationId}
        className="w-full rounded bg-[var(--bb-primary)] px-6 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[var(--bb-primary)]/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {creating ? "Preparando…" : "Pagar con tarjeta"}
      </button>
    </div>
  );
}

function StripePayment({ session }: { session: SessionResponse }) {
  const stripePromise = useMemo(() => getStripe(), []);

  return (
    <div className="mt-10">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: session.clientSecret,
          appearance: { theme: "night", variables: { colorPrimary: "#B52718" } },
        }}
      >
        <StripePaymentForm orderId={session.orderId} totalCents={session.totalCents} />
      </Elements>
    </div>
  );
}

function StripePaymentForm({ orderId, totalCents }: { orderId: string; totalCents: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear cart the moment Stripe has accepted the PaymentIntent setup; if the
    // user bails out before confirm we've already created an Order in PENDING.
    // Admin/cron can sweep stale pending orders.
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const returnUrl = `${window.location.origin}/checkout/confirmado?order=${encodeURIComponent(orderId)}`;
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (result.error) {
      setError(result.error.message ?? "No se pudo procesar el pago");
      setSubmitting(false);
      return;
    }

    // Stripe redirects to return_url on success; if we get here without a
    // redirect, assume success and navigate manually.
    cartStore.clear();
    router.push(`/checkout/confirmado?order=${encodeURIComponent(orderId)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error ? <p className="text-sm text-[var(--bb-primary)]">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting || !stripe || !elements}
        className="w-full rounded bg-[var(--bb-primary)] px-6 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[var(--bb-primary)]/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Procesando…" : `Pagar ${formatMXN(totalCents)}`}
      </button>
    </form>
  );
}
