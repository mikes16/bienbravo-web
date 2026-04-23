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
