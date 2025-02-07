// lib/services/invoice.service.ts
import prisma from "@/lib/prisma";
import { User } from "@/types";

interface CreateInvoiceData {
  clientId: string;
  date: string;
  dueDate: string;
  items: Array<{ productId: string; quantity: number }>;
  businessId: string;
  user: User;
}

export async function createInvoice(data: CreateInvoiceData) {
  const { clientId, date, dueDate, items, businessId, user } = data;

  console.log("iServices Data", data);

  // Validate input data
  if (
    !clientId ||
    !date ||
    !dueDate ||
    !businessId ||
    !items?.length ||
    !user
  ) {
    throw new Error("Missing required fields");
  }

  // Get client
  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  // Use a transaction to ensure data consistency
  return await prisma.$transaction(async (tx) => {
    // Create the invoice
    const invoice = await tx.invoice.create({
      data: {
        number: `INV-${Date.now()}`,
        date: new Date(date),
        dueDate: new Date(dueDate),
        status: "PENDING",
        total: 0,
        amountPaid: 0,
        balance: 0,
        userId: user.id,
        businessId,
        clientId,
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
        client: true,
        business: true,
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
