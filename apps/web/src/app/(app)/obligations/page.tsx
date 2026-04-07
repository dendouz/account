"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CheckCircle, Circle, SkipForward, Calendar, AlertTriangle } from "lucide-react";
import type { UserObligation } from "@studeo/shared";

export default function ObligationsPage() {
  const [obligations, setObligations] = useState<UserObligation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: UserObligation[] }>("/obligations")
      .then((r) => setObligations(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(obligationId: string, status: string) {
    try {
      const res = await api.put<{ data: UserObligation }>(`/obligations/${obligationId}/status`, { status });
      setObligations((prev) => prev.map((o) => (o.obligationId === obligationId ? res.data : o)));
    } catch (err: any) {
      alert(err.message);
    }
  }

  const pending = obligations.filter((o) => o.status === "PENDING");
  const done = obligations.filter((o) => o.status === "DONE");
  const skipped = obligations.filter((o) => o.status === "SKIPPED");

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes obligations</h1>
      <p className="text-gray-500 mb-6">Voici ce que tu dois faire selon ton statut et ta région. Coche au fur et à mesure.</p>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> À faire ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((o) => (
              <div key={o.id} className="card flex items-start gap-4">
                <button onClick={() => updateStatus(o.obligationId, "DONE")} className="mt-0.5 text-gray-300 hover:text-green-500 transition-colors">
                  <Circle className="w-6 h-6" />
                </button>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{o.obligation.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{o.obligation.description}</p>
                  {o.obligation.deadline && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                      <Calendar className="w-3 h-3" />
                      Échéance : {new Date(o.obligation.deadline).toLocaleDateString("fr-BE")}
                    </div>
                  )}
                </div>
                <button onClick={() => updateStatus(o.obligationId, "SKIPPED")} className="text-gray-400 hover:text-gray-600 text-xs" title="Pas applicable">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {done.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" /> Terminé ({done.length})
          </h2>
          <div className="space-y-3">
            {done.map((o) => (
              <div key={o.id} className="card flex items-start gap-4 opacity-70">
                <button onClick={() => updateStatus(o.obligationId, "PENDING")} className="mt-0.5 text-green-500 hover:text-gray-300 transition-colors">
                  <CheckCircle className="w-6 h-6" />
                </button>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 line-through">{o.obligation.title}</h3>
                  {o.completedAt && <p className="text-xs text-gray-400 mt-1">Complété le {new Date(o.completedAt).toLocaleDateString("fr-BE")}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skipped */}
      {skipped.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-3">Pas applicable ({skipped.length})</h2>
          <div className="space-y-2">
            {skipped.map((o) => (
              <div key={o.id} className="card flex items-center gap-4 opacity-50 py-3">
                <button onClick={() => updateStatus(o.obligationId, "PENDING")} className="text-gray-300 hover:text-amber-500">
                  <SkipForward className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-500">{o.obligation.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {obligations.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Aucune obligation</p>
          <p className="text-sm mt-1">Tes obligations apparaîtront ici en fonction de ton profil.</p>
        </div>
      )}
    </div>
  );
}
