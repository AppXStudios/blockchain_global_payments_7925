const express = require("express");
const router = express?.Router();
const supabase = require("../supabase");
const axios = require("axios");

router?.post("/", async (req, res) => {
  try {
    const { email, name } = req?.body;

    const { data: merchant, error } = await supabase?.from("merchants")?.insert({ email, name })?.select()?.single();

    if (error) {
      return res?.status(400)?.json({ success: false, error: error?.message });
    }

    const custody = await axios?.post(
      "https://api.nowpayments.io/v1/custody",
      { email },
      { headers: { "x-api-key": process.env.NOWPAYMENTS_API_KEY } }
    );

    await supabase?.from("merchants")?.update({ custody_account_id: custody?.data?.result?.id })?.eq("id", merchant?.id);

    res?.json({ ok: true, merchant });
  } catch (error) {
    console.error("Merchant creation error:", error);
    res?.status(500)?.json({ success: false, error: "Failed to create merchant" });
  }
});

module.exports = router;