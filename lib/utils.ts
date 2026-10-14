import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `R${price.toLocaleString("en-ZA")}`;
}

export function formatWhatsApp(whatsapp: string): string {
  const cleaned = whatsapp.replace(/\D/g, "");
  if (cleaned.startsWith("27")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+27${cleaned.slice(1)}`;
  return `+27${cleaned}`;
}

export function generateOrderId(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BB-${yy}${mm}${dd}-${rand}`;
}

export function generatePayshapReference(firstName: string): string {
  const clean = firstName.replace(/[^a-zA-Z]/g, "").slice(0, 10);
  const num = Math.floor(100 + Math.random() * 900);
  return `${clean}${num}`;
}