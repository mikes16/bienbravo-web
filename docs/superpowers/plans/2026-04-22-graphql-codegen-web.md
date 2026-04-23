# GraphQL Codegen in Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce `graphql-codegen` in `bienbravo-web` with `client-preset` so the storefront's 4 GraphQL operations are typed end-to-end. Rewrite `serverQuery` to accept `TypedDocumentNode<TData, TVars>` so callers drop the hand-maintained response types. Also bootstraps minimal CI for this repo (currently has none).

**Architecture:** The one-file catalog of operations in `src/lib/api/queries.ts` switches from inline `/* GraphQL */` template strings to typed `graphql()` calls. The 4 hand-written response types (`StoreProduct`, `StoreProductVariant`, `StoreProductImage`, `StoreLocation`) are deleted in favor of generated types inferred from operation selections. `serverQuery<TData>(query: string, ...)` is rewritten to `serverQuery<TData, TVars>(doc: TypedDocumentNode<TData, TVars>, ...)` using `print()` from the `graphql` package. Codegen reads a committed `schema.graphql` synced from sibling `../bienbravo-api`. A new `.github/workflows/ci.yml` is added since this repo has no existing CI. Spec: [`../../../../bienbravo-api/docs/superpowers/specs/2026-04-22-graphql-codegen-frontends-design.md`](../../../../bienbravo-api/docs/superpowers/specs/2026-04-22-graphql-codegen-frontends-design.md).

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Apollo Client 4.1.7 (client-side only, for Stripe checkout), `graphql` 16, `@graphql-codegen/cli` 5, `@graphql-codegen/client-preset` 4.

---

## File Structure

**Create:**
- `codegen.ts` — graphql-codegen config at repo root
- `schema.graphql` — committed copy of API schema (synced from sibling `bienbravo-api`)
- `src/lib/api/generated/` — codegen output directory (committed, co-located with `queries.ts`)
- `scripts/sync-schema.mjs` — cross-platform copy script
- `.github/workflows/ci.yml` — **new** CI workflow (this repo has no CI yet)

**Modify:**
- `package.json` — add dev deps + three scripts
- `src/lib/api/queries.ts` — replace `/* GraphQL */` strings with `graphql()` calls; delete the 4 hand-written response types
- `src/lib/api/server.ts` — generic signature becomes `<TData, TVars>(doc: TypedDocumentNode<TData, TVars>, variables?: TVars, init?)`; body uses `print(doc)` for the wire payload
- Call sites of `StoreProduct`/`StoreProductVariant`/`StoreProductImage`/`StoreLocation` — switch to generated types
- `CLAUDE.md` — add "How to update types" section

**No changes to:**
- Client-side Apollo boundary for checkout (still uses `useMutation` with typed docs — the `graphql()` output is compatible)
- Next.js caching behavior of `serverQuery` — still uses native `fetch` with `next.revalidate`/`tags`

---

## Branch Setup

- [ ] **Step 0.1: Create branch**

Run from repo root:
```bash
git checkout main
git pull
git checkout -b feature/graphql-codegen
```

If the default branch is `master` (check with `git branch -a | head`), use `master` in the commands above.

- [ ] **Step 0.2: Verify sibling API has emitted schema**

Run:
```bash
ls ../bienbravo-api/src/graphql/schema.generated.graphql
```

Expected: file exists. If missing, sub-project 1 (API code-first migration) hasn't landed yet — stop and wait for it.

---

## Task 1: Install codegen dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1.1: Install dev dependencies**

Run:
```bash
npm install --save-dev @graphql-codegen/cli@^5.0.7 @graphql-codegen/client-preset@^4.5.1
```

Expected: both added to `devDependencies`. `package-lock.json` regenerated.

- [ ] **Step 1.2: Commit dependency installation**

```bash
git add package.json package-lock.json
git commit -m "chore(codegen): add graphql-codegen cli + client-preset"
```

---

## Task 2: Add sync-schema script

**Files:**
- Create: `scripts/sync-schema.mjs`

- [ ] **Step 2.1: Create sync script**

Create `scripts/sync-schema.mjs`:
```js
#!/usr/bin/env node
// Copies the API's emitted schema into this repo's committed copy.
// Run before `npm run codegen` whenever the API schema changes.
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const src = resolve(process.cwd(), '..', 'bienbravo-api', 'src', 'graphql', 'schema.generated.graphql')
const dst = resolve(process.cwd(), 'schema.graphql')

if (!existsSync(src)) {
  console.error(`sync-schema: source not found at ${src}`)
  console.error('Is ../bienbravo-api checked out as a sibling?')
  process.exit(1)
}

copyFileSync(src, dst)
console.log(`sync-schema: ${src} → ${dst}`)
```

