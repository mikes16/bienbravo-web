import Link from "next/link";

export const dynamic = "force-dynamic"; // PII-adjacent and per-order; never cache

export const metadata = {
  title: "Pedido confirmado — BienBravo",
};

type PageProps = {
  searchParams: Promise<{ order?: string; payment_intent?: string; redirect_status?: string }>;
};

export default async function CheckoutConfirmadoPage({ searchParams }: PageProps) {
  const { order, redirect_status } = await searchParams;
  const orderId = order ?? null;
  const status = redirect_status ?? "succeeded";

  const isFailure = status !== "succeeded" && status !== "processing";

  return (
    <main className="min-h-screen bg-[var(--bb-bg)] text-[var(--bb-text)]">
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--bb-copper)]">
          {isFailure ? "Algo salió mal" : "Pedido confirmado"}
        </p>
        <h1 className="mt-4 text-4xl font-[var(--font-display,'Boucherie_Block')] tracking-tight sm:text-5xl">
          {isFailure ? "No pudimos cobrar tu tarjeta." : "Gracias por tu compra."}
        </h1>

        {isFailure ? (
          <p className="mt-6 text-[var(--bb-text)]/70">
            Tu tarjeta no se cobró. Puedes intentar de nuevo desde el carrito.
          </p>
        ) : (
          <>
            <p className="mt-6 text-[var(--bb-text)]/70">
              Recibirás un correo con los detalles de tu pedido y el aviso para recogerlo en sucursal.
            </p>
            {orderId ? (
              <p className="mt-4 text-sm text-[var(--bb-text)]/50">
                Número de pedido:{" "}
                <span className="font-mono text-[var(--bb-copper)]">{orderId}</span>
              </p>
            ) : null}
          </>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {isFailure ? (
            <Link
              href="/carrito"
              className="rounded bg-[var(--bb-primary)] px-8 py-3 text-sm uppercase tracking-[0.2em] text-white hover:bg-[var(--bb-primary)]/90"
            >
              Volver al carrito
            </Link>
          ) : null}
          <Link
            href="/tienda"
            className="rounded border border-[var(--bb-border)] px-8 py-3 text-sm uppercase tracking-[0.2em] hover:border-[var(--bb-primary)]"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}
