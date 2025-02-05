import prisma from "@/lib/prisma";
import { User } from "@/types";

export async function createInvoice({
  clientName,
  clientEmail,
  clientAddress,
  additionalAddress,
  date,
  dueDate,
  items,
  businessId,
  user,
}: {
  clientName: string;
  clientEmail: string;
  clientAddress?: string | null;
  additionalAddress?: string | null;
  date: string;
  dueDate: string;
  items: Array<{ productId: string; quantity: number }>;
  businessId: string;
  user: User;
}) {
  const invoice = await prisma.invoice.create({
    data: {
      number: `INV-${Date.now()}`,
      clientName,
      clientEmail,
      clientAddress: clientAddress || null,
      additionalAddress: additionalAddress || null,
      date: new Date(date),
      dueDate: new Date(dueDate),
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
  const total = invoice.items.reduce((sum, item) => {
    const subtotal = item.quantity * item.product.price;
    const tax = (subtotal * item.product.taxPercent) / 100;
    return sum + subtotal + tax;
  }, 0);

  // Update invoice with calculated total
  return prisma.invoice.update({
    where: { id: invoice.id },
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
