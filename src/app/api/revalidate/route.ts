import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs"; // node:crypto is not available on edge

const ALLOWED_TAGS = new Set(["products", "locations"]);

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Revalidate not configured" }, { status: 503 });
  }

  const signature = req.headers.get("x-revalidate-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const raw = await req.text();
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  if (!constantTimeEqual(signature, expected)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { tag?: string; tags?: string[] };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tags = Array.isArray(body.tags)
    ? body.tags
    : typeof body.tag === "string"
      ? [body.tag]
      : [];

  if (tags.length === 0) {
    return NextResponse.json({ error: "No tags provided" }, { status: 400 });
  }

  const accepted: string[] = [];
  for (const tag of tags) {
    // Accept exact allow-list entries and scoped tags like "product:<id>".
    const base = tag.split(":", 1)[0];
    if (!ALLOWED_TAGS.has(base) && base !== "product") continue;
    // Webhook-driven invalidation: expire immediately rather than stale-while-revalidate,
    // so a published admin change is visible on the next request without a second visit.
    revalidateTag(tag, { expire: 0 });
    accepted.push(tag);
  }

  return NextResponse.json({ revalidated: accepted });
}