- [ ] **Step 2.2: Add `sync-schema` script to package.json**

Modify `package.json` `"scripts"` block to include:
```json
"sync-schema": "node scripts/sync-schema.mjs",
```

- [ ] **Step 2.3: Test it**

Run:
```bash
npm run sync-schema
```

Expected output: `sync-schema: .../bienbravo-api/src/graphql/schema.generated.graphql → .../bienbravo-web/schema.graphql`. File `schema.graphql` now exists at repo root.

- [ ] **Step 2.4: Commit**

```bash
git add scripts/sync-schema.mjs package.json schema.graphql
git commit -m "chore(codegen): add sync-schema script and commit initial schema snapshot"
```

---

## Task 3: Add codegen config and run initial codegen

**Files:**
- Create: `codegen.ts`

- [ ] **Step 3.1: Create codegen config**

Create `codegen.ts` at repo root:
```ts
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    'src/lib/api/generated/': {
      preset: 'client',
      config: {
        useFragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
```

Note: output dir is `src/lib/api/generated/` so it sits next to the existing `queries.ts` and `server.ts`. `ignoreNoDocuments: true` lets codegen succeed before any `graphql()` call exists; it gets tightened in Task 6.

- [ ] **Step 3.2: Add codegen scripts to package.json**

Modify `package.json` `"scripts"` block to include:
```json
"codegen": "graphql-codegen --config codegen.ts",
"codegen:watch": "graphql-codegen --config codegen.ts --watch",
```

- [ ] **Step 3.3: Run initial codegen**

Run:
```bash
npm run codegen
```

Expected: succeeds, creates `src/lib/api/generated/` with at minimum `graphql.ts`, `gql.ts`, `fragment-masking.ts`, `index.ts`.

- [ ] **Step 3.4: Commit**

```bash
git add codegen.ts package.json src/lib/api/generated/
git commit -m "feat(codegen): add codegen.ts and initial generated scaffold"
```

---

## Task 4: Rewrite `serverQuery` to accept `TypedDocumentNode`

**Files:**
- Modify: `src/lib/api/server.ts`

The current signature is `serverQuery<TData>(query: string, variables?: Record<string, unknown>, init?): Promise<TData>`. We change it to accept a `TypedDocumentNode<TData, TVars>` so both `TData` and `TVars` are inferred from the document and the call site stays type-safe end-to-end.

Why change `serverQuery` before migrating operations: the new signature is narrower and will break current callers the moment we migrate `queries.ts`. Updating the helper first lets Task 5 drop types with a single coordinated change.

- [ ] **Step 4.1: Rewrite server.ts**

Replace the entire contents of `src/lib/api/server.ts` with:
```ts
import "server-only";
import { print, type TypedDocumentNode } from "graphql";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; path?: (string | number)[]; extensions?: unknown }>;
};

type QueryInit = {
  revalidate?: number | false;
  tags?: string[];
};

/**
 * Server-only GraphQL fetch helper. Accepts a TypedDocumentNode so data and
 * variables are inferred from the operation:
 *
 *   const data = await serverQuery(PRODUCTS_QUERY, undefined, { revalidate: 60, tags: ['products'] })
 *
 * The `x-service-token` header is attached on every call; the API builds a
 * SERVICE viewer with read-only catalog permissions from it.
 */
export async function serverQuery<TData, TVars = Record<string, never>>(
  doc: TypedDocumentNode<TData, TVars>,
  variables?: TVars,
  init?: QueryInit,
): Promise<TData> {
  const uri = process.env.API_GRAPHQL_URL;
  if (!uri) throw new Error("API_GRAPHQL_URL is required");
  const token = process.env.API_SERVICE_TOKEN;
  if (!token) throw new Error("API_SERVICE_TOKEN is required");

  const res = await fetch(uri, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-service-token": token,
    },
    body: JSON.stringify({ query: print(doc), variables }),
    next:
      init?.revalidate !== undefined || init?.tags
        ? { revalidate: init.revalidate, tags: init.tags }
        : undefined,
    cache: init?.revalidate === undefined && !init?.tags ? "no-store" : undefined,
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}: ${await res.text()}`);
  }

  const body = (await res.json()) as GraphQLResponse<TData>;
  if (body.errors && body.errors.length > 0) {
    throw new Error(`GraphQL error: ${body.errors.map((e) => e.message).join("; ")}`);
  }
  if (!body.data) {
    throw new Error("GraphQL response missing data");
  }
  return body.data;
}
```

Key changes from the old version:
- Generic changes from `<TData>` to `<TData, TVars = Record<string, never>>`
- First parameter changes from `query: string` to `doc: TypedDocumentNode<TData, TVars>`
- `variables` parameter changes from `Record<string, unknown>` to `TVars`
- Body uses `print(doc)` to serialize the document node to a string for the wire payload
- Imports `print` and `TypedDocumentNode` from the `graphql` package (already a dependency)

- [ ] **Step 4.2: Build (typecheck only — don't commit yet)**

Run:
```bash
npm run build
```

Expected: this will FAIL with type errors at every call site of `serverQuery` that still passes a string (the callers in Task 5 route handlers / Server Components). **That's expected** — we fix them in Task 5 with the generated types. Don't commit the `server.ts` change in isolation.

- [ ] **Step 4.3: Do NOT commit yet**

Leave the `server.ts` change staged alongside Task 5's changes. We commit them together after Task 5 to keep the diff reviewable as a single coherent change.

---

## Task 5: Migrate queries.ts to `graphql()` + delete hand-written types

**Files:**
- Modify: `src/lib/api/queries.ts`
- Modify: all call sites that import the deleted types

- [ ] **Step 5.1: Rewrite queries.ts**

Replace the entire contents of `src/lib/api/queries.ts` with:
```ts
// GraphQL operations for the storefront. All types are inferred from the
// generated TypedDocumentNode — do not add hand-written response types here.
import { graphql } from "./generated";

