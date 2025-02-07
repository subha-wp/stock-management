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

  // Validate item quantities
  if (items.some((item) => item.quantity <= 0)) {
    throw new Error("Item quantity must be greater than 0");
  }

  // Validate date formats
  if (isNaN(Date.parse(date)) || isNaN(Date.parse(dueDate))) {
    throw new Error("Invalid date format");
  }

  return await prisma.$transaction(async (tx) => {
    // Check client exists within the transaction
    const client = await tx.client.findUnique({ where: { id: clientId } });
    if (!client) throw new Error("Client not found");

    // Check all products exist
    const productIds = items.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });
    const missingIds = productIds.filter(
      (id) => !products.some((p) => p.id === id)
    );
    if (missingIds.length > 0) {
      throw new Error(`Products not found: ${missingIds.join(", ")}`);
    }

    // Generate a more unique invoice number (example using timestamp)
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create invoice
    const invoice = await tx.invoice.create({
      data: {
        number: invoiceNumber,
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
        items: { include: { product: true } },
        client: true,
        business: true,
      },
    });

    // Calculate total with precise decimal arithmetic
    const total = invoice.items.reduce((sum, item) => {
      const subtotal = item.quantity * Number(item.product.price);
      const tax = (subtotal * Number(item.product.taxPercent)) / 100;
      return sum + subtotal + tax;
    }, 0);

    // Update invoice with total and balance
    const updatedInvoice = await tx.invoice.update({
      where: { id: invoice.id },
      data: { total, balance: total },
      include: {
        items: { include: { product: true } },
        client: true,
        business: true,
      },
    });

    // Update client's total credit
    await tx.client.update({
      where: { id: clientId },
      data: { totalCredit: { increment: total } },
    });

    return updatedInvoice;
  });
}
