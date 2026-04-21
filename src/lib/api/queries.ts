// GraphQL query strings + response types for the storefront.
// Kept as plain strings so the `fetch`-based server helper can submit them
// without an Apollo runtime. Types are hand-maintained (no codegen yet).

export type StoreProductVariant = {
  id: string;
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  sku: string | null;
};

export type StoreProductImage = {
  id: string;
  url: string;
  sortOrder: number;
};

export type StoreProduct = {
  id: string;
  handle: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  images: StoreProductImage[];
  isActive: boolean;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  compareAtPriceCents: number | null;
  requiresShipping: boolean;
  locationIds: string[];
  variants: StoreProductVariant[];
};

export type StoreLocation = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export const PRODUCTS_QUERY = /* GraphQL */ `
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
`;

export const LOCATIONS_QUERY = /* GraphQL */ `
  query StoreLocations {
    locations {
      id
      name
      slug
      isActive
    }
  }
`;

export const CREATE_ORDER_MUTATION = /* GraphQL */ `
  mutation StoreCreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      totalCents
      status
      fulfillmentStatus
    }
  }
`;

export const CREATE_ORDER_PAYMENT_INTENT_MUTATION = /* GraphQL */ `
  mutation StoreCreateOrderPaymentIntent($orderId: ID!) {
    createOrderPaymentIntent(orderId: $orderId) {
      paymentIntentId
      clientSecret
      amountCents
      currency
    }
  }
`;