export const PRODUCTS_QUERY = graphql(`
  query StoreProducts {
    products {
      id
      handle
      name
      description
      imageUrl
      isActive
      status
      compareAtPriceCents
      requiresShipping
      locationIds
      images {
        id
        url
        sortOrder
      }
      variants {
        id
        name
        priceCents
        compareAtPriceCents
        sku
      }
    }
  }
`);

export const LOCATIONS_QUERY = graphql(`
  query StoreLocations {
    locations {
      id
      name
      slug
      isActive
    }
  }
`);

export const CREATE_ORDER_MUTATION = graphql(`
  mutation StoreCreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      totalCents
      status
      fulfillmentStatus
    }
  }
`);

export const CREATE_ORDER_PAYMENT_INTENT_MUTATION = graphql(`
  mutation StoreCreateOrderPaymentIntent($orderId: ID!) {
    createOrderPaymentIntent(orderId: $orderId) {
      paymentIntentId
      clientSecret
      amountCents
      currency
    }
  }
`);
```

The 4 type exports (`StoreProduct`, `StoreProductVariant`, `StoreProductImage`, `StoreLocation`) are removed. The GraphQL string bodies are byte-for-byte identical to the previous `/* GraphQL */` versions.

- [ ] **Step 5.2: Regenerate types**

Run:
```bash
npm run codegen
```

Expected: `src/lib/api/generated/graphql.ts` now contains operation types (e.g. `StoreProductsQuery`, `StoreLocationsQuery`, `StoreCreateOrderMutation`, `StoreCreateOrderMutationVariables`, `StoreCreateOrderPaymentIntentMutation`, `StoreCreateOrderPaymentIntentMutationVariables`) and input types (`CreateOrderInput`).

- [ ] **Step 5.3: Find every import of the deleted types**

Run:
```bash
grep -rn "StoreProduct\|StoreLocation" src/
```

Expected: a list of files importing one or more of `StoreProduct`, `StoreProductVariant`, `StoreProductImage`, `StoreLocation` from `@/lib/api/queries`. Record the list.

- [ ] **Step 5.4: Switch each call site to generated/inferred types**

For each file from Step 5.3, do the following mechanical transform:

**Option A — import the generated operation type and pick the field you need:**
```ts
// Before:
import { StoreProduct, PRODUCTS_QUERY } from "@/lib/api/queries";
// component later uses: StoreProduct

// After:
import { PRODUCTS_QUERY } from "@/lib/api/queries";
import type { StoreProductsQuery } from "@/lib/api/generated/graphql";
type StoreProduct = StoreProductsQuery["products"][number];
```

**Option B — let inference flow from the `serverQuery` call and stop typing explicitly at all:**
```ts
// Before:
const data = await serverQuery<{ products: StoreProduct[] }>(PRODUCTS_QUERY, ...);
const items: StoreProduct[] = data.products;

