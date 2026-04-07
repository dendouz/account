/**
 * Belgian regulatory constants for students.
 *
 * Sources:
 * - Student work hours: L&E Global, studentatwork.be (650h from Jan 1, 2025)
 * - Tax thresholds: fin.belgium.be (assessment year 2026, income year 2025)
 * - Social contributions: INASTI/RSVZ, securex.be
 * - VAT: SPF Finances, jobbers.io
 * - Family allowances: Groeipakket
 */

/** Maximum student work hours per year with reduced social contributions */
export const MAX_STUDENT_HOURS_PER_YEAR = 650;

/** Reduced solidarity contribution rate for student workers (employee share) */
export const STUDENT_SOLIDARITY_RATE = 0.0271;

/** Employer solidarity contribution rate for student workers */
export const EMPLOYER_SOLIDARITY_RATE = 0.0542;

/** Standard employee social security contribution rate */
export const STANDARD_SOCIAL_RATE = 0.1307;

/** Tax-free personal allowance (income year 2025, assessment year 2026) */
export const TAX_FREE_ALLOWANCE = 10910;

/** Standard professional expense deduction rate */
export const PROFESSIONAL_EXPENSE_RATE = 0.3;

/** Maximum professional expense deduction */
export const MAX_PROFESSIONAL_EXPENSE_DEDUCTION = 5930;

/** Approximate maximum gross income before owing tax (with 30% deduction) */
export const MAX_GROSS_NO_TAX = 15585;

/** Student-independent: below this net income, no social contributions */
export const INDEPENDENT_EXEMPT_THRESHOLD = 8687.04;

/** Student-independent: below this net income, reduced social contributions */
export const INDEPENDENT_REDUCED_THRESHOLD = 17374.08;

/** VAT exemption threshold for small businesses */
export const VAT_EXEMPTION_THRESHOLD = 25000;

/** Maximum net income to remain a tax dependent (personne à charge) - base */
export const DEPENDENT_STATUS_THRESHOLD = 7290;

/** Student work income exemption for dependent status calculation */
export const STUDENT_WORK_EXEMPTION = 3360;

/** Family allowance income limit for self-employed students */
export const FAMILY_ALLOWANCE_INCOME_LIMIT = 16861.46;

/** Minimum age for student-independent status */
export const STUDENT_INDEPENDENT_MIN_AGE = 18;

/** Maximum age for student-independent status */
export const STUDENT_INDEPENDENT_MAX_AGE = 25;

/** Belgian income tax brackets (income year 2025) */
export const TAX_BRACKETS = [
  { min: 0, max: 15820, rate: 0.25 },
  { min: 15820, max: 27920, rate: 0.4 },
  { min: 27920, max: 48320, rate: 0.45 },
  { min: 48320, max: Infinity, rate: 0.5 },
] as const;

/** Key deadline dates for 2026 (assessment year 2026, income year 2025) */
export const DEADLINES_2026 = {
  TAX_RETURN_PAPER: "2026-06-30",
  TAX_RETURN_ONLINE: "2026-07-15",
  TAX_RETURN_SELF_EMPLOYED: "2026-10-16",
} as const;

/** Income categories for student workers */
export const INCOME_CATEGORIES = [
  { id: "student_job", label: "Job étudiant", icon: "briefcase" },
  { id: "freelance", label: "Freelance", icon: "laptop" },
  { id: "internship", label: "Stage rémunéré", icon: "graduation-cap" },
  { id: "scholarship", label: "Bourse", icon: "award" },
  { id: "other_income", label: "Autre revenu", icon: "plus-circle" },
] as const;

/** Expense categories */
export const EXPENSE_CATEGORIES = [
  { id: "supplies", label: "Fournitures", icon: "shopping-bag" },
  { id: "transport", label: "Transport", icon: "car" },
  { id: "software", label: "Logiciels & outils", icon: "monitor" },
  { id: "phone_internet", label: "Téléphone & internet", icon: "wifi" },
  { id: "professional", label: "Frais professionnels", icon: "file-text" },
  { id: "training", label: "Formation", icon: "book-open" },
  { id: "insurance", label: "Assurance", icon: "shield" },
  { id: "other_expense", label: "Autre dépense", icon: "more-horizontal" },
] as const;

/** Document type labels */
export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  RECEIPT: "Reçu / Ticket",
  PAYSLIP: "Fiche de paie",
  CONTRACT: "Contrat",
  INVOICE: "Facture",
  TAX_DOCUMENT: "Document fiscal",
  OTHER: "Autre",
};
