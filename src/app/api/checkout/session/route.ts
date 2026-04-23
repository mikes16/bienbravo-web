import { NextResponse } from "next/server";
import { serverQuery } from "@/lib/api/server";
import {
  CREATE_ORDER_MUTATION,
  CREATE_ORDER_PAYMENT_INTENT_MUTATION,
} from "@/lib/api/queries";

type CheckoutItem = { productId: string; variantId: string; qty: number };

type CheckoutRequest = {
  items: CheckoutItem[];
  pickupLocationId: string | null;
  buyer: { email?: string; phone?: string };
};

export async function POST(req: Request) {
  let body: CheckoutRequest;
  try {
    body = (await req.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!body.pickupLocationId) {
    return NextResponse.json({ error: "Selecciona una sucursal de recogida" }, { status: 400 });
  }

  try {
    const orderResult = await serverQuery(CREATE_ORDER_MUTATION, {
      input: {
        pickupLocationId: body.pickupLocationId,
        source: "STOREFRONT",
        items: body.items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          qty: i.qty,
        })),
      },
    });

    const order = orderResult.createOrder;

    const piResult = await serverQuery(CREATE_ORDER_PAYMENT_INTENT_MUTATION, {
      orderId: order.id,
    });

    return NextResponse.json({
      orderId: order.id,
      totalCents: order.totalCents,
      clientSecret: piResult.createOrderPaymentIntent.clientSecret,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
