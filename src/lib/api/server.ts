import "server-only";
import { print } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; path?: (string | number)[]; extensions?: unknown }>;
};

type QueryInit = {
  revalidate?: number | false;
  tags?: string[];
  clientIp?: string; // forwarded to API as x-bb-client-ip for rate-limiting
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

  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-service-token": token,
  };
  if (init?.clientIp) {
    headers["x-bb-client-ip"] = init.clientIp;
  }

  const res = await fetch(uri, {
    method: "POST",
    headers,
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
