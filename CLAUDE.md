@AGENTS.md

# bienbravo-web — Contexto del proyecto

Sitio público de BienBravo. **No es solo landing** — también hospeda el storefront de e-commerce `/tienda` que consume el API. Esto es un cambio arquitectónico respecto a la primera versión (que era static export puro). La razón: el cliente quiere que su dominio público sea una sola marca ("Precision Brutal") con sección de ventas online.

## Stack

- Next.js 16 (App Router, React 19, TypeScript 5)
- Tailwind 4 con tokens CSS custom (`--bb-primary`, `--bb-bg`, etc.)
- GSAP 3 + ScrollTrigger (animaciones de landing, NO de storefront)
- Apollo Client 3 — solo en boundaries server-side (route handlers y Server Components); el cliente lo usa mínimamente para el checkout
- Stripe Elements — para el formulario de pago (checkout)

## Arquitectura de renderizado

Por sección de la app:

| Ruta | Estrategia | Por qué |
|---|---|---|
| `/` (landing) | **SSG** (build time) | Marketing fijo, hero animado con GSAP, CTA a WhatsApp. No necesita datos del API. |
| `/tienda` (catálogo) | **ISR** (revalidate 60s + `revalidateTag`) | Productos cambian poco pero el admin puede publicar/ocultar. Si el tiempo de revalidación es muy largo el cliente verá productos agotados; si es muy corto, carga innecesaria al API. |
| `/tienda/[handle]` (producto) | **ISR** (revalidate 60s + `revalidateTag`) | Igual que catálogo. Pre-render los top N por build para TTFB óptimo. |
| `/carrito` | **Client** | 100% estado local (localStorage). No toca API excepto para validar stock antes de checkout. |
| `/checkout` | **Server + Client** | El form es client (Stripe Elements), pero la creación del PaymentIntent y la orden pasa por un route handler `/api/checkout/session` que habla con el API GraphQL server-side. |
| `/checkout/confirmado` | **Server** (SSR, no cache) | Confirma contra el API que la orden existe y muestra detalle. No cachear — contiene PII del buyer. |

**Regla general:** si una página puede ser SSG o ISR, **no** usar SSR. SSR solo cuando el contenido es único por usuario.

## Consumo del API

### Server-side (preferido)

**El API no expone queries públicas.** Todas las lecturas (catálogo, precios, sucursales) pasan por las queries autenticadas del API (`products`, `services`, `locations`, etc.) usando un **service token** server-to-server. El token **jamás** va al cliente.

```ts
// src/lib/api/server.ts (server-only)
import 'server-only'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export function getServerApi() {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: process.env.API_GRAPHQL_URL!,
      headers: { 'x-service-token': process.env.API_SERVICE_TOKEN! },
      // Sin credentials: este cliente es server-to-server, no usa cookies
    }),
    cache: new InMemoryCache(),
  })
}
```

El API, al detectar `x-service-token`, devuelve un viewer `kind: 'SERVICE'` con permisos de solo-lectura sobre el catálogo público (productos activos, precios por sucursal, stock). Cualquier mutation que requiera `orders.fulfill`, etc. sigue bloqueada.

### Client-side (mínimo)

Solo para mutations que requieren contexto del navegador (Stripe Elements confirma el PaymentIntent). La cookie `bb_session` (si el customer está logueado) va automáticamente con `credentials: 'include'`.

### Revalidación

Cuando el admin publique cambios (nuevo producto, cambio de precio, stock), necesita disparar revalidación. Opción recomendada: un webhook `/api/revalidate` que reciba `{ tag: 'products' | 'product:{id}' }` firmado con `REVALIDATE_SECRET`. El admin no lo dispara aún — por ahora confiar en `revalidate: 60`.

## Variables de entorno

```
# Público (bundle del cliente)
NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:3001/graphql  # solo checkout client-side
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Server-only
API_GRAPHQL_URL=http://localhost:3001/graphql  # puede diferir del público (ej. red privada)
API_SERVICE_TOKEN=<random-32+>                 # token compartido con el API para llamadas server-to-server
REVALIDATE_SECRET=<random>                     # para /api/revalidate
```

**`STRIPE_SECRET_KEY` NO vive aquí.** Todas las operaciones privadas de Stripe las hace el API (bienbravo-api). Web solo usa la publishable key + client secret que retorna el API.

## Identidad visual "Precision Brutal"

Palette (definida en `src/app/globals.css`):

