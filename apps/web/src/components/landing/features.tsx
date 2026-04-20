import {
  Clock,
  TrendingUp,
  FileText,
  CheckSquare,
  Calculator,
  BookOpen,
  Bell,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Compteur d'heures",
    description: "Suis tes heures de travail étudiant et vois combien il t'en reste sur tes 650h annuelles.",
  },
  {
    icon: TrendingUp,
    title: "Revenus & dépenses",
    description: "Enregistre tes revenus et dépenses, visualise ta situation financière en un coup d'œil.",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Photographie et classe tes fiches de paie, reçus et contrats. Tout est sauvegardé.",
  },
  {
    icon: CheckSquare,
    title: "Obligations",
    description: "Sais exactement ce que tu dois faire selon ton statut et ta région. Une checklist personnalisée.",
  },
  {
    icon: Calculator,
    title: "Simulateur fiscal",
    description: "Estime tes impôts et cotisations en temps réel. Anticipe avant qu'il ne soit trop tard.",
  },
  {
    icon: BookOpen,
    title: "Guide pratique",
    description: "Comprends la fiscalité belge étudiante sans jargon. Des explications claires et fiables.",
  },
  {
    icon: Bell,
    title: "Rappels",
    description: "Ne rate plus aucune échéance : déclaration fiscale, cotisations, renouvellements.",
  },
  {
    icon: Shield,
    title: "Seuils & alertes",
    description: "Sois averti avant de dépasser un seuil critique : heures, revenus, personne à charge.",
  },
  {
    icon: Zap,
    title: "Simple & rapide",
    description: "Pensé pour les étudiants, pas les comptables. Tout est fait pour être compris en 3 secondes.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tout ce dont tu as besoin
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Studeo regroupe tout ce qu&apos;un étudiant belge doit savoir et faire, dans une seule app.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 border hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
