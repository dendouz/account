export enum StudentStatus {
  JOBISTE = "JOBISTE",
  INDEPENDENT = "INDEPENDENT",
  ENTREPRENEUR = "ENTREPRENEUR",
  OTHER = "OTHER",
}

export enum Region {
  FLANDERS = "FLANDERS",
  WALLONIA = "WALLONIA",
  BRUSSELS = "BRUSSELS",
}

export enum Language {
  FR = "FR",
  NL = "NL",
  EN = "EN",
}

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum DocumentType {
  RECEIPT = "RECEIPT",
  PAYSLIP = "PAYSLIP",
  CONTRACT = "CONTRACT",
  INVOICE = "INVOICE",
  TAX_DOCUMENT = "TAX_DOCUMENT",
  OTHER = "OTHER",
}

export enum ObligationStatus {
  PENDING = "PENDING",
  DONE = "DONE",
  SKIPPED = "SKIPPED",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentStatus: StudentStatus;
  region: Region;
  language: Language;
  birthDate: string | null;
  createdAt: string;
}

export interface WorkHourEntry {
  id: string;
  userId: string;
  date: string;
  hours: number;
  employer: string;
  description: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  documentId: string | null;
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

export interface Obligation {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  category: string;
  studentStatuses: StudentStatus[];
  regions: Region[];
}

export interface UserObligation {
  id: string;
  userId: string;
  obligationId: string;
  obligation: Obligation;
  status: ObligationStatus;
  completedAt: string | null;
}

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  studentStatuses: StudentStatus[];
  order: number;
}

export interface HoursSummary {
  totalHours: number;
  remainingHours: number;
  maxHours: number;
  percentUsed: number;
  byMonth: { month: number; hours: number }[];
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  byCategory: { category: string; amount: number }[];
  byMonth: { month: number; income: number; expenses: number }[];
}

export interface TaxSimulation {
  grossIncome: number;
  taxFreeAllowance: number;
  taxableIncome: number;
  estimatedTax: number;
  socialContributions: number;
  netIncome: number;
  thresholdWarnings: ThresholdWarning[];
}

export interface ThresholdWarning {
  threshold: string;
  limit: number;
  current: number;
  percentUsed: number;
  status: "safe" | "warning" | "exceeded";
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentStatus: StudentStatus;
  region: Region;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
