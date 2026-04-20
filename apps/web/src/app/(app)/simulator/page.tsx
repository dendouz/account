"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Calculator, AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { TaxSimulation } from "@studeo/shared";

export default function SimulatorPage() {
  const [simulation, setSimulation] = useState<TaxSimulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: TaxSimulation }>("/simulator/tax")
      .then((r) => setSimulation(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Simulateur fiscal</h1>
      <p className="text-gray-500 mb-6">Estimation de ta situation fiscale basée sur tes données actuelles.</p>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Ces résultats sont des <strong>estimations à titre indicatif</strong>. Pour un calcul précis de ta situation, consulte un comptable ou le SPF Finances (fin.belgium.be).
        </p>
      </div>

      {simulation && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card text-center">
              <p className="text-sm text-gray-500 mb-1">Revenu brut</p>
              <p className="text-3xl font-bold text-gray-900">€{simulation.grossIncome.toLocaleString("fr-BE")}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-500 mb-1">Impôts estimés</p>
              <p className="text-3xl font-bold text-red-600">€{simulation.estimatedTax.toLocaleString("fr-BE")}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-500 mb-1">Revenu net estimé</p>
              <p className="text-3xl font-bold text-green-600">€{simulation.netIncome.toLocaleString("fr-BE")}</p>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="card mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Détail du calcul</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Revenu brut total</span>
                <span className="font-medium">€{simulation.grossIncome.toLocaleString("fr-BE")}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Montant exonéré</span>
                <span className="font-medium text-green-600">- €{simulation.taxFreeAllowance.toLocaleString("fr-BE")}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Revenu imposable</span>
                <span className="font-medium">€{simulation.taxableIncome.toLocaleString("fr-BE")}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Impôt sur le revenu estimé</span>
                <span className="font-medium text-red-600">€{simulation.estimatedTax.toLocaleString("fr-BE")}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Cotisations sociales</span>
                <span className="font-medium text-red-600">€{simulation.socialContributions.toLocaleString("fr-BE")}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-lg">
                <span className="text-gray-900">Revenu net estimé</span>
                <span className="text-green-600">€{simulation.netIncome.toLocaleString("fr-BE")}</span>
              </div>
            </div>
          </div>

          {/* Thresholds */}
          {simulation.thresholdWarnings.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Seuils</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simulation.thresholdWarnings.map((w) => (
                  <div key={w.threshold} className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{w.threshold}</span>
                      <span className={`badge ${w.status === "safe" ? "badge-safe" : w.status === "warning" ? "badge-warning" : "badge-danger"}`}>
                        {w.status === "safe" ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                        {w.percentUsed}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${w.status === "safe" ? "bg-green-500" : w.status === "warning" ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(w.percentUsed, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{w.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
