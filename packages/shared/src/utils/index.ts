import {
  TAX_FREE_ALLOWANCE,
  TAX_BRACKETS,
  PROFESSIONAL_EXPENSE_RATE,
  MAX_PROFESSIONAL_EXPENSE_DEDUCTION,
  MAX_STUDENT_HOURS_PER_YEAR,
  INDEPENDENT_EXEMPT_THRESHOLD,
  INDEPENDENT_REDUCED_THRESHOLD,
  VAT_EXEMPTION_THRESHOLD,
  STUDENT_SOLIDARITY_RATE,
  DEPENDENT_STATUS_THRESHOLD,
  STUDENT_WORK_EXEMPTION,
  FAMILY_ALLOWANCE_INCOME_LIMIT,
} from "../constants/index.js";

import type { ThresholdWarning } from "../types/index.js";

/**
 * Calculate professional expense deduction (forfaitaire).
 * Standard 30% deduction capped at MAX_PROFESSIONAL_EXPENSE_DEDUCTION.
 */
export function calculateProfessionalExpenseDeduction(grossIncome: number): number {
  const deduction = grossIncome * PROFESSIONAL_EXPENSE_RATE;
  return Math.min(deduction, MAX_PROFESSIONAL_EXPENSE_DEDUCTION);
}

/**
 * Calculate taxable income after deductions.
 */
export function calculateTaxableIncome(grossIncome: number, actualExpenses?: number): number {
  const deduction = actualExpenses ?? calculateProfessionalExpenseDeduction(grossIncome);
  return Math.max(0, grossIncome - deduction);
}

/**
 * Calculate income tax based on Belgian progressive brackets.
 */
export function calculateIncomeTax(taxableIncome: number): number {
  const afterAllowance = Math.max(0, taxableIncome - TAX_FREE_ALLOWANCE);
  let tax = 0;
  let remaining = afterAllowance;

  for (const bracket of TAX_BRACKETS) {
    const bracketWidth = bracket.max === Infinity ? remaining : bracket.max - bracket.min;
    const taxableInBracket = Math.min(remaining, bracketWidth);
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
    if (remaining <= 0) break;
  }

  return Math.round(tax * 100) / 100;
}

/**
 * Calculate student worker solidarity contribution.
 */
export function calculateSolidarityContribution(grossIncome: number): number {
  return Math.round(grossIncome * STUDENT_SOLIDARITY_RATE * 100) / 100;
}

/**
 * Calculate social contributions for student-independents based on net income.
 */
export function calculateIndependentSocialContributions(netAnnualIncome: number): number {
  if (netAnnualIncome <= INDEPENDENT_EXEMPT_THRESHOLD) {
    return 0;
  }
  if (netAnnualIncome <= INDEPENDENT_REDUCED_THRESHOLD) {
    // Reduced rate: approximately 20.5% on income above threshold
    return Math.round((netAnnualIncome - INDEPENDENT_EXEMPT_THRESHOLD) * 0.205 * 100) / 100;
  }
  // Full rate: standard self-employed contributions
  return Math.round(netAnnualIncome * 0.205 * 100) / 100;
}

/**
 * Generate threshold warnings based on current financial situation.
 */
