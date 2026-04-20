import Link from "next/link";

export const metadata = { title: "Conditions d'utilisation — Studeo" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-primary-600 text-sm hover:underline mb-8 inline-block">&larr; Retour à l&apos;accueil</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions générales d&apos;utilisation</h1>
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 7 avril 2026</p>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Objet</h2>
            <p>Les présentes conditions régissent l&apos;utilisation du service Studeo, accessible via application web et mobile.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Description du Service</h2>
            <p>Studeo est un outil de gestion administrative et financière pour étudiants en Belgique : suivi d&apos;heures, revenus/dépenses, documents, obligations, simulation fiscale et guide pratique.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Avertissement important</h2>
            <p className="font-semibold text-gray-900">Studeo est un outil d&apos;estimation et d&apos;information. Il ne constitue en aucun cas un conseil fiscal, juridique ou comptable.</p>
            <p>Les calculs et informations sont fournis à titre indicatif et ne remplacent pas l&apos;avis d&apos;un professionnel agréé. Les règles fiscales belges sont sujettes à modification.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Tarification</h2>
            <p>L&apos;accès au Service est actuellement gratuit. Studeo se réserve le droit d&apos;introduire des fonctionnalités payantes avec notification préalable.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Obligations de l&apos;utilisateur</h2>
            <p>L&apos;utilisateur s&apos;engage à fournir des informations exactes, utiliser le Service conformément à sa destination, ne pas tenter d&apos;accès non autorisé, et respecter les droits de propriété intellectuelle.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Limitation de responsabilité</h2>
            <p>Studeo ne peut être tenu responsable des décisions prises sur base des informations fournies, des erreurs d&apos;estimation, des interruptions de service, ou des pertes de données indépendantes de sa volonté.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Résiliation</h2>
            <p>L&apos;utilisateur peut supprimer son compte à tout moment. Studeo peut suspendre un compte en cas de violation des présentes Conditions.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Droit applicable</h2>
            <p>Les présentes Conditions sont régies par le droit belge. En cas de litige, les tribunaux de Bruxelles sont seuls compétents.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
