import { PrismaClient } from "@prisma/client";
import {
  calculateTaxableIncome,
  calculateIncomeTax,
  calculateSolidarityContribution,
  calculateIndependentSocialContributions,
  evaluateThresholds,
} from "@studeo/shared";

const prisma = new PrismaClient();

export async function simulateTax(userId: string, year?: number) {
  const targetYear = year ?? new Date().getFullYear();
  const startDate = new Date(`${targetYear}-01-01`);
  const endDate = new Date(`${targetYear + 1}-01-01`);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: startDate, lt: endDate } },
  });

  const hours = await prisma.workHour.findMany({
    where: { userId, date: { gte: startDate, lt: endDate } },
  });

  const grossIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalHours = hours.reduce((sum, h) => sum + h.hours, 0);

  const isIndependent = user.studentStatus === "INDEPENDENT" || user.studentStatus === "ENTREPRENEUR";
  const netIncome = grossIncome - totalExpenses;
  const taxableIncome = calculateTaxableIncome(grossIncome, isIndependent ? totalExpenses : undefined);
  const estimatedTax = calculateIncomeTax(taxableIncome);

  let socialContributions: number;
  if (isIndependent) {
    socialContributions = calculateIndependentSocialContributions(netIncome);
  } else {
    socialContributions = calculateSolidarityContribution(grossIncome);
  }

  const thresholdWarnings = evaluateThresholds({
    totalHours,
    grossIncome,
    netIncome,
    isIndependent,
  });

  return {
    grossIncome: Math.round(grossIncome * 100) / 100,
    taxFreeAllowance: 10910,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    estimatedTax: Math.round(estimatedTax * 100) / 100,
    socialContributions: Math.round(socialContributions * 100) / 100,
    netIncome: Math.round((grossIncome - estimatedTax - socialContributions) * 100) / 100,
    thresholdWarnings,
  };
}
