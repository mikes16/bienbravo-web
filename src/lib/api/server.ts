import "server-only";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; path?: (string | number)[]; extensions?: unknown }>;
};

type QueryInit = {
  revalidate?: number | false;
  tags?: string[];
};

/**
 * Server-only GraphQL fetch helper. Uses Next 16's native fetch cache so
 * callers can opt into ISR with `revalidate`/`tags` naturally:
 *
 *   await serverQuery<T>(QUERY, variables, { revalidate: 60, tags: ['products'] })
 *
 * The `x-service-token` header is attached on every call; the API builds a
 * SERVICE viewer with read-only catalog permissions from it.
 */
export async function serverQuery<TData>(
  query: string,
  variables?: Record<string, unknown>,
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
    body: JSON.stringify({ query, variables }),
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
