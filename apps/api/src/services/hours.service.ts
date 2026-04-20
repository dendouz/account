import { PrismaClient } from "@prisma/client";
import { MAX_STUDENT_HOURS_PER_YEAR } from "@studeo/shared";
import { AppError } from "../middleware/errorHandler.js";

const prisma = new PrismaClient();

export async function listHours(userId: string, year?: number) {
  const targetYear = year ?? new Date().getFullYear();
  const startDate = new Date(`${targetYear}-01-01`);
  const endDate = new Date(`${targetYear + 1}-01-01`);

  return prisma.workHour.findMany({
    where: {
      userId,
      date: { gte: startDate, lt: endDate },
    },
    orderBy: { date: "desc" },
  });
}

export async function createHour(userId: string, data: { date: string; hours: number; employer: string; description?: string }) {
  return prisma.workHour.create({
    data: {
      userId,
      date: new Date(data.date),
      hours: data.hours,
      employer: data.employer,
      description: data.description ?? "",
    },
  });
}

export async function updateHour(userId: string, id: string, data: { date?: string; hours?: number; employer?: string; description?: string }) {
  const existing = await prisma.workHour.findFirst({ where: { id, userId } });
  if (!existing) {
    throw new AppError(404, "Entrée d'heures introuvable");
  }

  const updateData: any = {};
  if (data.date) updateData.date = new Date(data.date);
  if (data.hours !== undefined) updateData.hours = data.hours;
  if (data.employer) updateData.employer = data.employer;
  if (data.description !== undefined) updateData.description = data.description;

  return prisma.workHour.update({ where: { id }, data: updateData });
}

export async function deleteHour(userId: string, id: string) {
  const existing = await prisma.workHour.findFirst({ where: { id, userId } });
  if (!existing) {
    throw new AppError(404, "Entrée d'heures introuvable");
  }
  return prisma.workHour.delete({ where: { id } });
}

export async function getHoursSummary(userId: string, year?: number) {
  const targetYear = year ?? new Date().getFullYear();
  const startDate = new Date(`${targetYear}-01-01`);
  const endDate = new Date(`${targetYear + 1}-01-01`);

  const hours = await prisma.workHour.findMany({
    where: {
      userId,
      date: { gte: startDate, lt: endDate },
    },
    orderBy: { date: "asc" },
  });

  const totalHours = hours.reduce((sum, h) => sum + h.hours, 0);
  const byMonth: { month: number; hours: number }[] = [];

  for (let m = 0; m < 12; m++) {
    const monthHours = hours.filter((h) => h.date.getMonth() === m).reduce((sum, h) => sum + h.hours, 0);
    if (monthHours > 0) {
      byMonth.push({ month: m + 1, hours: monthHours });
    }
  }

  return {
    totalHours,
    remainingHours: Math.max(0, MAX_STUDENT_HOURS_PER_YEAR - totalHours),
    maxHours: MAX_STUDENT_HOURS_PER_YEAR,
    percentUsed: Math.round((totalHours / MAX_STUDENT_HOURS_PER_YEAR) * 1000) / 10,
    byMonth,
  };
}
