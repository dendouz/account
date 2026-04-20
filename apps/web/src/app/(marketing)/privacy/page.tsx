import Link from "next/link";

export const metadata = { title: "Politique de confidentialité — Studeo" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-primary-600 text-sm hover:underline mb-8 inline-block">&larr; Retour à l&apos;accueil</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 7 avril 2026</p>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Responsable du traitement</h2>
            <p>Studeo est un service développé et opéré en Belgique. Contact : privacy@studeo.be</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Données collectées</h2>
            <p><strong>Données de compte :</strong> nom, prénom, email, mot de passe (hashé), date de naissance, statut étudiant, région, préférence de langue.</p>
            <p><strong>Données financières :</strong> heures de travail, revenus et dépenses, documents téléchargés.</p>
            <p><strong>Données techniques :</strong> adresse IP, type de navigateur, dates d&apos;accès.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Base juridique</h2>
            <p>Conformément au RGPD (Règlement (UE) 2016/679) :</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Exécution du contrat</strong> (Art. 6(1)(b)) : pour fournir le service.</li>
              <li><strong>Consentement</strong> (Art. 6(1)(a)) : pour tout traitement non essentiel.</li>
              <li><strong>Intérêt légitime</strong> (Art. 6(1)(f)) : pour la sécurité du service.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Durée de conservation</h2>
            <p>Données de compte : jusqu&apos;à suppression du compte. Données financières : 7 ans (obligation fiscale belge, Art. 315 CIR). Documents : jusqu&apos;à suppression. Logs : 12 mois max.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits d&apos;accès (Art. 15), de rectification (Art. 16), d&apos;effacement (Art. 17), de portabilité (Art. 20), d&apos;opposition (Art. 21) et de limitation (Art. 18). Contact : privacy@studeo.be</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Autorité de contrôle</h2>
            <p>Autorité de Protection des Données (APD/GBA), Rue de la Presse 35, 1000 Bruxelles. Tél : +32 (0)2 274 48 00. Site : autoriteprotectiondonnees.be</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Cookies</h2>
            <p>Studeo utilise uniquement des cookies strictement nécessaires (authentification). Aucun cookie de tracking. Voir notre <Link href="/cookies" className="text-primary-600 hover:underline">politique de cookies</Link>.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Sécurité</h2>
            <p>Chiffrement TLS, hashage bcrypt des mots de passe, contrôle d&apos;accès strict, sauvegardes régulières. Aucun transfert hors UE.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
