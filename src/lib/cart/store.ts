"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  variantId: string;
  qty: number;
  unitPriceCents: number;
  name: string;
  imageUrl: string | null;
  handle: string | null;
  addedAt: number;
};

type CartState = {
  items: CartItem[];
  updatedAt: number;
};

const STORAGE_KEY = "bb:cart:v1";
const SOFT_TTL_DAYS = 7;

function emptyState(): CartState {
  return { items: [], updatedAt: Date.now() };
}

function readStorage(): CartState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as CartState;
    // Soft TTL: wipe carts older than SOFT_TTL_DAYS to avoid showing the user
    // stale prices from a session weeks ago.
    const ageDays = (Date.now() - (parsed.updatedAt ?? 0)) / (1000 * 60 * 60 * 24);
    if (ageDays > SOFT_TTL_DAYS) return emptyState();
    if (!Array.isArray(parsed.items)) return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

let state: CartState = emptyState();
let hydrated = false;
const listeners = new Set<() => void>();

function notify() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded / Safari private mode — ignore, cart lives in memory.
  }
}

function hydrateIfNeeded() {
  if (hydrated || typeof window === "undefined") return;
  state = readStorage();
  hydrated = true;
}

export const cartStore = {
  getState(): CartState {
    hydrateIfNeeded();
    return state;
  },

  subscribe(listener: () => void): () => void {
    hydrateIfNeeded();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  add(item: Omit<CartItem, "addedAt">) {
    hydrateIfNeeded();
    const existing = state.items.find(
      (i) => i.productId === item.productId && i.variantId === item.variantId,
    );
    if (existing) {
      existing.qty += item.qty;
    } else {
      state.items = [...state.items, { ...item, addedAt: Date.now() }];
    }
    state.updatedAt = Date.now();
    persist();
    notify();
  },

  updateQty(productId: string, variantId: string, qty: number) {
    hydrateIfNeeded();
    if (qty <= 0) {
      this.remove(productId, variantId);
      return;
    }
    state.items = state.items.map((i) =>
      i.productId === productId && i.variantId === variantId ? { ...i, qty } : i,
    );
    state.updatedAt = Date.now();
    persist();
    notify();
  },

  remove(productId: string, variantId: string) {
    hydrateIfNeeded();
    state.items = state.items.filter(
      (i) => !(i.productId === productId && i.variantId === variantId),
    );
    state.updatedAt = Date.now();
    persist();
    notify();
  },

  clear() {
    hydrateIfNeeded();
    state = emptyState();
    persist();
    notify();
  },
};

const EMPTY_SNAPSHOT: CartState = emptyState();

export function useCart(): CartState {
  return useSyncExternalStore(
    cartStore.subscribe,
    () => cartStore.getState(),
    () => EMPTY_SNAPSHOT,
  );
}

export function cartTotalCents(state: CartState): number {
  return state.items.reduce((acc, i) => acc + i.unitPriceCents * i.qty, 0);
}

export function cartItemCount(state: CartState): number {
  return state.items.reduce((acc, i) => acc + i.qty, 0);
}
