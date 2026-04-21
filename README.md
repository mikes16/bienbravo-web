# bienbravo-web

Sitio público de BienBravo: landing de marketing + storefront de e-commerce `/tienda`.

- **Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind 4, GSAP, Apollo Client, Stripe Elements
- **Estrategia de render:** SSG para landing, ISR para catálogo/producto, client para carrito, SSR para confirmación de orden. Ver [CLAUDE.md](./CLAUDE.md).
- **Consumo de API:** server-side para queries públicas (products, config, locations); client-side solo para checkout con Stripe.

## Empezar

```bash
npm install
cp .env.example .env.local   # llenar vars (ver abajo)
npm run dev                  # http://localhost:3002
```

## Variables de entorno

Ver `.env.example`. Críticas:

- `NEXT_PUBLIC_API_GRAPHQL_URL` — URL del API GraphQL (bundle cliente, solo checkout)
- `API_GRAPHQL_URL` — URL server-side del API (puede ser red privada en prod)
- `API_SERVICE_TOKEN` — token server-to-server para llamar al API desde route handlers / Server Components
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — llave pública de Stripe
- `REVALIDATE_SECRET` — HMAC para `/api/revalidate`

**`STRIPE_SECRET_KEY` NO vive en este proyecto.** Todas las operaciones privadas de Stripe pasan por el API.

## Estructura

```
src/
  app/
    layout.tsx                  # root layout (landing + storefront comparten header/footer)
    page.tsx                    # landing (SSG)
    tienda/
      page.tsx                  # catálogo (ISR revalidate=60)
      [handle]/page.tsx         # producto (ISR revalidate=60)
    carrito/page.tsx            # carrito (client)
    checkout/page.tsx           # checkout (server+client)
    checkout/confirmado/page.tsx  # confirmación (SSR no-cache)
    api/
      revalidate/route.ts       # webhook firmado para invalidar tags ISR
      checkout/session/route.ts # crea orden + PaymentIntent server-side
  components/                   # UI compartida (Button, ProductCard, ...)
  lib/
    api/server.ts               # Apollo cliente server-only
    api/client.ts               # Apollo cliente browser-only (checkout)
    cart/store.ts               # localStorage-backed cart
    stripe/client.ts            # loadStripe singleton
  config/                       # datos estáticos de landing (sucursales, barberos)
```

## Scripts

- `npm run dev` — dev server en `:3002`
- `npm run build` — build de producción
- `npm run start` — servidor de producción
- `npm run lint` — ESLint

## Identidad visual

"Precision Brutal" — dark luxury, rojo bravo + cobre sobre carbón. Tokens en [src/app/globals.css](src/app/globals.css). No mezclar con los tokens del admin/pos.

## Seguridad y performance

Son requisito, no feature. Lee [CLAUDE.md](./CLAUDE.md) antes de tocar el checkout o el flujo de revalidación. El storefront es internet pública — asume adversario activo.

## Next.js 16

Esta versión tiene breaking changes vs. Next 14/15. Si vas a tocar APIs de Next (route handlers, cache, metadata, etc.), revisa `node_modules/next/dist/docs/` antes. Ver [AGENTS.md](./AGENTS.md).