// After:
const data = await serverQuery(PRODUCTS_QUERY, undefined, { revalidate: 60, tags: ['products'] });
const items = data.products; // inferred as StoreProductsQuery['products']
```

Prefer Option B wherever the local alias adds nothing. Use Option A only when the alias is genuinely load-bearing (exported from a module boundary, reused across files, etc.).

Apply the corresponding transform for `StoreLocation` (`StoreLocationsQuery["locations"][number]`), `StoreProductVariant` (`StoreProductsQuery["products"][number]["variants"][number]`), and `StoreProductImage` (`StoreProductsQuery["products"][number]["images"][number]`).

- [ ] **Step 5.5: Verify all old imports are gone**

Run:
```bash
grep -rn "StoreProduct\|StoreLocation" src/ | grep "lib/api/queries"
```

Expected: no matches. If any remain, fix them before proceeding.

- [ ] **Step 5.6: Build (this is the first time typecheck should pass)**

Run:
```bash
npm run build
```

Expected: passes. This covers the combined change: `serverQuery` signature + typed operations + updated call sites.

- [ ] **Step 5.7: Lint**

Run:
```bash
npm run lint
```

Expected: passes. If lint surfaces `any` where an inferred type is better, tighten the call site.

- [ ] **Step 5.8: Commit (combined)**

```bash
git add src/lib/api/server.ts src/lib/api/queries.ts src/lib/api/generated/ src/
git commit -m "feat(codegen): type serverQuery with TypedDocumentNode and migrate queries.ts"
```

---

## Task 6: Verify no leftover `/* GraphQL */` strings and tighten config

**Files:**
- Verify: entire `src/` tree
- Modify: `codegen.ts`

- [ ] **Step 6.1: Search for leftover inline GraphQL**

Run:
```bash
grep -rn "/\* GraphQL \*/" src/ || echo "clean"
grep -rn "from '@apollo/client'" src/ | grep -E "(\bgql\b|gql,)" || echo "clean"
```

Expected: both print `clean`. If anything remains (a client-side mutation using `gql` for Stripe checkout, for example), swap it to `graphql()` from `@/lib/api/generated`.

- [ ] **Step 6.2: Tighten codegen config**

Modify `codegen.ts` — change `ignoreNoDocuments: true` to `ignoreNoDocuments: false` so future PRs that accidentally drop every operation fail loudly.

```ts
ignoreNoDocuments: false,
```

- [ ] **Step 6.3: Full verification pass**

Run in order:
```bash
npm run codegen   # should produce no diff
npm run lint      # should pass
npm run build     # should pass (next build includes typecheck)
```

All three must succeed.

- [ ] **Step 6.4: Commit**

```bash
git add codegen.ts
git commit -m "chore(codegen): enforce ignoreNoDocuments=false after migration"
```

---

## Task 7: Bootstrap CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

This repo has no `.github/` directory yet. We create a minimal workflow that runs lint, build, **and** the codegen-drift check. Structure mirrors `bienbravo-admin/.github/workflows/ci.yml` plus the new codegen step.

- [ ] **Step 7.1: Create the workflow file**

Create `.github/workflows/ci.yml`:
```yaml
name: Web CI

on:
  pull_request:
  push:
    branches: [main, master]

jobs:
  build-and-lint:
    runs-on: ubuntu-latest
    env:
      API_GRAPHQL_URL: http://localhost:3001/graphql
      API_SERVICE_TOKEN: ci-dummy-token
      NEXT_PUBLIC_API_GRAPHQL_URL: http://localhost:3001/graphql
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_ci_dummy
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Verify GraphQL codegen is up to date
        run: |
          npm run codegen
          git diff --exit-code schema.graphql src/lib/api/generated/
      - run: npm run lint
      - run: npm run build
```

Notes:
- The `env:` block gives `next build` dummy values for env vars checked at module scope. The build doesn't actually call the API, so the values are placeholders.
- The codegen step does **not** run `sync-schema` first — it reads the committed `schema.graphql`. Schema-sync discipline is a PR-review convention per the design spec, not a CI enforcement.

- [ ] **Step 7.2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add workflow with lint/build and codegen-drift check"
```

---

## Task 8: Document the sync-then-codegen workflow

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 8.1: Add "GraphQL types" section to CLAUDE.md**

Append to `CLAUDE.md` (or insert near top-level sections):
```markdown
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
```

- [ ] **Step 8.2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(codegen): document sync-schema + codegen workflow"
```

---

## Task 9: Smoke-test against a running API

**Files:**
- No code changes; manual verification

- [ ] **Step 9.1: Boot the API locally**

In a separate terminal, from `../bienbravo-api`:
```bash
npm run build && node dist/src/main.js
```

Expected: API comes up at `http://127.0.0.1:3001/graphql`.

- [ ] **Step 9.2: Configure web env**

