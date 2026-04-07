"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { User, Shield, Info } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; description: string }> = {
  JOBISTE: { label: "Étudiant jobiste", description: "Tu travailles sous contrat étudiant (max 650h/an avec cotisations réduites)." },
  INDEPENDENT: { label: "Étudiant indépendant", description: "Tu exerces une activité indépendante (18-25 ans, min. 27 ECTS)." },
  ENTREPRENEUR: { label: "Étudiant entrepreneur", description: "Tu gères ta propre entreprise en tant qu'étudiant." },
  OTHER: { label: "Autre", description: "Tu es étudiant mais ne rentre pas dans les catégories ci-dessus." },
};

const REGION_LABELS: Record<string, string> = {
  BRUSSELS: "Bruxelles",
  WALLONIA: "Wallonie",
  FLANDERS: "Flandre",
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    studentStatus: user?.studentStatus || "JOBISTE",
    region: user?.region || "BRUSSELS",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/profile", form);
      setSaved(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile section */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Profil</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Prénom</label>
              <input className="input" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
            </div>
            <div>
              <label className="label">Nom</label>
              <input className="input" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <label className="label">Email</label>
            <input className="input bg-gray-50" value={user?.email || ""} disabled />
            <p className="text-xs text-gray-400 mt-1">L&apos;email ne peut pas être modifié.</p>
          </div>
        </div>

        {/* Status section */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Statut & région</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Statut étudiant</label>
              <select className="input" value={form.studentStatus} onChange={(e) => updateField("studentStatus", e.target.value)}>
                {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">{STATUS_LABELS[form.studentStatus]?.description}</p>
            </div>
            <div>
              <label className="label">Région</label>
              <select className="input" value={form.region} onChange={(e) => updateField("region", e.target.value)}>
                {Object.entries(REGION_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          {saved && <span className="text-sm text-green-600">Profil mis à jour !</span>}
        </div>
      </form>

      {/* Disclaimer */}
      <div className="card mt-8 bg-gray-50">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-1">À propos de tes données</p>
            <p>Tes données sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers. Tu peux demander la suppression de ton compte et de toutes tes données à tout moment en écrivant à support@studeo.be.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
