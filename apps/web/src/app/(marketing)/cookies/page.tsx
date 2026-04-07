import Link from "next/link";

export const metadata = { title: "Politique de cookies — Studeo" };

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-primary-600 text-sm hover:underline mb-8 inline-block">&larr; Retour à l&apos;accueil</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de cookies</h1>
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 7 avril 2026</p>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Cookies utilisés</h2>
            <p>Studeo utilise <strong>uniquement des cookies strictement nécessaires</strong> au fonctionnement du service. Aucun cookie publicitaire, de tracking ou d&apos;analyse n&apos;est utilisé.</p>
            <table className="w-full text-sm mt-4">
              <thead><tr className="border-b"><th className="text-left py-2">Cookie</th><th className="text-left py-2">Finalité</th><th className="text-left py-2">Durée</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="py-2 font-mono text-xs">studeo_token</td><td className="py-2">Authentification</td><td className="py-2">15 min</td></tr>
                <tr className="border-b"><td className="py-2 font-mono text-xs">studeo_refresh_token</td><td className="py-2">Renouvellement de session</td><td className="py-2">7 jours</td></tr>
              </tbody>
            </table>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Base juridique</h2>
            <p>L&apos;utilisation de cookies strictement nécessaires est autorisée sans consentement préalable conformément à l&apos;article 129 de la loi belge du 13 juin 2005 relative aux communications électroniques et à la directive ePrivacy (2002/58/CE, Art. 5(3)).</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Gestion des cookies</h2>
            <p>Vous pouvez supprimer les cookies via les paramètres de votre navigateur. La suppression entraînera une déconnexion du service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p>Pour toute question : privacy@studeo.be</p>
          </section>
        </div>
      </div>
    </div>
  );
}
