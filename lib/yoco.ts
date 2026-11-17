/* eslint-disable @typescript-eslint/no-unused-vars */
interface YocoCheckoutInput {
  amount: number; // in rands — will be converted to cents
  currency: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}

interface YocoCheckoutResult {
  id: string;
  redirectUrl: string;
  status: string;
}

export async function createYocoCheckout(
  input: YocoCheckoutInput
): Promise<YocoCheckoutResult> {
  const secret = process.env.YOCO_SECRET_KEY;
  if (!secret) {
    throw new Error("YOCO_SECRET_KEY is not set");
  }

  const res = await fetch("https://payments.yoco.com/api/checkouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      amount: Math.round(input.amount * 100), // rands → cents
      currency: input.currency,
      description: input.description,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      metadata: input.metadata,
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("[yoco] create checkout failed:", res.status, text);
    throw new Error(`Yoco API error ${res.status}: ${text.slice(0, 200)}`);
  }

  try {
    return JSON.parse(text) as YocoCheckoutResult;
  } catch (err) {
    console.error("[yoco] invalid JSON response:", text.slice(0, 200));
    throw new Error("Yoco returned an invalid response");
  }
}