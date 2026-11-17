export interface WaitlistEntry {
  id: string;
  variantId: string;
  phone: string; // stored as "+27831234567" or "0831234567"
  variantSnapshot: {
    productName: string;
    colorName: string;
    colorCode: string;
    sizeLabel: string;
    laceType: string;
    texture: string;
    hairType: string;
  };
  notified: boolean;
  notifiedAt: string | null;
  createdAt: string;
}

const WAITLIST_KEY = "bb-waitlist";

export function getWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WAITLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToWaitlist(
  entry: Omit<WaitlistEntry, "id" | "createdAt" | "notified" | "notifiedAt">
): WaitlistEntry {
  const list = getWaitlist();
  // Don't add duplicate (same phone + variant)
  const existing = list.find(
    (e) => e.variantId === entry.variantId && e.phone === entry.phone
  );
  if (existing) return existing;

  const newEntry: WaitlistEntry = {
    ...entry,
    id: `wl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    notified: false,
    notifiedAt: null,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newEntry);
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(list));
  return newEntry;
}

export function markNotified(id: string) {
  const list = getWaitlist();
  const updated = list.map((e) =>
    e.id === id
      ? { ...e, notified: true, notifiedAt: new Date().toISOString() }
      : e
  );
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(updated));
}

export function removeFromWaitlist(id: string) {
  const list = getWaitlist().filter((e) => e.id !== id);
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(list));
}

// Group waitlist by variant
export function groupWaitlistByVariant(): Map<string, WaitlistEntry[]> {
  const list = getWaitlist();
  const map = new Map<string, WaitlistEntry[]>();
  for (const entry of list) {
    const key = entry.variantId;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return map;
}

// Build WhatsApp notification message
export function buildNotifyMessage(entry: WaitlistEntry): string {
  const snap = entry.variantSnapshot;
  return `Hi! 👋

Good news — the ${snap.colorName} ${snap.sizeLabel}" ${snap.productName} (${snap.laceType}) you asked about is back in stock at Buhle Bakho.

Shop it here: https://buhlebakho.co.za/shop/${snap.hairType}

Stock is limited, so grab it while you can 🖤`;
}