"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import type { Transaction, TransactionSummary } from "@studeo/shared";
import {
  TransactionType,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "@studeo/shared";
import { cn } from "@/lib/utils";

interface TxForm {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const emptyForm: TxForm = {
  type: TransactionType.INCOME,
  amount: 0,
  category: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<TransactionType | "ALL">("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TxForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [txRes, sumRes] = await Promise.all([
        api.get<{ data: Transaction[] }>("/transactions"),
        api.get<{ data: TransactionSummary }>("/transactions/summary"),
      ]);
      setTransactions(txRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categories =
    form.type === TransactionType.INCOME
      ? INCOME_CATEGORIES
      : EXPENSE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.amount <= 0 || !form.category) return;
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, form);
      } else {
        await api.post("/transactions", form);
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
      await fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tx: Transaction) => {
    setForm({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
      date: tx.date.slice(0, 10),
    });
    setEditingId(tx.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette transaction ?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    setError(null);
  };

  const filtered =
    viewType === "ALL"
      ? transactions
      : transactions.filter((t) => t.type === viewType);

  const getCategoryLabel = (category: string): string => {
    const found =
      [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].find(
        (c) => c.id === category
      );
    return found?.label ?? category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Revenus &amp; dépenses</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Revenus totaux</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {"\u20AC"}{summary?.totalIncome?.toLocaleString("fr-BE") ?? "0"}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Dépenses totales</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {"\u20AC"}{summary?.totalExpenses?.toLocaleString("fr-BE") ?? "0"}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Solde net</span>
          </div>
          <div
            className={cn(
              "text-2xl font-bold",
              (summary?.netAmount ?? 0) >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {"\u20AC"}{summary?.netAmount?.toLocaleString("fr-BE") ?? "0"}
          </div>
        </div>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Modifier la transaction" : "Nouvelle transaction"}
          </h3>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type toggle */}
            <div>
              <label className="label">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      type: TransactionType.INCOME,
                      category: "",
                    })
                  }
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    form.type === TransactionType.INCOME
                      ? "bg-green-100 text-green-700 ring-2 ring-green-500"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  Revenu
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      type: TransactionType.EXPENSE,
                      category: "",
                    })
                  }
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    form.type === TransactionType.EXPENSE
                      ? "bg-red-100 text-red-700 ring-2 ring-red-500"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  Dépense
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Montant ({"\u20AC"})</label>
                <input
                  type="number"
                  className="input"
                  min="0.01"
                  step="0.01"
                  value={form.amount || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="label">Catégorie</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <input
                  type="text"
                  className="input"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Description (optionnel)"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {submitting
                  ? "Enregistrement..."
                  : editingId
                    ? "Mettre à jour"
                    : "Ajouter"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(
          [
            { key: "ALL" as const, label: "Tout" },
            { key: TransactionType.INCOME, label: "Revenus" },
            { key: TransactionType.EXPENSE, label: "Dépenses" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setViewType(key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              viewType === key
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Transactions list */}
      <div className="card">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucune transaction enregistrée.
          </p>
        ) : (
          <div className="divide-y">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-4 px-4 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center",
                      tx.type === TransactionType.INCOME
                        ? "bg-green-100"
                        : "bg-red-100"
                    )}
                  >
                    {tx.type === TransactionType.INCOME ? (
                      <ArrowUpCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {tx.description || getCategoryLabel(tx.category)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getCategoryLabel(tx.category)} &middot;{" "}
                      {new Date(tx.date).toLocaleDateString("fr-BE")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      tx.type === TransactionType.INCOME
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {tx.type === TransactionType.INCOME ? "+" : "-"}
                    {"\u20AC"}
                    {tx.amount.toLocaleString("fr-BE")}
                  </span>
                  <button
                    onClick={() => handleEdit(tx)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
