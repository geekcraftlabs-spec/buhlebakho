import { SiteNav } from "@/components/navigation/SiteNav";
import { ThankYouClient } from "@/components/checkout/ThankYouClient";

async function getOrder(id: string) {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${base}/api/public/order/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  return (
    <>
      <SiteNav />
      <ThankYouClient order={order} />
    </>
  );
}