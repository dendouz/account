"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerApi, saveTokens } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    studentStatus: "JOBISTE",
    region: "BRUSSELS",
  });

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await registerApi(form);
      saveTokens(result.accessToken, result.refreshToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Studeo</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Crée ton compte</h1>
          <p className="text-gray-500 mt-1">
            {step === 1 ? "Étape 1/2 — Tes identifiants" : "Étape 2/2 — Ton profil"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {step === 1 ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="firstName">Prénom</label>
                  <input
                    id="firstName"
                    className="input"
                    placeholder="Marie"
                    value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="lastName">Nom</label>
                  <input
                    id="lastName"
                    className="input"
                    placeholder="Dupont"
                    value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="marie@student.be"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="Min. 8 caractères"
                  value={form.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <button type="submit" className="btn-primary w-full">Continuer</button>
            </>
          ) : (
            <>
              <div>
                <label className="label" htmlFor="studentStatus">Ton statut</label>
                <select
                  id="studentStatus"
                  className="input"
                  value={form.studentStatus}
                  onChange={(e) => updateForm("studentStatus", e.target.value)}
                >
                  <option value="JOBISTE">Étudiant jobiste</option>
                  <option value="INDEPENDENT">Étudiant indépendant</option>
                  <option value="ENTREPRENEUR">Étudiant entrepreneur</option>
                  <option value="OTHER">Autre / Je ne sais pas</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Tu pourras changer ça plus tard.</p>
              </div>
              <div>
                <label className="label" htmlFor="region">Ta région</label>
                <select
                  id="region"
                  className="input"
                  value={form.region}
                  onChange={(e) => updateForm("region", e.target.value)}
                >
                  <option value="BRUSSELS">Bruxelles</option>
                  <option value="WALLONIA">Wallonie</option>
                  <option value="FLANDERS">Flandre</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                  Retour
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? "Création..." : "Créer mon compte"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-primary-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