Ensure `.env.local` in this repo has at minimum:
```
API_GRAPHQL_URL=http://localhost:3001/graphql
API_SERVICE_TOKEN=<the value the API expects locally>
NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:3001/graphql
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_<anything>
```

- [ ] **Step 9.3: Boot web**

```bash
npm run dev
```

Expected: Next dev server up at `http://localhost:3002` (or whatever port the storefront uses). Open the URL.

- [ ] **Step 9.4: Exercise the storefront flows**

Navigate to:
- `/tienda` (exercises `PRODUCTS_QUERY` via `serverQuery` with ISR)
- Click a product, ensure detail page renders (same query, cached tag)
- Add to cart, go to checkout, select pickup location (exercises `LOCATIONS_QUERY`)
- Place the order (exercises `CREATE_ORDER_MUTATION` → `CREATE_ORDER_PAYMENT_INTENT_MUTATION`) with a Stripe test card

Each step should complete without console errors. In the editor, hover any `serverQuery(...)` result and confirm TypeScript sees the generated type, not `any`.

- [ ] **Step 9.5: Confirm caching still works**

In DevTools → Network, reload `/tienda`. The first load hits the API; within 60s subsequent loads should be cached. Trigger a cache bust if you have `revalidateTag` wired; otherwise wait for TTL.

- [ ] **Step 9.6: No commit — smoke test only**

---

## Task 10: Open PR

- [ ] **Step 10.1: Push branch**

```bash
git push -u origin feature/graphql-codegen
```

- [ ] **Step 10.2: Open PR**

Title: `feat(graphql): add graphql-codegen with typed client-preset`

Body:
```markdown
## Summary

Introduces `@graphql-codegen/client-preset` in `bienbravo-web`. The 4 storefront operations in `src/lib/api/queries.ts` now use the typed `graphql()` function. `serverQuery` accepts a `TypedDocumentNode` so both `TData` and `TVars` are inferred — the 4 hand-written response types (`StoreProduct`, `StoreProductVariant`, `StoreProductImage`, `StoreLocation`) are deleted. Also bootstraps CI for this repo (previously had none).

## Verification

- `npm run codegen` succeeds, producing no diff vs committed output
- `npm run build` passes (Next.js build runs typecheck)
- `npm run lint` passes
- New CI workflow runs lint/build + codegen-drift check
- Smoke-tested against a locally running `bienbravo-api`: `/tienda`, product detail, cart, checkout, Stripe confirmation — all flow through typed data

## Files touched

- `codegen.ts` (new), `scripts/sync-schema.mjs` (new), `schema.graphql` (new, committed)
- `src/lib/api/queries.ts` (operations → `graphql()`; hand-written types deleted)
- `src/lib/api/server.ts` (signature now `TypedDocumentNode<TData, TVars>`)
- Call sites that referenced the deleted types (switched to generated inference)
- `src/lib/api/generated/` (new, committed)
- `.github/workflows/ci.yml` (new — first CI for this repo)
- `CLAUDE.md` (add "GraphQL types" section)

## Test plan

- [ ] Reviewer: pull the branch, `npm ci`, `npm run codegen` — no diff
- [ ] Reviewer: `npm run build` passes
- [ ] Reviewer: boot API + web locally, browse `/tienda`, place a test order with Stripe test card, confirm the `/checkout/confirmado` page renders typed order data
```

---

## Self-review completed before this plan was handed off

- **Spec coverage:** every acceptance criterion from the spec is covered — sync script (Task 2), committed schema (Task 2), codegen config (Task 3), `serverQuery` rewrite (Task 4), all call-sites migrated + hand-written types deleted (Task 5), config tightened (Task 6), CI check (Task 7 — created fresh since no CI existed), CLAUDE.md update (Task 8), smoke test (Task 9)
- **Rollout ordering:** `serverQuery` rewrite (Task 4) is staged but not committed until Task 5 migrates queries + call sites — single coherent commit. This preserves bisectability since the intermediate state would fail typecheck
- **No placeholders:** every step has exact commands, exact paths, exact code. The generated type names (`StoreProductsQuery`, `StoreLocationsQuery`, `StoreCreateOrderMutation`, `StoreCreateOrderPaymentIntentMutation`) are the client-preset default — verified against the `queries.ts` operation names
- **Type consistency:** `graphql()` function name and `./generated` / `@/lib/api/generated` import path are identical across every code block. `TypedDocumentNode<TData, TVars>` generic order matches the `graphql` package's definition
- **CI bootstrap:** this repo had no `.github/workflows/` — Task 7 creates one from scratch rather than extending a non-existent file. Workflow injects dummy env vars so `next build` doesn't fail at module-scope env checks
