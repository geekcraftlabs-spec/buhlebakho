import { prisma } from "./db";
import { CartItem } from "@/types";
import { Prisma } from "@prisma/client";

export async function createOrder(data: {
  id: string;
  name: string;
  whatsapp: string;
  deliveryMethod: "door" | "locker";
  address: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payshapReference: string;
}) {
  return prisma.order.create({
    data: {
      id: data.id,
      name: data.name,
      whatsapp: data.whatsapp,
      deliveryMethod: data.deliveryMethod,
      address: data.address,
      items: data.items as unknown as Prisma.InputJsonValue,
      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      total: data.total,
      payshapReference: data.payshapReference,
    },
  });
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({ where: { id } });
}

export async function getAllOrders() {
  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getOrderStats() {
  const orders = await prisma.order.findMany();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    pending: orders.filter((o) => o.status === "pending").length,
    paymentSent: orders.filter((o) => o.status === "payment_sent").length,
    paid: orders.filter((o) => o.status === "paid").length,
    thisMonthRevenue: orders
      .filter((o) => o.status === "delivered" && o.createdAt >= startOfMonth)
      .reduce((sum, o) => sum + o.total, 0),
  };
}

export async function updateOrderStatus(
  id: string,
  status: string,
  waybill?: string
) {
  return prisma.order.update({
    where: { id },
    data: { status, ...(waybill !== undefined && { waybill }) },
  });
}