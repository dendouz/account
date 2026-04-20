"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Clock, TrendingUp, AlertTriangle, CheckCircle, Calendar, Calculator } from "lucide-react";
import type { HoursSummary, TransactionSummary, TaxSimulation } from "@studeo/shared";
import { MAX_STUDENT_HOURS_PER_YEAR } from "@studeo/shared";

export default function DashboardPage() {
  const [hoursSummary, setHoursSummary] = useState<HoursSummary | null>(null);
  const [txSummary, setTxSummary] = useState<TransactionSummary | null>(null);
  const [taxSim, setTaxSim] = useState<TaxSimulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: HoursSummary }>("/hours/summary").then((r) => setHoursSummary(r.data)),
      api.get<{ data: TransactionSummary }>("/transactions/summary").then((r) => setTxSummary(r.data)),
      api.get<{ data: TaxSimulation }>("/simulator/tax").then((r) => setTaxSim(r.data)),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
    </div>;
  }

  const hoursPercent = hoursSummary ? (hoursSummary.totalHours / MAX_STUDENT_HOURS_PER_YEAR) * 100 : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm text-gray-500">Heures utilisées</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {hoursSummary?.totalHours ?? 0}
            <span className="text-lg text-gray-400">/{MAX_STUDENT_HOURS_PER_YEAR}</span>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                hoursPercent >= 90 ? "bg-red-500" : hoursPercent >= 70 ? "bg-amber-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(hoursPercent, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {hoursSummary?.remainingHours ?? MAX_STUDENT_HOURS_PER_YEAR}h restantes
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-500">Revenus nets</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            €{txSummary?.netAmount?.toLocaleString("fr-BE") ?? "0"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            €{txSummary?.totalIncome?.toLocaleString("fr-BE") ?? "0"} revenus — €
            {txSummary?.totalExpenses?.toLocaleString("fr-BE") ?? "0"} dépenses
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm text-gray-500">Impôts estimés</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            €{taxSim?.estimatedTax?.toLocaleString("fr-BE") ?? "0"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Cotisations: €{taxSim?.socialContributions?.toLocaleString("fr-BE") ?? "0"}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-sm text-gray-500">Prochaine échéance</div>
          </div>
          <div className="text-xl font-bold text-gray-900">15 juillet 2026</div>
          <div className="text-xs text-amber-600 font-medium mt-1">Déclaration fiscale en ligne</div>
        </div>
      </div>

      {/* Threshold warnings */}
      {taxSim?.thresholdWarnings && taxSim.thresholdWarnings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Seuils à surveiller</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxSim.thresholdWarnings.map((warning) => (
              <div key={warning.threshold} className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{warning.threshold}</span>
                  <span
                    className={`badge ${
                      warning.status === "safe"
                        ? "badge-safe"
                        : warning.status === "warning"
                          ? "badge-warning"
                          : "badge-danger"
                    }`}
                  >
                    {warning.status === "safe" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {warning.status === "warning" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {warning.status === "exceeded" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {warning.percentUsed}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${
                      warning.status === "safe"
                        ? "bg-green-500"
                        : warning.status === "warning"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(warning.percentUsed, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{warning.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
