"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Clock,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import type { WorkHourEntry, HoursSummary } from "@studeo/shared";
import { MAX_STUDENT_HOURS_PER_YEAR } from "@studeo/shared";
import { cn } from "@/lib/utils";

interface HourForm {
  date: string;
  hours: number;
  employer: string;
  description: string;
}

const emptyForm: HourForm = {
  date: new Date().toISOString().slice(0, 10),
  hours: 0,
  employer: "",
  description: "",
};

export default function HoursPage() {
  const [entries, setEntries] = useState<WorkHourEntry[]>([]);
  const [summary, setSummary] = useState<HoursSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HourForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [hoursRes, summaryRes] = await Promise.all([
        api.get<{ data: WorkHourEntry[] }>("/hours"),
        api.get<{ data: HoursSummary }>("/hours/summary"),
      ]);
      setEntries(hoursRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.hours <= 0 || !form.employer.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await api.put(`/hours/${editingId}`, form);
      } else {
        await api.post("/hours", form);
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

  const handleEdit = (entry: WorkHourEntry) => {
    setForm({
      date: entry.date.slice(0, 10),
      hours: entry.hours,
      employer: entry.employer,
      description: entry.description,
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette entrée ?")) return;
    try {
      await api.delete(`/hours/${id}`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const totalHours = summary?.totalHours ?? 0;
  const remainingHours = summary?.remainingHours ?? MAX_STUDENT_HOURS_PER_YEAR;
  const percentUsed = summary?.percentUsed ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suivi des heures</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter des heures
          </button>
        )}
      </div>

      {/* Hours gauge */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Compteur d&apos;heures</h2>
            <p className="text-sm text-gray-500">
              Année en cours
            </p>
          </div>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-bold text-gray-900">{totalHours}</span>
          <span className="text-xl text-gray-400 mb-1">/ {MAX_STUDENT_HOURS_PER_YEAR}h</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              percentUsed >= 90
                ? "bg-red-500"
                : percentUsed >= 70
                  ? "bg-amber-500"
                  : "bg-blue-500"
            )}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{percentUsed.toFixed(1)}% utilisé</span>
          <span
            className={cn(
              "font-medium",
              remainingHours <= 50 ? "text-red-600" : "text-green-600"
            )}
          >
            {remainingHours}h restantes
          </span>
        </div>
        {percentUsed >= 85 && (
          <div className="mt-3 flex items-center gap-2 text-amber-700 bg-amber-50 rounded-lg p-3 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              Attention : vous approchez de la limite de {MAX_STUDENT_HOURS_PER_YEAR} heures.
              Au-delà, les cotisations sociales normales s&apos;appliquent.
            </span>
          </div>
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Modifier l'entrée" : "Ajouter des heures"}
          </h3>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="label">Nombre d&apos;heures</label>
                <input
                  type="number"
                  className="input"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={form.hours || ""}
                  onChange={(e) =>
                    setForm({ ...form, hours: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="Ex: 4"
                  required
                />
              </div>
              <div>
                <label className="label">Employeur</label>
                <input
                  type="text"
                  className="input"
                  value={form.employer}
                  onChange={(e) => setForm({ ...form, employer: e.target.value })}
                  placeholder="Nom de l'employeur"
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

      {/* Entries list */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historique des heures
        </h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucune heure enregistrée. Commencez par ajouter vos heures de travail.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-gray-500">Date</th>
                  <th className="pb-3 font-medium text-gray-500">Heures</th>
                  <th className="pb-3 font-medium text-gray-500">Employeur</th>
                  <th className="pb-3 font-medium text-gray-500 hidden md:table-cell">
                    Description
                  </th>
                  <th className="pb-3 font-medium text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-900">
                      {new Date(entry.date).toLocaleDateString("fr-BE")}
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-gray-900">
                        {entry.hours}h
                      </span>
                    </td>
                    <td className="py-3 text-gray-700">{entry.employer}</td>
                    <td className="py-3 text-gray-500 hidden md:table-cell">
                      {entry.description || "—"}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