export function evaluateThresholds(params: {
  totalHours: number;
  grossIncome: number;
  netIncome: number;
  isIndependent: boolean;
}): ThresholdWarning[] {
  const warnings: ThresholdWarning[] = [];

  // Hours threshold (student workers)
  const hoursPercent = (params.totalHours / MAX_STUDENT_HOURS_PER_YEAR) * 100;
  warnings.push({
    threshold: "Heures étudiant",
    limit: MAX_STUDENT_HOURS_PER_YEAR,
    current: params.totalHours,
    percentUsed: Math.round(hoursPercent * 10) / 10,
    status: hoursPercent >= 100 ? "exceeded" : hoursPercent >= 80 ? "warning" : "safe",
    description: `${params.totalHours}h utilisées sur ${MAX_STUDENT_HOURS_PER_YEAR}h. Au-delà, cotisations sociales complètes.`,
  });

  // Dependent status threshold
  const netForDependent = Math.max(0, params.grossIncome - STUDENT_WORK_EXEMPTION);
  const dependentPercent = (netForDependent / DEPENDENT_STATUS_THRESHOLD) * 100;
  warnings.push({
    threshold: "Personne à charge",
    limit: DEPENDENT_STATUS_THRESHOLD,
    current: netForDependent,
    percentUsed: Math.round(dependentPercent * 10) / 10,
    status: dependentPercent >= 100 ? "exceeded" : dependentPercent >= 80 ? "warning" : "safe",
    description: `Revenus nets: €${netForDependent.toFixed(0)} sur €${DEPENDENT_STATUS_THRESHOLD} max pour rester à charge.`,
  });

  // Tax-free threshold
  const taxableIncome = calculateTaxableIncome(params.grossIncome);
  const taxPercent = (taxableIncome / TAX_FREE_ALLOWANCE) * 100;
  warnings.push({
    threshold: "Exonération fiscale",
    limit: TAX_FREE_ALLOWANCE,
    current: taxableIncome,
    percentUsed: Math.round(taxPercent * 10) / 10,
    status: taxPercent >= 100 ? "exceeded" : taxPercent >= 80 ? "warning" : "safe",
    description: `Revenu imposable: €${taxableIncome.toFixed(0)} sur €${TAX_FREE_ALLOWANCE} d'exonération.`,
  });

  // Independent-specific thresholds
  if (params.isIndependent) {
    // Social contributions threshold
    const socialPercent = (params.netIncome / INDEPENDENT_EXEMPT_THRESHOLD) * 100;
    warnings.push({
      threshold: "Cotisations sociales (indépendant)",
      limit: INDEPENDENT_EXEMPT_THRESHOLD,
      current: params.netIncome,
      percentUsed: Math.round(socialPercent * 10) / 10,
      status: socialPercent >= 100 ? "exceeded" : socialPercent >= 80 ? "warning" : "safe",
      description: `Revenu net: €${params.netIncome.toFixed(0)} sur €${INDEPENDENT_EXEMPT_THRESHOLD} avant cotisations sociales.`,
    });

    // VAT threshold
    const vatPercent = (params.grossIncome / VAT_EXEMPTION_THRESHOLD) * 100;
    warnings.push({
      threshold: "Seuil TVA",
      limit: VAT_EXEMPTION_THRESHOLD,
      current: params.grossIncome,
      percentUsed: Math.round(vatPercent * 10) / 10,
      status: vatPercent >= 100 ? "exceeded" : vatPercent >= 80 ? "warning" : "safe",
      description: `Chiffre d'affaires: €${params.grossIncome.toFixed(0)} sur €${VAT_EXEMPTION_THRESHOLD} d'exemption TVA.`,
    });
  }

  // Family allowance threshold
  const familyPercent = (params.netIncome / FAMILY_ALLOWANCE_INCOME_LIMIT) * 100;
  warnings.push({
    threshold: "Allocations familiales",
    limit: FAMILY_ALLOWANCE_INCOME_LIMIT,
    current: params.netIncome,
    percentUsed: Math.round(familyPercent * 10) / 10,
    status: familyPercent >= 100 ? "exceeded" : familyPercent >= 80 ? "warning" : "safe",
    description: `Revenu net: €${params.netIncome.toFixed(0)} sur €${FAMILY_ALLOWANCE_INCOME_LIMIT} max pour les allocations familiales.`,
  });

  return warnings;
}

/**
 * Format currency in EUR (Belgian format).
 */
export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Format date in Belgian format (DD/MM/YYYY).
 */
export function formatDateBE(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Format percentage.
 */
export function formatPercent(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

/**
 * Get the current academic year string (e.g., "2025-2026").
 */
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  if (month >= 8) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

/**
 * Get the current tax year (calendar year for income).
 */
export function getCurrentTaxYear(): number {
  return new Date().getFullYear();
}
