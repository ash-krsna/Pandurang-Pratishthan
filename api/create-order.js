const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";
const MIN_DONATION = 1;
const MAX_DONATION = 500000;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({
      error: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel."
    });
  }

  try {
    const amount = Number(req.body?.amount);
    const donorName = sanitize(req.body?.donorName, 80);
    const donorEmail = sanitize(req.body?.donorEmail, 120);
    const donorPhone = sanitize(req.body?.donorPhone, 20);
    const purpose = sanitize(req.body?.purpose || "General donation", 80);

    if (!Number.isFinite(amount) || amount < MIN_DONATION || amount > MAX_DONATION) {
      return res.status(400).json({ error: `Donation amount must be between Rs ${MIN_DONATION} and Rs ${MAX_DONATION}.` });
    }

    if (!donorName || !donorEmail || !donorPhone) {
      return res.status(400).json({ error: "Name, email, and phone are required before payment." });
    }

    const receipt = `pp_${Date.now()}`.slice(0, 40);
    const orderPayload = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      notes: {
        donorName,
        donorEmail,
        donorPhone,
        purpose,
        ngo: "Pandurang Pratishthan"
      }
    };

    const response = await fetch(RAZORPAY_ORDERS_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderPayload)
    });

    const order = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: order.error?.description || "Razorpay could not create the order."
      });
    }

    return res.status(200).json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to create payment order. Please try again." });
  }
};

function sanitize(value, maxLength) {
  return String(value || "")
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
}
