import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/errorHandler.js";

const prisma = new PrismaClient();

export async function listUserObligations(userId: string) {
  return prisma.userObligation.findMany({
    where: { userId },
    include: { obligation: true },
    orderBy: { obligation: { deadline: "asc" } },
  });
}

export async function updateObligationStatus(userId: string, obligationId: string, status: string) {
  const existing = await prisma.userObligation.findFirst({
    where: { userId, obligationId },
  });

  if (!existing) {
    throw new AppError(404, "Obligation introuvable");
  }

  return prisma.userObligation.update({
    where: { id: existing.id },
    data: {
      status: status as any,
      completedAt: status === "DONE" ? new Date() : null,
    },
    include: { obligation: true },
  });
}
