export function formatCurrency(amount, currency) {
  const safe = currency?.toUpperCase();

  // ✅ Crypto detection (BTC, ETH, USDT, etc)
  const isCrypto = !Intl.NumberFormat?.supportedLocalesOf(["en-US"], {
    style: "currency",
    currency: safe
  })?.length;

  if (isCrypto) {
    // ✅ fallback format for crypto
    return `${safe} ${Number(amount || 0)?.toFixed(2)}`;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safe
    })?.format(amount || 0);
  } catch {
    return `${safe} ${Number(amount || 0)?.toFixed(2)}`;
  }
}