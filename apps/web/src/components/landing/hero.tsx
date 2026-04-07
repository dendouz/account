import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-accent-50 text-accent-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
          Conçu pour les étudiants belges
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Ton admin,{" "}
          <span className="text-primary-600">en clair.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Studeo t&apos;aide à comprendre ta situation, suivre tes heures et revenus,
          et savoir exactement ce que tu dois faire. Fini le stress administratif.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="btn-primary text-lg py-3.5 px-8">
            Commencer gratuitement
          </Link>
          <Link href="#features" className="btn-secondary text-lg py-3.5 px-8">
            Découvrir Studeo
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-6">
          Gratuit. Sans carte de crédit. Conçu en Belgique.
        </p>

        {/* Hero visual */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 shadow-lg border">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="text-sm text-gray-500 mb-1">Heures utilisées</div>
                <div className="text-3xl font-bold text-primary-600">247<span className="text-lg text-gray-400">/650</span></div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: "38%" }}></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="text-sm text-gray-500 mb-1">Revenus 2026</div>
                <div className="text-3xl font-bold text-accent-600">€4.280</div>
                <div className="text-xs text-green-600 font-medium mt-1">Sous le seuil fiscal</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="text-sm text-gray-500 mb-1">Prochaine échéance</div>
                <div className="text-lg font-bold text-gray-900">15 juil.</div>
                <div className="text-xs text-amber-600 font-medium mt-1">Déclaration fiscale</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
