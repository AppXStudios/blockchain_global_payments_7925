import { Payment, Invoice, Merchant, Withdrawal, PaymentLink } from "./types";

const BASE_URL =
  typeof window !== "undefined"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_URL || "/api";

export const api = {
  async get(path) {
    const r = await fetch(`${BASE_URL}${path}`);
    return r.json();
  },

  async post(path, data = {}) {
    const r = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return r.json();
  }
};
