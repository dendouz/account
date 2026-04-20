import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Prêt à simplifier ton admin ?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Rejoins des milliers d&apos;étudiants belges qui gèrent leur situation en toute sérénité.
        </p>
        <Link
          href="/auth/register"
          className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
        >
          Créer mon compte gratuit
        </Link>
        <p className="text-sm text-primary-200 mt-4">
          100% gratuit. Tes données restent en Belgique.
        </p>
      </div>
    </section>
  );
}
