import prisma from "@/lib/prisma";
import { User } from "@/types";

export async function createEstimate({
  clientName,
  clientEmail,
  clientAddress,
  additionalAddress,
  date,
  expiryDate,
  items,
  businessId,
  user,
}: {
  clientName: string;
  clientEmail: string;
  clientAddress?: string | null;
  additionalAddress?: string | null;
  date: string;
  expiryDate: string;
  items: Array<{ productId: string; quantity: number }>;
  businessId: string;
  user: User;
}) {
  const estimate = await prisma.estimate.create({
    data: {
      number: `EST-${Date.now()}`,
      clientName,
      clientEmail,
      clientAddress: clientAddress || null,
      additionalAddress: additionalAddress || null,
      date: new Date(date),
      expiryDate: new Date(expiryDate),
      status: "PENDING",
      total: 0,
      userId: user.id,
      businessId,
      items: {
        create: items.map((item) => ({
          quantity: item.quantity,
          product: { connect: { id: item.productId } },
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // Calculate total including tax
  const total = estimate.items.reduce((sum, item) => {
    const subtotal = item.quantity * item.product.price;
    const tax = (subtotal * item.product.taxPercent) / 100;
    return sum + subtotal + tax;
  }, 0);

  // Update estimate with calculated total
  return prisma.estimate.update({
    where: { id: estimate.id },
    data: { total },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      business: true,
    },
  });
}
