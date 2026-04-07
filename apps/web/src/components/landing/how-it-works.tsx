export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Crée ton profil",
      description:
        "Indique ton statut (jobiste, indépendant, entrepreneur) et ta région. Studeo s'adapte à ta situation.",
    },
    {
      number: "2",
      title: "Enregistre tes données",
      description:
        "Ajoute tes heures travaillées, tes revenus et dépenses, et tes documents. Tout est centralisé.",
    },
    {
      number: "3",
      title: "Comprends ta situation",
      description:
        "Studeo te montre où tu en es par rapport à chaque seuil et te dit ce que tu dois faire. En clair.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-gray-500">
            Trois étapes pour ne plus jamais être perdu dans ton admin.
          </p>
        </div>
        <div className="space-y-12">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
