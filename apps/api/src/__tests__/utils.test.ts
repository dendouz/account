import { describe, it, expect } from "vitest";
import {
  calculateIncomeTax,
  calculateTaxableIncome,
  calculateSolidarityContribution,
  calculateIndependentSocialContributions,
  calculateProfessionalExpenseDeduction,
  evaluateThresholds,
  formatEUR,
  formatDateBE,
  getCurrentAcademicYear,
} from "@studeo/shared";

describe("Tax Calculator", () => {
  describe("calculateProfessionalExpenseDeduction", () => {
    it("should apply 30% deduction for low income", () => {
      expect(calculateProfessionalExpenseDeduction(5000)).toBe(1500);
    });

    it("should cap deduction at €5,930", () => {
      expect(calculateProfessionalExpenseDeduction(30000)).toBe(5930);
    });

    it("should return 0 for zero income", () => {
      expect(calculateProfessionalExpenseDeduction(0)).toBe(0);
    });
  });

  describe("calculateTaxableIncome", () => {
    it("should apply forfaitaire deduction when no actual expenses", () => {
      const taxable = calculateTaxableIncome(10000);
      expect(taxable).toBe(7000); // 10000 - 3000 (30%)
    });

    it("should use actual expenses when provided", () => {
      const taxable = calculateTaxableIncome(10000, 4000);
      expect(taxable).toBe(6000);
    });

    it("should never return negative", () => {
      const taxable = calculateTaxableIncome(1000, 5000);
      expect(taxable).toBe(0);
    });
  });

  describe("calculateIncomeTax", () => {
    it("should return 0 when taxable income is below tax-free allowance", () => {
      expect(calculateIncomeTax(8000)).toBe(0);
    });

    it("should return 0 for zero income", () => {
      expect(calculateIncomeTax(0)).toBe(0);
    });

    it("should calculate tax correctly for income in first bracket", () => {
      // Income: 15000, after allowance (10910): 4090
      // 4090 * 25% = 1022.50
      const tax = calculateIncomeTax(15000);
      expect(tax).toBe(1022.5);
    });

    it("should calculate tax correctly for higher income", () => {
      // Income: 30000, after allowance (10910): 19090
      // First bracket (0-15820): 15820 * 25% = 3955
      // Second bracket (15820-19090): 3270 * 40% = 1308
      // Total: 5263
      const tax = calculateIncomeTax(30000);
      expect(tax).toBe(5263);
    });
  });

  describe("calculateSolidarityContribution", () => {
    it("should apply 2.71% rate", () => {
      const contribution = calculateSolidarityContribution(10000);
      expect(contribution).toBe(271);
    });

    it("should return 0 for zero income", () => {
      expect(calculateSolidarityContribution(0)).toBe(0);
    });
  });

  describe("calculateIndependentSocialContributions", () => {
    it("should return 0 below exemption threshold", () => {
      expect(calculateIndependentSocialContributions(5000)).toBe(0);
    });

    it("should return 0 at exactly the threshold", () => {
      expect(calculateIndependentSocialContributions(8687.04)).toBe(0);
    });

    it("should calculate reduced contributions between thresholds", () => {
      const contrib = calculateIndependentSocialContributions(12000);
      // (12000 - 8687.04) * 0.205 = 679.16
      expect(contrib).toBeCloseTo(679.16, 0);
    });

    it("should calculate full contributions above upper threshold", () => {
      const contrib = calculateIndependentSocialContributions(20000);
      // 20000 * 0.205 = 4100
      expect(contrib).toBe(4100);
    });
  });
});

describe("Threshold Evaluator", () => {
  it("should return safe status when below thresholds", () => {
    const warnings = evaluateThresholds({
      totalHours: 100,
      grossIncome: 3000,
      netIncome: 2500,
      isIndependent: false,
    });

    const hoursWarning = warnings.find((w) => w.threshold === "Heures étudiant");
    expect(hoursWarning?.status).toBe("safe");
  });

  it("should return warning status when approaching threshold", () => {
    const warnings = evaluateThresholds({
      totalHours: 550,
      grossIncome: 3000,
      netIncome: 2500,
      isIndependent: false,
    });

    const hoursWarning = warnings.find((w) => w.threshold === "Heures étudiant");
    expect(hoursWarning?.status).toBe("warning");
  });

  it("should return exceeded status when over threshold", () => {
    const warnings = evaluateThresholds({
      totalHours: 700,
      grossIncome: 3000,
      netIncome: 2500,
      isIndependent: false,
    });

    const hoursWarning = warnings.find((w) => w.threshold === "Heures étudiant");
    expect(hoursWarning?.status).toBe("exceeded");
  });

  it("should include independent-specific thresholds for independents", () => {
    const warnings = evaluateThresholds({
      totalHours: 0,
      grossIncome: 5000,
      netIncome: 4000,
      isIndependent: true,
    });

    const vatWarning = warnings.find((w) => w.threshold === "Seuil TVA");
    expect(vatWarning).toBeDefined();

    const socialWarning = warnings.find((w) => w.threshold === "Cotisations sociales (indépendant)");
    expect(socialWarning).toBeDefined();
  });

  it("should not include independent thresholds for non-independents", () => {
    const warnings = evaluateThresholds({
      totalHours: 100,
      grossIncome: 5000,
      netIncome: 4000,
      isIndependent: false,
    });

    const vatWarning = warnings.find((w) => w.threshold === "Seuil TVA");
    expect(vatWarning).toBeUndefined();
  });
});

describe("Formatters", () => {
  it("should format EUR correctly in Belgian format", () => {
    const formatted = formatEUR(1234.56);
    // Belgian format uses comma for decimal, period/space for thousands
    expect(formatted).toContain("1");
    expect(formatted).toContain("234");
    expect(formatted).toContain("€");
  });

  it("should format date in Belgian format", () => {
    const formatted = formatDateBE("2026-07-15");
    expect(formatted).toContain("15");
    expect(formatted).toContain("07");
    expect(formatted).toContain("2026");
  });

  it("should return correct academic year", () => {
    const year = getCurrentAcademicYear();
    expect(year).toMatch(/^\d{4}-\d{4}$/);
  });
});
