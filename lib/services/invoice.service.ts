import prisma from "@/lib/prisma";
import { User } from "@/types";

export async function createInvoice({
  clientId,
  date,
  dueDate,
  items,
  businessId,
  user,
}: {
  clientId: string;
  date: string;
  dueDate: string;
  items: Array<{ productId: string; quantity: number }>;
  businessId: string;
  user: User;
}) {
  // Use a transaction to ensure data consistency
  return await prisma.$transaction(async (tx) => {
    // Create the invoice
    const invoice = await tx.invoice.create({
      data: {
        number: `INV-${Date.now()}`,
        clientId,
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

    // Update invoice with calculated total and set initial balance
    const updatedInvoice = await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        total,
        balance: total,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        client: true,
        business: true,
      },
    });

    // Update client's total credit
    await tx.client.update({
      where: { id: clientId },
      data: {
        totalCredit: {
          increment: total,
        },
      },
    });

    return updatedInvoice;
  });
}
