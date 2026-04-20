/**
 * Shared constants for mobile app.
 * Mirrored from @studeo/shared to avoid Metro workspace resolution issues.
 */

export const INCOME_CATEGORIES = [
  { id: "student_job", label: "Job étudiant", icon: "briefcase" },
  { id: "freelance", label: "Freelance", icon: "laptop" },
  { id: "internship", label: "Stage rémunéré", icon: "graduation-cap" },
  { id: "scholarship", label: "Bourse", icon: "award" },
  { id: "other_income", label: "Autre revenu", icon: "plus-circle" },
] as const;

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

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  RECEIPT: "Reçu / Ticket",
  PAYSLIP: "Fiche de paie",
  CONTRACT: "Contrat",
  INVOICE: "Facture",
  TAX_DOCUMENT: "Document fiscal",
  OTHER: "Autre",
};

export const MAX_STUDENT_HOURS_PER_YEAR = 650;
