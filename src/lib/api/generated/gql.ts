/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query StoreProducts {\n    products {\n      id\n      handle\n      name\n      description\n      imageUrl\n      isActive\n      status\n      compareAtPriceCents\n      requiresShipping\n      locationIds\n      images {\n        id\n        url\n        sortOrder\n      }\n      variants {\n        id\n        name\n        priceCents\n        compareAtPriceCents\n        sku\n      }\n    }\n  }\n": typeof types.StoreProductsDocument,
    "\n  query StoreLocations {\n    locations {\n      id\n      name\n      slug\n      isActive\n    }\n  }\n": typeof types.StoreLocationsDocument,
    "\n  mutation StoreCreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      id\n      totalCents\n      status\n      fulfillmentStatus\n    }\n  }\n": typeof types.StoreCreateOrderDocument,
    "\n  mutation StoreCreateOrderPaymentIntent($orderId: ID!) {\n    createOrderPaymentIntent(orderId: $orderId) {\n      paymentIntentId\n      clientSecret\n      amountCents\n      currency\n    }\n  }\n": typeof types.StoreCreateOrderPaymentIntentDocument,
};
const documents: Documents = {
    "\n  query StoreProducts {\n    products {\n      id\n      handle\n      name\n      description\n      imageUrl\n      isActive\n      status\n      compareAtPriceCents\n      requiresShipping\n      locationIds\n      images {\n        id\n        url\n        sortOrder\n      }\n      variants {\n        id\n        name\n        priceCents\n        compareAtPriceCents\n        sku\n      }\n    }\n  }\n": types.StoreProductsDocument,
    "\n  query StoreLocations {\n    locations {\n      id\n      name\n      slug\n      isActive\n    }\n  }\n": types.StoreLocationsDocument,
    "\n  mutation StoreCreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      id\n      totalCents\n      status\n      fulfillmentStatus\n    }\n  }\n": types.StoreCreateOrderDocument,
    "\n  mutation StoreCreateOrderPaymentIntent($orderId: ID!) {\n    createOrderPaymentIntent(orderId: $orderId) {\n      paymentIntentId\n      clientSecret\n      amountCents\n      currency\n    }\n  }\n": types.StoreCreateOrderPaymentIntentDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query StoreProducts {\n    products {\n      id\n      handle\n      name\n      description\n      imageUrl\n      isActive\n      status\n      compareAtPriceCents\n      requiresShipping\n      locationIds\n      images {\n        id\n        url\n        sortOrder\n      }\n      variants {\n        id\n        name\n        priceCents\n        compareAtPriceCents\n        sku\n      }\n    }\n  }\n"): (typeof documents)["\n  query StoreProducts {\n    products {\n      id\n      handle\n      name\n      description\n      imageUrl\n      isActive\n      status\n      compareAtPriceCents\n      requiresShipping\n      locationIds\n      images {\n        id\n        url\n        sortOrder\n      }\n      variants {\n        id\n        name\n        priceCents\n        compareAtPriceCents\n        sku\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query StoreLocations {\n    locations {\n      id\n      name\n      slug\n      isActive\n    }\n  }\n"): (typeof documents)["\n  query StoreLocations {\n    locations {\n      id\n      name\n      slug\n      isActive\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StoreCreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      id\n      totalCents\n      status\n      fulfillmentStatus\n    }\n  }\n"): (typeof documents)["\n  mutation StoreCreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      id\n      totalCents\n      status\n      fulfillmentStatus\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StoreCreateOrderPaymentIntent($orderId: ID!) {\n    createOrderPaymentIntent(orderId: $orderId) {\n      paymentIntentId\n      clientSecret\n      amountCents\n      currency\n    }\n  }\n"): (typeof documents)["\n  mutation StoreCreateOrderPaymentIntent($orderId: ID!) {\n    createOrderPaymentIntent(orderId: $orderId) {\n      paymentIntentId\n      clientSecret\n      amountCents\n      currency\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;