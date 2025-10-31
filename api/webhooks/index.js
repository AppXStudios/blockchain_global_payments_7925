const crypto = require("crypto");
const express = require("express");
const router = express?.Router();
const supabase = require("../supabase");

function sortObject(o) {
  return Object.keys(o)?.sort()?.reduce((r, k) => {
      r[k] = typeof o?.[k] === "object" ? sortObject(o?.[k]) : o?.[k];
      return r;
    }, {});
}

router?.post("/", async (req, res) => {
  const raw = req?.rawBody?.toString("utf8");
  const body = JSON.parse(raw);

  const sorted = JSON.stringify(sortObject(body));
  const expected = crypto?.createHmac("sha512", process.env.NOWPAYMENTS_IPN_SECRET)?.update(sorted)?.digest("hex");

  const sig = req?.headers?.["x-nowpayments-sig"];

  if (expected !== sig) return res?.status(401)?.json({ error: "BAD_SIG" });

  if (body?.parent_payment_id) {
    // repeated deposit
  }

  if (body?.payment_status === "wrong_asset") {
    // wrong asset logic
  }

  await supabase?.from("webhook_events")?.insert({
    event: body?.payment_status,
    data: body
  });

  res?.json({ ok: true });
});

module.exports = router;