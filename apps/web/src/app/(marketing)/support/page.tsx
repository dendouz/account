import Link from "next/link";
import { Mail, MessageCircle, BookOpen, ExternalLink } from "lucide-react";

export const metadata = { title: "Support — Studeo" };

const faq = [
  {
    q: "Comment sont calculées mes estimations fiscales ?",
    a: "Studeo utilise les barèmes officiels du SPF Finances et les seuils publiés par l'ONSS et l'INASTI pour estimer ta situation. Ces calculs sont à titre indicatif et ne remplacent pas un avis professionnel.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui. Tes données sont stockées sur des serveurs sécurisés en Union Européenne, tes mots de passe sont hashés avec bcrypt, et toutes les communications sont chiffrées (HTTPS/TLS).",
  },
  {
    q: "Combien coûte Studeo ?",
    a: "Studeo est actuellement 100% gratuit pour tous les étudiants belges. Aucune carte de crédit n'est requise.",
  },
  {
    q: "Comment supprimer mon compte ?",
    a: "Envoie un email à support@studeo.be avec ta demande de suppression. Nous supprimerons ton compte et toutes tes données dans les 30 jours.",
  },
  {
    q: "Les 650 heures ont-elles changé récemment ?",
    a: "Oui, depuis le 1er janvier 2025, le contingent est passé de 475 à 650 heures par an de manière permanente.",
  },
  {
    q: "Studeo est-il un comptable ?",
    a: "Non. Studeo est un outil d'information et de suivi. Pour des questions fiscales complexes, consulte toujours un comptable ou le SPF Finances.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-primary-600 text-sm hover:underline mb-8 inline-block">&larr; Retour à l&apos;accueil</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
        <p className="text-gray-500 mb-8">Une question ? Consulte la FAQ ou contacte-nous.</p>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="card flex items-start gap-4">
            <Mail className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="text-sm text-gray-500">support@studeo.be</p>
              <p className="text-xs text-gray-400 mt-1">Réponse sous 48h</p>
            </div>
          </div>
          <div className="card flex items-start gap-4">
            <BookOpen className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Guide pratique</h3>
              <Link href="/knowledge" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                Consulter le guide <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
        <div className="space-y-4">
          {faq.map((item) => (
            <div key={item.q} className="card">
              <h3 className="font-medium text-gray-900 mb-2">{item.q}</h3>
              <p className="text-sm text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>

        {/* Useful links */}
        <h2 className="text-xl font-bold text-gray-900 mt-12 mb-6">Liens utiles</h2>
        <div className="space-y-2">
          {[
            { label: "Student@work — Compteur d'heures", url: "https://www.studentatwork.be" },
            { label: "SPF Finances — Tax-on-web", url: "https://fin.belgium.be" },
            { label: "INASTI — Étudiants indépendants", url: "https://www.rsvz-inasti.fgov.be" },
            { label: "Groeipakket — Allocations familiales", url: "https://www.groeipakket.be" },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary-600 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