- `--bb-primary: #B52718` — rojo bravo, para CTAs y acentos
- `--bb-copper: #C87941` — cobre, para detalles luxury
- `--bb-bg: #111111` — carbón/negro, base
- `--bb-text: #F8F6F6` — hueso, texto principal
- `--bb-surface`, `--bb-surface-2`, `--bb-border` — capas de profundidad

**Fuentes:**
- `Work Sans` (Google) para UI
- `Boucherie Block` (Typekit) para display

**No usar los tokens del admin (`--color-bravo`, `--color-carbon`, etc.)** — son paletas diferentes aunque tengan nombres similares. Si ves uno en este repo, es error.

## Carrito (estado cliente)

- Store minimal con `useSyncExternalStore` + `localStorage` bajo la key `bb:cart:v1`.
- Estructura: `{ items: [{ productId, variantId, qty, unitPriceCents, addedAt }], updatedAt }`.
- Precios se re-validan server-side al construir el PaymentIntent — **nunca** confiar en el precio del carrito.
- TTL suave: si `updatedAt` > 7 días, limpiar en la primera visita.

## GSAP en landing, NO en storefront

GSAP ScrollTrigger pesa ~40kb gzipped y no aporta nada en un grid de productos. El storefront debe usar transiciones CSS puras y `view-transitions` de Next si aplica. Importar GSAP solo en los componentes que lo usan (bundle split natural de App Router).

## Performance

- **LCP del storefront** (target <2.5s en 4G): imágenes de producto servidas por Cloudinary con `next/image` + blur placeholder. `unoptimized: true` en next.config **ya no aplica** — ahora que no es static export podemos usar el Image Optimizer.
- **TTI del checkout**: Stripe Elements se carga con `loadStripe` (dynamic import), no en el bundle inicial.
- **CLS**: reservar espacio para imágenes con aspect-ratio. El grid de `/tienda` define `aspect-[4/5]` fijo por card.

## Seguridad

- El storefront es internet pública — asume adversario activo.
- **Rate limiting**: pendiente en API. Antes de go-live, confirmar con el equipo de API que `publicProducts`, `publicConfig`, `createOrder`, y `createOrderPaymentIntent` tienen límite por IP.
- **Validación**: nunca confiar en el payload del cliente. El API re-valida precio, stock, shipping.
- **Webhook firmado**: `/api/revalidate` verifica `x-revalidate-signature` con HMAC-SHA256 usando `REVALIDATE_SECRET`.
- **CSP**: headers configurados en `next.config.ts` permiten solo Cloudinary, Stripe, GTM.

## GraphQL types

Types for every query/mutation are generated from the API schema by `graphql-codegen`. They live in `src/lib/api/generated/` and are committed.

**When the API schema changes:**

1. Make sure `../bienbravo-api` is checked out and has the updated `schema.generated.graphql` committed
2. From this repo:
   ```bash
   npm run sync-schema   # copies API schema → ./schema.graphql
   npm run codegen       # regenerates src/lib/api/generated/
   ```
3. Commit both the updated `schema.graphql` and the regenerated `src/lib/api/generated/` files together

**When authoring a new query/mutation:**

Use the `graphql()` function from `./generated` (or `@/lib/api/generated`), not the old `/* GraphQL */` template string:

```ts
import { graphql } from "./generated";

export const MY_QUERY = graphql(`
  query MyQuery($id: ID!) { ... }
`);
```

Then pass it to `serverQuery`:
```ts
const data = await serverQuery(MY_QUERY, { id: "abc" }, { revalidate: 60, tags: ['something'] });
// `data` is fully typed from the operation's selection set
```

Run `npm run codegen:watch` during dev to regenerate on save.

**CI enforcement:** CI runs `npm run codegen` and fails if the committed `src/lib/api/generated/` differs from what codegen produces. If the CI "codegen drift" check fails on your PR, run `npm run codegen` locally and commit the result.

## Qué NO hacer

- No volver a `output: 'export'` — rompería el storefront.
- No importar el design system del admin (`../bienbravo-admin/...`). Los tokens del admin son otra paleta.
- No poner `STRIPE_SECRET_KEY` en este repo.
- No llamar al API desde un Client Component para obtener catálogo — eso expone la URL directa y rompe caché.
- No animar el grid de productos con GSAP. Animar la landing sí; el storefront no.
- No usar `localStorage` para la sesión del customer (va por cookie `bb_session`). Sí para el carrito anónimo.
- No asumir que `product.priceCents` que trajo el server hace 60s sigue siendo correcto — el API revalida al crear la orden.
- No asumir APIs de Next.js sin leer `node_modules/next/dist/docs/` (Next 16 es breaking).
