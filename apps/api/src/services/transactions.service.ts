import { PrismaClient, TransactionType } from "@prisma/client";
import { AppError } from "../middleware/errorHandler.js";

const prisma = new PrismaClient();

export async function listTransactions(
  userId: string,
  filters?: { type?: string; year?: number; month?: number; category?: string },
) {
  const where: any = { userId };

  if (filters?.type) where.type = filters.type;
  if (filters?.category) where.category = filters.category;

  if (filters?.year) {
    const startDate = new Date(`${filters.year}-${filters.month ? String(filters.month).padStart(2, "0") : "01"}-01`);
    const endDate = filters.month
      ? new Date(filters.year, filters.month, 1)
      : new Date(`${filters.year + 1}-01-01`);
    where.date = { gte: startDate, lt: endDate };
  }

  return prisma.transaction.findMany({
    where,
    include: { document: true },
    orderBy: { date: "desc" },
  });
}

export async function createTransaction(
  userId: string,
  data: { type: string; amount: number; category: string; description?: string; date: string; documentId?: string },
) {
  return prisma.transaction.create({
    data: {
      userId,
      type: data.type as TransactionType,
      amount: data.amount,
      category: data.category,
      description: data.description ?? "",
      date: new Date(data.date),
      documentId: data.documentId ?? null,
    },
  });
}

export async function updateTransaction(
  userId: string,
  id: string,
  data: { type?: string; amount?: number; category?: string; description?: string; date?: string; documentId?: string },
) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) {
    throw new AppError(404, "Transaction introuvable");
  }

  const updateData: any = {};
  if (data.type) updateData.type = data.type;
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.category) updateData.category = data.category;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.date) updateData.date = new Date(data.date);
  if (data.documentId !== undefined) updateData.documentId = data.documentId;

  return prisma.transaction.update({ where: { id }, data: updateData });
}

export async function deleteTransaction(userId: string, id: string) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) {
    throw new AppError(404, "Transaction introuvable");
  }
  return prisma.transaction.delete({ where: { id } });
}

export async function getTransactionSummary(userId: string, year?: number) {
  const targetYear = year ?? new Date().getFullYear();
  const startDate = new Date(`${targetYear}-01-01`);
  const endDate = new Date(`${targetYear + 1}-01-01`);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate, lt: endDate },
    },
    orderBy: { date: "asc" },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const byCategory: Record<string, number> = {};
  for (const t of transactions) {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
  }

  const byMonth: { month: number; income: number; expenses: number }[] = [];
  for (let m = 0; m < 12; m++) {
    const monthTx = transactions.filter((t) => t.date.getMonth() === m);
    const income = monthTx.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const expenses = monthTx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    if (income > 0 || expenses > 0) {
      byMonth.push({ month: m + 1, income, expenses });
    }
  }

  return {
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    netAmount: Math.round((totalIncome - totalExpenses) * 100) / 100,
    byCategory: Object.entries(byCategory).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    })),
    byMonth,
  };
}
