import { Order, CartItem } from "@/types";

// ---------- Day bucketing ----------
export function getOrderDay(order: Order): string {
  const date = order.paidAt ? new Date(order.paidAt) : new Date(order.createdAt);
  return date.toISOString().slice(0, 10);
}

export function getDayLabel(dayKey: string): string {
  const d = new Date(dayKey + "T12:00:00Z");
  return d.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
}

export function groupOrdersByDay(orders: Order[]): Map<string, Order[]> {
  const map = new Map<string, Order[]>();
  for (const order of orders) {
    const day = getOrderDay(order);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(order);
  }
  return new Map(
    Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
  );
}

// ---------- Supplier copy text ----------
// Only shows what supplier needs: hair type, texture, lace, color, size, qty.
// NO customer names, phones, addresses.
export function buildSupplierOrderText(orders: Order[]): string {
  const lines: string[] = [];
  lines.push("BUHLE BAKHO — ORDERS TO FULFILL");
  lines.push("══════════════════════════════════");
  lines.push("");

  const groups: Record<string, CartItem[]> = {};

  for (const order of orders) {
    for (const item of order.items) {
      const key = `${item.hairType}::${item.laceType ?? "n/a"}::${item.texture}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
  }

  let totalUnits = 0;

  for (const key of Object.keys(groups).sort()) {
    const [hairType, laceType, texture] = key.split("::");
    const items = groups[key];
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    totalUnits += count;

    lines.push(
      `${hairType.toUpperCase().replace("-", " ")} — ${texture.replace(
        "-",
        " "
      )} — ${laceType}`
    );
    lines.push(`  Total: ${count} ${count === 1 ? "unit" : "units"}`);
    lines.push("");

    for (const item of items) {
      lines.push(
        `  • ${item.quantity}× ${item.colorName} (${item.colorCode}) ${item.sizeLabel}`
      );
    }
    lines.push("");
  }

  lines.push("══════════════════════════════════");
  lines.push(`TOTAL UNITS: ${totalUnits}`);
  lines.push(`TOTAL ORDERS: ${orders.length}`);
  lines.push("");
  lines.push(`Generated: ${new Date().toLocaleString("en-ZA")}`);

  return lines.join("\n");
}

// ---------- WhatsApp message builder for shipped notification ----------
export function buildShippedMessage(order: Order): string {
  const firstName = order.name.split(" ")[0];
  return `Hi ${firstName}! 👋

Good news — your Buhle Bakho order ${order.id} has been packaged and handed to The Courier Guy.

You'll receive an SMS with your tracking number shortly. Delivery is expected within 2-3 business days.

Thank you for choosing Buhle Bakho 🖤`;
}

export function normalizeWhatsAppNumber(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.startsWith("27")) return clean;
  if (clean.startsWith("0")) return `27${clean.slice(1)}`;
  return `27${clean}`;
}

export function buildWhatsAppLink(order: Order): string {
  const number = normalizeWhatsAppNumber(order.whatsapp);
  const message = buildShippedMessage(order);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}